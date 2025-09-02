<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Revision extends Model
{
    protected $fillable = [
        'revisionable_type',
        'revisionable_id',
        'version',
        'changes_summary',
        'old_data',
        'new_data',
        'change_type',
        'changed_by',
        'changed_at',
        'change_reason',
        'is_major_change',
    ];

    protected $casts = [
        'old_data' => 'array',
        'new_data' => 'array',
        'changed_at' => 'datetime',
        'is_major_change' => 'boolean',
    ];

    public function revisionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    public function isMajorChange(): bool
    {
        return $this->is_major_change;
    }
}
