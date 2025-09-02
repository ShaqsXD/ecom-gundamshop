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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manual_id')->constrained('iso_manuals')->onDelete('cascade');
            $table->foreignId('section_id')->nullable()->constrained('manual_sections')->onDelete('set null');
            $table->foreignId('procedure_id')->nullable()->constrained('procedures')->onDelete('set null');
            $table->string('document_code', 50)->unique(); // e.g., "DOC-001"
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('document_type', ['form', 'template', 'checklist', 'record', 'policy', 'instruction', 'other'])->default('other');
            $table->string('file_path')->nullable(); // Path to actual file
            $table->string('file_name')->nullable();
            $table->string('file_type', 10)->nullable(); // pdf, docx, etc.
            $table->integer('file_size')->nullable(); // in bytes
            $table->string('version', 20)->default('1.0');
            $table->enum('status', ['draft', 'review', 'approved', 'obsolete'])->default('draft');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->date('review_date')->nullable();
            $table->json('tags')->nullable(); // For categorization
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
