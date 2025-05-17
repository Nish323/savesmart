<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $expenses = Expense::with(['normalCategory.color', 'specialCategory', 'emotionCategory'])
                        ->where('user_id', Auth::id())
                        ->get()
                        ->map(function ($expense) {
                            // NormalCategoryのcolor取得方法はリレーションによる
                            $normalCategoryColor = $expense->normalCategory && $expense->normalCategory->color 
                                ? $expense->normalCategory->color->color 
                                : null;
                            
                            // SpecialCategoryとEmotionCategoryは直接colorカラムを持つ
                            $specialCategoryColor = $expense->specialCategory ? $expense->specialCategory->color : null;
                            $emotionCategoryColor = $expense->emotionCategory ? $expense->emotionCategory->color : null;
                            
                            return [
                                'id' => $expense->id,
                                'userId' => $expense->user_id,
                                'amount' => $expense->amount,
                                'memo' => $expense->memo,
                                'spentAt' => $expense->spent_at ? $expense->spent_at->toIso8601String() : null,
                                'year' => $expense->year,
                                'month' => $expense->month,
                                'day' => $expense->day,
                                'createdAt' => $expense->created_at ? $expense->created_at->toIso8601String() : null,
                                'updatedAt' => $expense->updated_at ? $expense->updated_at->toIso8601String() : null,
                                
                                'normalCategoryId' => $expense->normal_category_id,
                                'normalCategoryName' => $expense->normalCategory ? $expense->normalCategory->name : null,
                                'normalCategoryColor' => $normalCategoryColor,
                                
                                'specialCategoryId' => $expense->special_category_id,
                                'specialCategoryName' => $expense->specialCategory ? $expense->specialCategory->name : null,
                                'specialCategoryColor' => $specialCategoryColor,
                                
                                'emotionCategoryId' => $expense->emotion_category_id,
                                'emotionCategoryName' => $expense->emotionCategory ? $expense->emotionCategory->name : null,
                                'emotionCategoryColor' => $emotionCategoryColor,
                            ];
                        });

        return response()->json($expenses);
    }
}
