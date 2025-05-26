<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NormalCategory;

class NormalCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = NormalCategory::where('user_id', $request->user()->id)
            ->with('color')
            ->get();

        return response()->json($categories);
    }
}
