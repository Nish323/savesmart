<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class IncomeController extends Controller
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

        $income = Income::create([
            'user_id' => Auth::id(),
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'memo' => $validated['description'] ?? null,
            'received_at' => $date,
            'year' => $date->year,
            'month' => $date->month,
            'day' => $date->day,
        ]);

        return response()->json($income, 201);
    }
} 