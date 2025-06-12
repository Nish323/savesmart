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

        // 全ユーザーを対象に処理
        User::chunk(200, function ($users) use ($targetYear, $targetMonth, $previousYear, $previousMonth) {
            foreach ($users as $user) {
                $previousSaving = Saving::where('user_id', $user->id)
                                        ->where('year', $previousYear)
                                        ->where('month', $previousMonth)
                                        ->first();

                $initialAmount = $previousSaving ? $previousSaving->amount : 0;

                Saving::updateOrCreate(
                    [ 'user_id' => $user->id, 'year' => $targetYear, 'month' => $targetMonth ],
                    [ 'amount' => $initialAmount ]
                );
            }
        });

        $this->info("データ作成が完了しました。");
    }
}