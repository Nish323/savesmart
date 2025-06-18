<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Saving;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function getData()
    {
        $savings = Saving::get6MonthsSavings(Auth::user()->id);
        return response()->json([
            'savings' => $savings,
        ]);
    }
}
