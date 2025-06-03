<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\MonthIncome;
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
        // 年と月を取得
        $year = $date->year;
        $month = $date->month;
        // 月ごとの収入を取得または作成
        $monthIncome = MonthIncome::firstOrCreate(
            ['user_id' => Auth::id(), 'year' => $year, 'month' => $month],
            ['income_total' => 0],
        );
        // 収入の合計を更新
        $monthIncome->income_total += $request->amount;
        $monthIncome->save();

        $income = Income::create([
            'user_id' => Auth::id(),
            'income' => $request->amount,
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Income $income)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Income $income)
    {
        //
    }
}
