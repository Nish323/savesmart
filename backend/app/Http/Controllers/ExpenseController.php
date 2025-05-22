<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
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
        $expense = Expense::create([    
            'user_id' => Auth::id(),
            'amount' => $request->amount,
            'spent_at' => $request->spent_at,
            'normal_category_id' => $request->normal_category_id,
            'special_category_id' => $request->special_category_id,
            'emotion_category_id' => $request->emotion_category_id,
            'memo' => $request->memo,
        ]);
        return response()->json($expense, 201);
    }
}
