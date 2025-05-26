<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:0',
            'spent_at' => 'required|date',
            'normal_category_id' => 'required|exists:normal_categories,id',
            'special_category_id' => 'nullable|exists:special_categories,id',
            'emotion_category_id' => 'nullable|exists:emotion_categories,id',
            'memo' => 'nullable|string|max:255',
            'spent_at' => 'required|date',
            'year' => 'required|integer|min:2020|max:' . date('Y'),
            'month' => 'required|integer|min:1|max:12',
            'day' => 'required|integer|min:1|max:31',
        ];
    }
}
