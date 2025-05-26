<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Http\Requests\IncomeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        try {
            $income = Income::create([
                'user_id' => Auth::id(),
                'income' => $request->amount,
                'saved_at' => $request->saved_at,
                'memo' => $request->memo,
            ]);
            return response()->json($income, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating income: ' . $e->getMessage());
            \Log::error('Request data: ' . json_encode($request->all()));
            return response()->json(['error' => 'Failed to create income', 'message' => $e->getMessage()], 500);
        }
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
