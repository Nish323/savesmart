<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SpecialCategory;

class SpecialCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = SpecialCategory::all();

        return response()->json($categories);
    }
}
