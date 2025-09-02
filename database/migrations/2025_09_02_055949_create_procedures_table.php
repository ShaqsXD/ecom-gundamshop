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
        Schema::create('procedures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('manual_sections')->onDelete('cascade');
            $table->string('procedure_code', 50)->unique(); // e.g., "QMS-001"
            $table->string('title');
            $table->text('purpose')->nullable();
            $table->text('scope')->nullable();
            $table->text('procedure_steps')->nullable(); // JSON or text
            $table->text('responsibilities')->nullable();
            $table->text('references')->nullable();
            $table->text('records')->nullable(); // Required records/documentation
            $table->enum('status', ['draft', 'review', 'approved', 'obsolete'])->default('draft');
            $table->string('version', 20)->default('1.0');
            $table->foreignId('owner_id')->constrained('users'); // Process owner
            $table->date('review_date')->nullable();
            $table->date('effective_date')->nullable();
            $table->json('attachments')->nullable(); // File references
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procedures');
    }
};
