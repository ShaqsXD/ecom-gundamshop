<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('revisions', function (Blueprint $table) {
            $table->id();
            $table->morphs('revisionable'); // Can track revisions for manuals, sections, procedures, documents
            $table->string('version', 20);
            $table->text('changes_summary');
            $table->json('old_data')->nullable(); // Previous version data
            $table->json('new_data')->nullable(); // Current version data
            $table->enum('change_type', ['created', 'updated', 'approved', 'archived'])->default('updated');
            $table->foreignId('changed_by')->constrained('users');
            $table->timestamp('changed_at');
            $table->text('change_reason')->nullable();
            $table->boolean('is_major_change')->default(false);
            $table->timestamps();
            
            $table->index(['changed_by', 'changed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revisions');
    }
};
