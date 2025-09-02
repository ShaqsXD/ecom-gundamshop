<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSectionRequest;
use App\Models\ManualSection;
use App\Models\IsoManual;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManualSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ManualSection::with(['manual', 'parentSection', 'childSections', 'procedures', 'documents']);

        if ($request->has('manual_id')) {
            $query->where('manual_id', $request->manual_id);
        }

        if ($request->has('parent_section_id')) {
            $query->where('parent_section_id', $request->parent_section_id);
        }

        $sections = $query->orderBy('order_index')->get();

        return response()->json($sections);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSectionRequest $request): JsonResponse
    {
        $manual = IsoManual::findOrFail($request->manual_id);
        
        if (!$manual->isEditable()) {
            return response()->json(['message' => 'Cannot add sections to manual in current status'], 403);
        }

        $section = ManualSection::create($request->validated());
        $section->load(['manual', 'parentSection', 'childSections']);

        return response()->json($section, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ManualSection $manualSection): JsonResponse
    {
        $manualSection->load([
            'manual',
            'parentSection',
            'childSections.childSections',
            'procedures',
            'documents',
            'revisions.changedBy'
        ]);

        return response()->json($manualSection);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreSectionRequest $request, ManualSection $manualSection): JsonResponse
    {
        if (!$manualSection->manual->isEditable()) {
            return response()->json(['message' => 'Cannot edit sections of manual in current status'], 403);
        }

        $manualSection->update($request->validated());
        $manualSection->load(['manual', 'parentSection', 'childSections']);

        return response()->json($manualSection);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ManualSection $manualSection): JsonResponse
    {
        if (!$manualSection->manual->isEditable()) {
            return response()->json(['message' => 'Cannot delete sections of manual in current status'], 403);
        }

        $manualSection->delete();

        return response()->json(['message' => 'Section deleted successfully']);
    }

    /**
     * Reorder sections
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:manual_sections,id',
            'sections.*.order_index' => 'required|integer|min:0',
        ]);

        foreach ($request->sections as $sectionData) {
            ManualSection::where('id', $sectionData['id'])
                ->update(['order_index' => $sectionData['order_index']]);
        }

        return response()->json(['message' => 'Sections reordered successfully']);
    }
}
