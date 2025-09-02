<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Traits\HasRevisions;

class Procedure extends Model
{
    use HasRevisions;
    protected $fillable = [
        'section_id',
        'procedure_code',
        'title',
        'purpose',
        'scope',
        'procedure_steps',
        'responsibilities',
        'references',
        'records',
        'status',
        'version',
        'owner_id',
        'review_date',
        'effective_date',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
        'review_date' => 'date',
        'effective_date' => 'date',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(ManualSection::class, 'section_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'procedure_id');
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
