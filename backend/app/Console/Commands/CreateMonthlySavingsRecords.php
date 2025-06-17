<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Saving;
use Carbon\Carbon;

class CreateMonthlySavingsRecords extends Command
{
    protected $signature = 'savings:create-monthly';
    protected $description = 'Create savings records for all users for the new month';

    public function handle(): void
    {
        $now = Carbon::now();
        $targetYear = $now->year;
        $targetMonth = $now->month;

        $previousMonthCarbon = $now->copy()->subMonth();
        $previousYear = $previousMonthCarbon->year;
        $previousMonth = $previousMonthCarbon->month;

        $this->info("{$targetYear}年{$targetMonth}月 の貯金データ作成を開始します...");

        User::chunk(200, function ($users) use ($targetYear, $targetMonth, $previousYear, $previousMonth) {
            
            // チャンク内のユーザーIDリストを取得
            $userIds = $users->pluck('id');

            // 1回のクエリで、チャンク内全ユーザーの前月のデータを取得し、user_idをキーにする
            $previousSavings = Saving::whereIn('user_id', $userIds)
                                    ->where('year', $previousYear)
                                    ->where('month', $previousMonth)
                                    ->get()
                                    ->keyBy('user_id');

            $upsertData = [];
            foreach ($users as $user) {
                // DB問い合わせの代わりに、上で取得したコレクションからデータを取得
                $previousSaving = $previousSavings->get($user->id);
                $initialAmount = $previousSaving ? $previousSaving->amount : 0;

                // upsert用のデータ配列を作成
                $upsertData[] = [
                    'user_id' => $user->id,
                    'year' => $targetYear,
                    'month' => $targetMonth,
                    'amount' => $initialAmount,
                ];
            }

            // 1回のupsertクエリで、チャンク内全ユーザーの今月分データを一括で作成・更新
            if (!empty($upsertData)) {
                Saving::upsert(
                    $upsertData,
                    ['user_id', 'year', 'month'], // レコードを一意に識別するキー
                    ['amount'] // 更新対象のカラム
                );
            }
        });

        $this->info("データ作成が完了しました。");
    }
}