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
}
