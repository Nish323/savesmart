<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
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
        // 年と月を取得
        $year = $date->year;
        $month = $date->month;

        // 月ごとの支出を取得または作成
        $monthExpense = MonthExpense::firstOrCreate(
            ['user_id' => Auth::id(), 'year' => $year, 'month' => $month],
        );
        // 支出の合計を更新
        $monthExpense->expense_total += $request->amount;
        $monthExpense->save();

        //通常カテゴリーの月合計
        $monthNormalExpense = MonthNormalExpense::firstOrCreate(
            ['user_id' => Auth::id(), 'year' => $year, 'month' => $month, 'normal_category_id' => $request->normal_category_id],
        );
        $monthNormalExpense->expense_total += $request->amount;
        $monthNormalExpense->save();

        // 特別カテゴリーの月合計
        $monthSpecialExpense = MonthSpecialExpense::firstOrCreate(
            ['user_id' => Auth::id(), 'year' => $year, 'month' => $month, 'special_category_id' => $request->special_category_id],
        );
        $monthSpecialExpense->expense_total += $request->amount;
        $monthSpecialExpense->save();

        // 感情カテゴリーの月合計
        $monthEmotionExpense = MonthEmotionExpense::firstOrCreate(
            ['user_id' => Auth::id(), 'year' => $year, 'month' => $month, 'emotion_category_id' => $request->emotion_category_id],
        );
        $monthEmotionExpense->expense_total += $request->amount;
        $monthEmotionExpense->save();

        $expense = Expense::create([    
            'user_id' => Auth::id(),
            'amount' => $request->amount,
            'spent_at' => $request->spent_at,
            'normal_category_id' => $request->normal_category_id,
            'special_category_id' => $request->special_category_id,
            'emotion_category_id' => $request->emotion_category_id,
            'memo' => $request->memo,
            'year' => $request->year,
            'month' => $request->month,
            'day' => $request->day,
        ]);
        return response()->json($expense, 201);
    }
}