<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $date = Carbon::parse($validated['date']);

        $expense = Expense::create([
            'user_id' => Auth::id(),
            'amount' => $validated['amount'],
            'normal_category_id' => $validated['category'],
            'memo' => $validated['description'] ?? null,
            'spent_at' => $date,
            'year' => $date->year,
            'month' => $date->month,
            'day' => $date->day,
        ]);

        return response()->json($expense, 201);
    }
} 