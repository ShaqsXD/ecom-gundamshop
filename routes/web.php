<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PanelController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // ISO Manual routes
    Route::prefix('iso-manuals')->name('iso-manuals.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('IsoManuals/Index');
        })->name('index');
        
        Route::get('/create', function () {
            return Inertia::render('IsoManuals/Create');
        })->name('create');
        
        Route::get('/{manual}', function ($manual) {
            return Inertia::render('IsoManuals/Show', ['manualId' => $manual]);
        })->name('show');
        
        Route::get('/{manual}/edit', function ($manual) {
            return Inertia::render('IsoManuals/Edit', ['manualId' => $manual]);
        })->name('edit');
    });
});

    Route::get('panel', [PanelController::class, 'index'])->name('panel.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
