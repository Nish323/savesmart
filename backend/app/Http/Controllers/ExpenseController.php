<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;

class ExpenseController extends Controller
{
    public function index(Expense $expense)
    {
        // 全件取得して JSON で返却
        return $expense->get();
    }
}
