<?php

use App\Http\Controllers\Api\IsoManualController;
use App\Http\Controllers\Api\ManualSectionController;
use App\Http\Controllers\Api\ProcedureController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth');

// ISO Manual API Routes
Route::middleware(['auth'])->group(function () {
    // ISO Manuals
    Route::apiResource('manuals', IsoManualController::class);
    Route::post('manuals/{isoManual}/approve', [IsoManualController::class, 'approve']);
    Route::post('manuals/{isoManual}/submit-for-review', [IsoManualController::class, 'submitForReview']);
    
    // Manual Sections
    Route::apiResource('sections', ManualSectionController::class);
    Route::post('sections/reorder', [ManualSectionController::class, 'reorder']);
    
    // Procedures
    Route::apiResource('procedures', ProcedureController::class);
    
    // Documents
    Route::apiResource('documents', DocumentController::class);
    Route::post('documents/{document}/upload', [DocumentController::class, 'upload']);
    Route::get('documents/{document}/download', [DocumentController::class, 'download']);
    
    // Search endpoints
    Route::get('search/global', [SearchController::class, 'global']);
    Route::get('search/manuals', [IsoManualController::class, 'search']);
    Route::get('search/procedures', [ProcedureController::class, 'search']);
    Route::get('search/documents', [DocumentController::class, 'search']);
});