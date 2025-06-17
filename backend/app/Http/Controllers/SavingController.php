<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Saving;

class SavingController extends Controller
{
    public function index()
    {
        $savings = Saving::get6MonthsSavings(Auth::user()->id);
        return response()->json($savings);
    }
}
