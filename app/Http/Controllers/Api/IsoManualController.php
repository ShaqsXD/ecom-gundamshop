<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIsoManualRequest;
use App\Http\Requests\UpdateIsoManualRequest;
use App\Models\IsoManual;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IsoManualController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = IsoManual::with(['creator', 'approver', 'sections' => function ($query) {
            $query->whereNull('parent_section_id')->orderBy('order_index');
        }]);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('iso_standard', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $manuals = $query->paginate($request->get('per_page', 15));

        return response()->json($manuals);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIsoManualRequest $request): JsonResponse
    {
        $manual = IsoManual::create([
            ...$request->validated(),
            'created_by' => auth()->id(),
        ]);

        $manual->load(['creator', 'sections']);

        return response()->json($manual, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(IsoManual $isoManual): JsonResponse
    {
        $isoManual->load([
            'creator',
            'approver', 
            'sections' => function ($query) {
                $query->with(['procedures', 'documents', 'childSections'])->orderBy('order_index');
            },
            'documents',
            'revisions.changedBy'
        ]);

        return response()->json($isoManual);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateIsoManualRequest $request, IsoManual $isoManual): JsonResponse
    {
        if (!$isoManual->isEditable()) {
            return response()->json(['message' => 'Manual cannot be edited in current status'], 403);
        }

        $isoManual->update($request->validated());
        $isoManual->load(['creator', 'approver', 'sections']);

        return response()->json($isoManual);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IsoManual $isoManual): JsonResponse
    {
        if ($isoManual->status === 'approved') {
            return response()->json(['message' => 'Cannot delete approved manual'], 403);
        }

        $isoManual->delete();

        return response()->json(['message' => 'Manual deleted successfully']);
    }

    /**
     * Approve a manual
     */
    public function approve(IsoManual $isoManual): JsonResponse
    {
        if ($isoManual->status !== 'review') {
            return response()->json(['message' => 'Manual must be in review status to approve'], 400);
        }

        $isoManual->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return response()->json($isoManual);
    }

    /**
     * Submit manual for review
     */
    public function submitForReview(IsoManual $isoManual): JsonResponse
    {
        if ($isoManual->status !== 'draft') {
            return response()->json(['message' => 'Only draft manuals can be submitted for review'], 400);
        }

        $isoManual->update(['status' => 'review']);

        return response()->json($isoManual);
    }
}
