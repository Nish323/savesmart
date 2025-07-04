<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // エラーログ出力のために追加
use App\Services\ZaimServer;
use App\Models\ZaimTemporaryCredential;
use App\Models\User;
use Carbon\Carbon;
use Exception; // Exceptionをuse

class ZaimController extends Controller
{
    /**
     * ZaimのOAuth1サーバー設定を返すプライベートメソッド
     */
    private function getZaimServer(): ZaimServer
    {
        return new ZaimServer([
            'identifier'   => config('services.zaim.client_id'),
            'secret'       => config('services.zaim.client_secret'),
            'callback_uri' => config('services.zaim.redirect'),
        ]);
    }

    /**
     * ユーザーをZaimの認証ページにリダイレクトする
     */
    public function redirect(Request $request)
    {
        try {
            // ユーザーIDをクエリパラメータから取得
            $userId = $request->query('user_id');
            
            if (!$userId) {
                throw new Exception('ユーザーIDが指定されていません。');
            }
            
            // ユーザーが存在するか確認
            $user = User::find($userId);
            if (!$user) {
                throw new Exception('指定されたユーザーが見つかりません。');
            }
            
            $server = $this->getZaimServer();
            $temporaryCredentials = $server->getTemporaryCredentials();
            
            // 一時的な認証情報をデータベースに保存
            ZaimTemporaryCredential::create([
                'user_id' => $userId,
                'identifier' => $temporaryCredentials->getIdentifier(),
                'secret' => $temporaryCredentials->getSecret(),
                'expires_at' => Carbon::now()->addMinutes(30), // 30分後に有効期限切れ
            ]);
            
            Log::info('Zaim redirect: temporary credentials saved for user ' . $userId);
            
            return redirect()->away($server->getAuthorizationUrl($temporaryCredentials));
        } catch (Exception $e) {
            Log::error('Zaim redirect failed: ' . $e->getMessage());
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/settingProfile')->with('error', 'Zaimとの連携を開始できませんでした。');
        }
    }

    /**
     * Zaimからのコールバックを処理し、トークンを取得・保存する
     */
    public function callback(Request $request)
    {
        try {
            // リクエストからoauth_tokenを取得
            $oauthToken = $request->get('oauth_token');
            if (!$oauthToken) {
                throw new Exception('oauth_tokenが見つかりません。');
            }
            
            // データベースから一時的な認証情報を取得
            $tempCredential = ZaimTemporaryCredential::where('identifier', $oauthToken)
                ->where('expires_at', '>', Carbon::now())
                ->latest()
                ->first();
                
            if (!$tempCredential) {
                throw new Exception('有効な一時的な認証情報が見つかりません。');
            }
            
            // League\OAuth1\Client\Credentials\TemporaryCredentialsオブジェクトを作成
            $temporaryCredentials = new \League\OAuth1\Client\Credentials\TemporaryCredentials();
            $temporaryCredentials->setIdentifier($tempCredential->identifier);
            $temporaryCredentials->setSecret($tempCredential->secret);

            $server = $this->getZaimServer();
            
            // 永続的なアクセストークンを取得
            $tokenCredentials = $server->getTokenCredentials(
                $temporaryCredentials,
                $request->get('oauth_token'),
                $request->get('oauth_verifier')
            );

            // ユーザーを取得
            $userId = $tempCredential->user_id;
            Log::info('Zaim callback: user_id from database: ' . $userId);
            
            $user = User::find($userId);
            
            if (!$user) {
                Log::error('Zaim callback: user not found with id: ' . $userId);
                throw new Exception('ユーザーが見つかりません。');
            }

            Log::info('Zaim callback: updating user with token');
            
            // トークン情報をログに出力（本番環境では削除すること）
            Log::debug('Zaim token identifier: ' . $tokenCredentials->getIdentifier());
            Log::debug('Zaim token secret: ' . substr($tokenCredentials->getSecret(), 0, 5) . '...');
            
            $result = $user->update([
                'zaim_oauth_token'        => encrypt($tokenCredentials->getIdentifier()),
                'zaim_oauth_token_secret' => encrypt($tokenCredentials->getSecret()),
            ]);
            
            Log::info('Zaim callback: update result: ' . ($result ? 'success' : 'failed'));

            // 使用済みの一時的な認証情報を削除
            $tempCredential->delete();
            Log::info('Zaim callback: temporary credential deleted');

            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/settingProfile')
                ->with('status', 'Zaimとの連携が完了しました！');

        } catch (Exception $e) {
            Log::error('Zaim callback failed: ' . $e->getMessage());
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/settingProfile')
                ->with('error', 'Zaimとの連携中にエラーが発生しました。');
        }
    }

    /**
     * Zaimのユーザー情報を取得してトークンの有効性を確認する
     */
    public function verifyUser(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_zaim_linked) {
                return response()->json(['error' => 'Zaimとの連携が必要です。'], 400);
            }

            // Zaimのアクセストークンを復号化
            $accessToken = decrypt($user->zaim_oauth_token);
            $accessTokenSecret = decrypt($user->zaim_oauth_token_secret);

            // OAuth1クライアントを設定
            $server = $this->getZaimServer();
            $tokenCredentials = new \League\OAuth1\Client\Credentials\TokenCredentials();
            $tokenCredentials->setIdentifier($accessToken);
            $tokenCredentials->setSecret($accessTokenSecret);

