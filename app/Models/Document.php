<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Document extends Model
{
    protected $fillable = [
        'manual_id',
        'section_id',
        'procedure_id',
        'document_code',
        'title',
        'description',
        'document_type',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'version',
        'status',
        'created_by',
        'approved_by',
        'approved_at',
        'review_date',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'approved_at' => 'datetime',
        'review_date' => 'date',
    ];

    public function manual(): BelongsTo
    {
        return $this->belongsTo(IsoManual::class, 'manual_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(ManualSection::class, 'section_id');
    }

    public function procedure(): BelongsTo
    {
        return $this->belongsTo(Procedure::class, 'procedure_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function revisions(): MorphMany
    {
        return $this->morphMany(Revision::class, 'revisionable');
    }

    public function getFileSizeHumanAttribute(): string
    {
        if (!$this->file_size) return 'Unknown';
        
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }
}
