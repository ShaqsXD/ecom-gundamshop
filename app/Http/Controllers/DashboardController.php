<?php

namespace App\Http\Controllers;

use App\Models\IsoManual;
use App\Models\ManualSection;
use App\Models\Procedure;
use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_manuals' => IsoManual::count(),
            'approved_manuals' => IsoManual::where('status', 'approved')->count(),
            'draft_manuals' => IsoManual::where('status', 'draft')->count(),
            'review_manuals' => IsoManual::where('status', 'review')->count(),
            'total_sections' => ManualSection::count(),
            'total_procedures' => Procedure::count(),
            'total_documents' => Document::count(),
        ];

        $recentManuals = IsoManual::with(['creator'])
            ->latest()
            ->limit(5)
            ->get();

        $upcomingReviews = IsoManual::whereNotNull('review_date')
            ->where('review_date', '<=', now()->addDays(30))
            ->where('status', 'approved')
            ->with(['creator'])
            ->orderBy('review_date')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentManuals' => $recentManuals,
            'upcomingReviews' => $upcomingReviews,
        ]);
    }
}
