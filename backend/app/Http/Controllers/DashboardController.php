<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Saving;
use Illuminate\Support\Facades\Auth;
use App\Models\MonthIncome;
use App\Models\MonthExpense;
use App\Models\MonthNormalExpense;
use App\Models\MonthSpecialExpense;
use App\Models\MonthEmotionExpense;
use App\Models\Expense;

class DashboardController extends Controller
{
    public function getData()
    {
        // ユーザーのIDを取得
        $userId = Auth::user()->id;
        // 日付の取得
        $currentYear = date('Y');
        $currentMonth = date('m');
        // 各データの取得
        $savings = Saving::get6MonthsSavings($userId);       
        $monthIncoe = MonthIncome::getMonthIncome($userId, $currentYear, $currentMonth);
        $monthExpenses = MonthExpense::get6MonthsExpenses($userId, $currentYear, $currentMonth);
        $monthNormalExpense = MonthNormalExpense::getAllMonthNormalExpense($userId, $currentYear, $currentMonth);
        $monthSpecialExpense = MonthSpecialExpense::getAllMonthSpecialExpense($userId, $currentYear, $currentMonth);
        $monthEmotionExpense = MonthEmotionExpense::getAllMonthEmotionExpense($userId, $currentYear, $currentMonth);
        $currentMonthExpenses = Expense::getCurrentMonthExpenses($userId, $currentYear, $currentMonth);

        return response()->json([
            'savings' => $savings,
            'monthIncome' => $monthIncoe,
            'monthExpenses' => $monthExpenses,
            'monthNormalExpense' => $monthNormalExpense,
            'monthSpecialExpense' => $monthSpecialExpense,
            'monthEmotionExpense' => $monthEmotionExpense,
            'currentMonthExpenses' => $currentMonthExpenses ,
        ]);
    }
}
