<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\MonthIncome;
use App\Models\Saving;
use App\Http\Requests\IncomeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 認証されているユーザーの収入のみを取得
        $incomes = Income::where('user_id', Auth::id())->get();
        return response()->json($incomes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(IncomeRequest $request)
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

        // 月ごとの収入を取得または作成
        MonthIncome::addMonthIncome($userId, $year, $month, $amount);

        // 貯金を取得または作成
        $saving = Saving::addSaving($userId, $amount);


        // 収入を保存
        $income = Income::create([
            'user_id' => Auth::id(),
            'amount' => $request->amount,
            'saved_at' => $request->saved_at,
            'memo' => $request->memo,
         ]);
        return response()->json($income, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Income $income)
    {
        return response()->json($income);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Income $income)
    {
        //年月日を取得
        $date = Carbon::parse($request->saved_at);
        $year = $date->year;
        $month = $date->month;
        $day = $date->day;
        // ユーザーIDの取得
        $userId = Auth::id();
        // 収入の金額を取得
        $currentIncome = $request->amount;
        // 収入の過去の金額を取得
        $pastIncome = $income->amount;

        // 月ごとの収入を更新
        MonthIncome::updateMonthIncome($userId, $year, $month, $currentIncome, $pastIncome);
        // 貯金を更新
        $saving = Saving::updateSaving($userId, $currentIncome, $pastIncome);
        // 収入の更新
        $income->update([
            'amount' => $currentIncome,
            'saved_at' => $request->saved_at,
            'memo' => $request->memo,
        ]);

        return response()->json($income);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Income $income)
    {
        // 年月日を取得
        $date = Carbon::parse($income->saved_at);
        $year = $date->year;
        $month = $date->month;
        $day = $date->day;
        // ユーザーIDの取得
        $userId = Auth::id();
        // 収入の金額を取得
        $amount = $income->amount;

        // 月ごとの収入を削除
        MonthIncome::deleteMonthIncome($userId, $year, $month, $amount);
        // 貯金を更新
        Saving::deleteSaving($userId, $amount);
        
        // 収入の削除
        $income->delete();

        return response()->json(null, 204);
    }
}
