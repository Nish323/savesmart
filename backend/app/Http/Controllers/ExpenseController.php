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
        $saving = Saving::subtractSaving($userId, $amount);

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
    }

    public function show(Expense $expense)
    {
        return response()->json($expense);
    }

    public function update(Request $request, Expense $expense)
    {
        $expense->update($request->all());
        return response()->json($expense);
    }
}