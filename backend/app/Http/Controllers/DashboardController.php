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
        $monthIncomes = MonthIncome::get2MonthsIncomes($userId, $currentYear, $currentMonth);
        $monthExpenses = MonthExpense::get6MonthsExpenses($userId, $currentYear, $currentMonth);
        $monthNormalExpenses = MonthNormalExpense::getAllMonthNormalExpense($userId, $currentYear, $currentMonth);
        $monthSpecialExpenses = MonthSpecialExpense::getAll6MonthsSpecialExpense($userId, $currentYear, $currentMonth);
        $monthEmotionExpenses = MonthEmotionExpense::getAllMonthEmotionExpense($userId, $currentYear, $currentMonth);
        $currentMonthExpenses = Expense::getCurrentMonthExpenses($userId, $currentYear, $currentMonth);

        return response()->json([
            'savings' => $savings,
            'monthIncomes' => $monthIncomes,
            'monthExpenses' => $monthExpenses,
            'monthNormalExpenses' => $monthNormalExpenses,
            'monthSpecialExpenses' => $monthSpecialExpenses,
            'monthEmotionExpenses' => $monthEmotionExpenses,
            'currentMonthExpenses' => $currentMonthExpenses,
        ]);
    }
}
