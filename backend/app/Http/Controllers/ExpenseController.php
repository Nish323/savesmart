<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use App\Models\Saving;
use App\Models\MonthExpense;
use App\Models\NormalCategory;
use App\Models\SpecialCategory;
use App\Models\EmotionCategory;
use App\Models\MonthNormalExpense;
use App\Models\MonthSpecialExpense;
use App\Models\MonthEmotionExpense;
use Carbon\Carbon;
use App\Http\Requests\ExpenseRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = Expense::where('user_id', $request->user()->id)
            ->orderBy('spent_at', 'desc')
            ->get();

        return response()->json($expenses);
    }

    public function store(ExpenseRequest $request)
    {
        DB::transaction(function () use ($request) {
            $date = Carbon::parse($request->saved_at);
            // 年月日を取得
            $year = $date->year;
            $month = $date->month;
            $day = $date->day;

            //ユーザの取得
            $userId = Auth::id();
            //値段の取得
            $amount = $request->amount;
            //各カテゴリーIdの取得
            $normalCategoryId = $request->normal_category_id;
            $specialCategoryId = $request->special_category_id;
            $emotionCategoryId = $request->emotion_category_id;

            // 月ごとの支出を取得または作成
            MonthExpense::addMonthExpense($userId, $year, $month, $amount);

            //通常カテゴリーの月合計
            MonthNormalExpense::addMonthNormalExpense(
                $userId,
                $year,
                $month,
                $normalCategoryId,
                $amount
            );

            // 特別カテゴリーの月合計
            MonthSpecialExpense::addMonthSpecialExpense(
                $userId,
                $year,
                $month,
                $specialCategoryId,
                $amount
            );

            // 感情カテゴリーの月合計
            MonthEmotionExpense::addMonthEmotionExpense(
                $userId,
                $year,
                $month,
                $emotionCategoryId,
                $amount
            );

            // 貯金を取得または作成
            $saving = Saving::subtractSaving($userId, $year, $month, $amount);

            $expense = Expense::create([    
                'user_id' => Auth::id(),
                'amount' => $amount,
                'spent_at' => $request->spent_at,
                'normal_category_id' => $normalCategoryId,
                'special_category_id' => $specialCategoryId,
                'emotion_category_id' => $emotionCategoryId,
                'memo' => $request->memo,
                'year' => $year,
                'month' => $month,
                'day' => $day,
            ]);
            return response()->json($expense, 201);
        });
    }

    public function show(Expense $expense)
    {
        return response()->json($expense);
    }

    public function update(Request $request, Expense $expense)
    {
        DB::transaction(function () use ($request, $expense) {
            //年月日を取得
            $date = Carbon::parse($request->spent_at);
            $year = $date->year;
            $month = $date->month;
            $day = $date->day; 
            // ユーザーIDの取得
            $userId = Auth::id();
            // 支出の金額を取得
            $currentExpense = $request->amount;
            // 支出の過去の金額を取得
            $pastExpense = $expense->amount;
            // 現在のカテゴリーIDを取得
            $currentNormalCategoryId = $request->normal_category_id;
            $currentSpecialCategoryId = $request->special_category_id;
            $currentEmotionCategoryId = $request->emotion_category_id;
            // 過去のカテゴリーIDを取得
            $pastNormalCategoryId = $expense->normal_category_id;
            $pastSpecialCategoryId = $expense->special_category_id;
            $pastEmotionCategoryId = $expense->emotion_category_id;

            // 月ごとの支出を更新
            MonthExpense::updateMonthExpense($userId, $year, $month, $currentExpense, $pastExpense);
            // 通常カテゴリーの月合計を更新
            MonthNormalExpense::updateMonthNormalExpense(
                $userId,
                $year,
                $month,
                $currentNormalCategoryId,
                $pastNormalCategoryId,
                $currentExpense,
                $pastExpense
            );
            // 特別カテゴリーの月合計を更新
            MonthSpecialExpense::updateMonthSpecialExpense(
                $userId,
                $year,
                $month,
                $currentSpecialCategoryId,
                $pastSpecialCategoryId,
                $currentExpense,
                $pastExpense
            );
            // 感情カテゴリーの月合計を更新
            MonthEmotionExpense::updateMonthEmotionExpense(
                $userId,
                $year,
                $month,
                $currentEmotionCategoryId,
                $pastEmotionCategoryId,
                $currentExpense,
                $pastExpense
            );
            // 貯金を更新
            $saving = Saving::updateSaving($userId, $year, $month, $pastExpense, $currentExpense);
            // 支出の更新
            $expense->update([
                'amount' => $currentExpense,
                'spent_at' => $request->spent_at,
                'normal_category_id' => $request->normal_category_id,
                'special_category_id' => $request->special_category_id,
                'emotion_category_id' => $request->emotion_category_id,
                'memo' => $request->memo,
                'year' => $year,
                'month' => $month,
                'day' => $day,
            ]);
            return response()->json($expense);
        });
    }

    public function destroy(Expense $expense)
    {
        DB::transaction(function () use ($expense) {
            // 年月日を取得
            $date = Carbon::parse($expense->spent_at);
            $year = $date->year;
            $month = $date->month;
            $day = $date->day;
            // ユーザーIDの取得
            $userId = Auth::id();
            // 支出の金額を取得
            $amount = $expense->amount;
            // 現在のカテゴリーIDを取得
            $currentNormalCategoryId = $expense->normal_category_id;
            $currentSpecialCategoryId = $expense->special_category_id;
            $currentEmotionCategoryId = $expense->emotion_category_id;

            // 月ごとの支出を削除
            MonthExpense::deleteMonthExpense($userId, $year, $month, $amount);
            // 通常カテゴリーの月合計を削除
            MonthNormalExpense::deleteMonthNormalExpense(
                $userId,
                $year,
                $month,
                $currentNormalCategoryId,
                $amount
            );
            // 特別カテゴリーの月合計を削除
            MonthSpecialExpense::deleteMonthSpecialExpense(
                $userId,
                $year,
                $month,
                $currentSpecialCategoryId,
                $amount
            );
            // 感情カテゴリーの月合計を削除
            MonthEmotionExpense::deleteMonthEmotionExpense(
                $userId,
                $year,
                $month,
                $currentEmotionCategoryId,
                $amount
            );
            
            // 貯金を更新
            Saving::addSaving($userId, $year, $month, $amount);

            // 支出の削除
            if ($expense->delete()) {
                return response()->json(['message' => '支出が削除されました。'], 200);
            } else {
                return response()->json(['message' => '支出の削除に失敗しました。'], 500);
            }
        });
    }
}