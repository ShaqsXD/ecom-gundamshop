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
        Schema::create('manual_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manual_id')->constrained('iso_manuals')->onDelete('cascade');
            $table->foreignId('parent_section_id')->nullable()->constrained('manual_sections')->onDelete('cascade');
            $table->string('section_number', 20); // e.g., "4.1.2"
            $table->string('title');
            $table->text('content')->nullable();
            $table->integer('order_index')->default(0);
            $table->enum('section_type', ['chapter', 'section', 'subsection', 'appendix'])->default('section');
            $table->boolean('is_required')->default(true);
            $table->json('requirements')->nullable(); // ISO requirements and criteria
            $table->timestamps();
            
            $table->unique(['manual_id', 'section_number']);
            $table->index(['manual_id', 'parent_section_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manual_sections');
    }
};
