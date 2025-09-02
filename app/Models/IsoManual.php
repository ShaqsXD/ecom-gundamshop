<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Traits\HasRevisions;

class IsoManual extends Model
{
    use HasRevisions;
    protected $fillable = [
        'title',
        'iso_standard',
        'description',
        'version',
        'status',
        'created_by',
        'approved_by',
        'approved_at',
        'effective_date',
        'review_date',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'approved_at' => 'datetime',
        'effective_date' => 'date',
        'review_date' => 'date',
    ];

    public function sections(): HasMany
    {
        return $this->hasMany(ManualSection::class, 'manual_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'manual_id');
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

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isEditable(): bool
    {
        return in_array($this->status, ['draft', 'review']);
    }
}
