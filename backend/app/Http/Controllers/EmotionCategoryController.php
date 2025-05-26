<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmotionCategory;

class EmotionCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = EmotionCategory::all();

        return response()->json($categories);
    }
}
