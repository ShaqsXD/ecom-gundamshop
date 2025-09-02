<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Traits\HasRevisions;

class ManualSection extends Model
{
    use HasRevisions;
    protected $fillable = [
        'manual_id',
        'parent_section_id',
        'section_number',
        'title',
        'content',
        'order_index',
        'section_type',
        'is_required',
        'requirements',
    ];

    protected $casts = [
        'requirements' => 'array',
        'is_required' => 'boolean',
    ];

    public function manual(): BelongsTo
    {
        return $this->belongsTo(IsoManual::class, 'manual_id');
    }

    public function parentSection(): BelongsTo
    {
        return $this->belongsTo(ManualSection::class, 'parent_section_id');
    }

    public function childSections(): HasMany
    {
        return $this->hasMany(ManualSection::class, 'parent_section_id')->orderBy('order_index');
    }

    public function procedures(): HasMany
    {
        return $this->hasMany(Procedure::class, 'section_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'section_id');
    }

    public function revisions(): MorphMany
    {
        return $this->morphMany(Revision::class, 'revisionable');
    }

    public function getFullSectionNumberAttribute(): string
    {
        if ($this->parentSection) {
            return $this->parentSection->full_section_number . '.' . $this->section_number;
        }
        return $this->section_number;
    }
}
