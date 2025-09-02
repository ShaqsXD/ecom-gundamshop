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
        Schema::create('iso_manuals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('iso_standard')->nullable(); // e.g., "ISO 9001:2015"
            $table->text('description')->nullable();
            $table->string('version', 50)->default('1.0');
            $table->enum('status', ['draft', 'review', 'approved', 'archived'])->default('draft');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->date('effective_date')->nullable();
            $table->date('review_date')->nullable();
            $table->json('metadata')->nullable(); // Additional ISO-specific metadata
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iso_manuals');
    }
};