            // ZaimのユーザーAPIエンドポイント
            $url = 'https://api.zaim.net/v2/home/user/verify';
            $params = [];

            Log::info('Zaim verify user request');
            Log::info('Zaim access token: ' . substr($accessToken, 0, 10) . '...');

            // League OAuth1 Clientを使用してリクエストを送信
            try {
                $client = new \GuzzleHttp\Client();
                
                // OAuth1署名付きヘッダーを生成
                $headers = $server->getHeaders($tokenCredentials, 'GET', $url, $params);
                $headers['Accept'] = 'application/json';
                $headers['User-Agent'] = 'SaveSmart/1.0';
                
                Log::info('Zaim verify API headers: ' . json_encode($headers));
                
                $response = $client->request('GET', $url, [
                    'headers' => $headers
                ]);
                
                Log::info('Zaim verify API response status: ' . $response->getStatusCode());
                $responseBody = $response->getBody()->getContents();
                Log::info('Zaim verify API response body: ' . $responseBody);
                
                return response()->json(['success' => true, 'data' => json_decode($responseBody, true)]);
                
            } catch (\GuzzleHttp\Exception\ClientException $e) {
                Log::error('Zaim verify API client error: ' . $e->getMessage());
                Log::error('Zaim verify API response body: ' . $e->getResponse()->getBody());
                throw new \Exception('Zaim APIからの認証エラー: ' . $e->getMessage());
            }

        } catch (\Exception $e) {
            Log::error('Zaim verify user failed: ' . $e->getMessage());
            return response()->json(['error' => 'Zaimユーザー情報の取得に失敗しました。'], 500);
        }
    }

    /**
     * 指定した日付の支出データをZaimから取得する
     */
    public function getExpenses(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user->is_zaim_linked) {
                return response()->json(['error' => 'Zaimとの連携が必要です。'], 400);
            }

            $date = $request->query('date');
            if (!$date) {
                return response()->json(['error' => '日付が指定されていません。'], 400);
            }

            // 日付の形式を検証
            try {
                $dateObj = new \DateTime($date);
                $formattedDate = $dateObj->format('Y-m-d');
            } catch (\Exception $e) {
                return response()->json(['error' => '無効な日付形式です。'], 400);
            }

            // Zaimのアクセストークンを復号化
            $accessToken = decrypt($user->zaim_oauth_token);
            $accessTokenSecret = decrypt($user->zaim_oauth_token_secret);

            // OAuth1クライアントを設定
            $server = $this->getZaimServer();
            $tokenCredentials = new \League\OAuth1\Client\Credentials\TokenCredentials();
            $tokenCredentials->setIdentifier($accessToken);
            $tokenCredentials->setSecret($accessTokenSecret);

            // ZaimのAPIエンドポイント
            $url = 'https://api.zaim.net/v2/home/money';
            $params = [
                'mapping' => 1,
                'start_date' => $formattedDate,
                'end_date' => $formattedDate,
                'mode' => 'payment', // 支出のみ
            ];

            Log::info('Zaim API request params: ' . json_encode($params));
            Log::info('Zaim access token: ' . substr($accessToken, 0, 10) . '...');
            Log::info('Zaim access token secret: ' . substr($accessTokenSecret, 0, 10) . '...');

            // League OAuth1 Clientを使用してリクエストを送信
            try {
                $client = new \GuzzleHttp\Client();
                
                // OAuth1署名付きヘッダーを生成
                $headers = $server->getHeaders($tokenCredentials, 'GET', $url, $params);
                $headers['Accept'] = 'application/json';
                $headers['User-Agent'] = 'SaveSmart/1.0';
                
                Log::info('Zaim API headers: ' . json_encode($headers));
                
                $response = $client->request('GET', $url, [
                    'query' => $params,
                    'headers' => $headers
                ]);
                
                Log::info('Zaim API response status: ' . $response->getStatusCode());
                
            } catch (\GuzzleHttp\Exception\ClientException $e) {
                Log::error('Zaim API client error: ' . $e->getMessage());
                Log::error('Zaim API response body: ' . $e->getResponse()->getBody());
                throw new \Exception('Zaim APIからの認証エラー: ' . $e->getMessage());
            }

            $data = json_decode($response->getBody(), true);

            if (!isset($data['money'])) {
                return response()->json(['expenses' => []]);
            }

            // 支出データを整形
            $expenses = [];
            foreach ($data['money'] as $item) {
                if ($item['mode'] === 'payment') { // 支出のみ
                    $expenses[] = [
                        'id' => $item['id'],
                        'amount' => $item['amount'],
                        'date' => $item['date'],
                        'category_id' => $item['category_id'] ?? null,
                        'genre_id' => $item['genre_id'] ?? null,
                        'comment' => $item['comment'] ?? '',
                        'place' => $item['place'] ?? '',
                        'name' => $item['name'] ?? '',
                    ];
                }
            }

            return response()->json(['expenses' => $expenses]);

        } catch (\Exception $e) {
            Log::error('Zaim get expenses failed: ' . $e->getMessage());
            return response()->json(['error' => 'Zaimからのデータ取得に失敗しました。'], 500);
        }
    }
}
