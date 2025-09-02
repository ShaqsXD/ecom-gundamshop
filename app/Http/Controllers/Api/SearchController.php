<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IsoManual;
use App\Models\ManualSection;
use App\Models\Procedure;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function global(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return response()->json([
                'manuals' => [],
                'sections' => [],
                'procedures' => [],
                'documents' => [],
            ]);
        }

        $manuals = IsoManual::where('title', 'like', "%{$query}%")
            ->orWhere('iso_standard', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->with(['creator'])
            ->limit(10)
            ->get();

        $sections = ManualSection::where('title', 'like', "%{$query}%")
            ->orWhere('content', 'like', "%{$query}%")
            ->orWhere('section_number', 'like', "%{$query}%")
            ->with(['manual'])
            ->limit(10)
            ->get();

        $procedures = Procedure::where('title', 'like', "%{$query}%")
            ->orWhere('procedure_code', 'like', "%{$query}%")
            ->orWhere('purpose', 'like', "%{$query}%")
            ->orWhere('scope', 'like', "%{$query}%")
            ->with(['section.manual', 'owner'])
            ->limit(10)
            ->get();

        $documents = Document::where('title', 'like', "%{$query}%")
            ->orWhere('document_code', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->with(['manual', 'creator'])
            ->limit(10)
            ->get();

        return response()->json([
            'manuals' => $manuals,
            'sections' => $sections,
            'procedures' => $procedures,
            'documents' => $documents,
        ]);
    }
}
