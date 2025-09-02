<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSectionRequest extends FormRequest
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
            'manual_id' => 'required|exists:iso_manuals,id',
            'parent_section_id' => 'nullable|exists:manual_sections,id',
            'section_number' => 'required|string|max:20',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'order_index' => 'nullable|integer|min:0',
            'section_type' => 'required|in:chapter,section,subsection,appendix',
            'is_required' => 'nullable|boolean',
            'requirements' => 'nullable|array',
        ];
    }
}
