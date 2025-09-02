<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIsoManualRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'iso_standard' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'version' => 'nullable|string|max:50',
            'effective_date' => 'nullable|date',
            'review_date' => 'nullable|date',
            'metadata' => 'nullable|array',
        ];
    }
}
