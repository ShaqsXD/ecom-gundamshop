<?php

namespace App\Traits;

use App\Models\Revision;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasRevisions
{
    /**
     * Boot the trait
     */
    protected static function bootHasRevisions(): void
    {
        static::updated(function ($model) {
            $model->createRevision('updated');
        });

        static::created(function ($model) {
            $model->createRevision('created');
        });
    }

    /**
     * Get all revisions for this model
     */
    public function revisions(): MorphMany
    {
        return $this->morphMany(Revision::class, 'revisionable')->orderBy('changed_at', 'desc');
    }

    /**
     * Create a new revision
     */
    public function createRevision(string $changeType, array $oldData = null, string $reason = null): Revision
    {
        $oldData = $oldData ?? $this->getOriginal();
        $newData = $this->getAttributes();

        // Determine if this is a major change
        $isMajorChange = $this->isMajorChange($oldData, $newData);

        // Increment version if major change
        if ($isMajorChange && $changeType === 'updated') {
            $this->incrementVersion();
        }

        return Revision::create([
            'revisionable_type' => get_class($this),
            'revisionable_id' => $this->id,
            'version' => $this->version ?? '1.0',
            'changes_summary' => $this->generateChangesSummary($oldData, $newData),
            'old_data' => $oldData,
            'new_data' => $newData,
            'change_type' => $changeType,
            'changed_by' => auth()->id(),
            'changed_at' => now(),
            'change_reason' => $reason,
            'is_major_change' => $isMajorChange,
        ]);
    }

    /**
     * Determine if changes constitute a major revision
     */
    protected function isMajorChange(array $oldData, array $newData): bool
    {
        $majorFields = $this->getMajorRevisionFields();
        
        foreach ($majorFields as $field) {
            if (($oldData[$field] ?? null) !== ($newData[$field] ?? null)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get fields that trigger major revisions
     */
    protected function getMajorRevisionFields(): array
    {
        return ['title', 'status', 'content', 'procedure_steps'];
    }

    /**
     * Generate a summary of changes
     */
    protected function generateChangesSummary(array $oldData, array $newData): string
    {
        $changes = [];

        foreach ($newData as $field => $newValue) {
            $oldValue = $oldData[$field] ?? null;
            
            if ($oldValue !== $newValue && !in_array($field, ['updated_at', 'created_at'])) {
                $changes[] = ucfirst(str_replace('_', ' ', $field)) . ' changed';
            }
        }

        return implode(', ', $changes) ?: 'Minor updates';
    }

    /**
     * Increment version number
     */
    protected function incrementVersion(): void
    {
        if (isset($this->version)) {
            $versionParts = explode('.', $this->version);
            $versionParts[0] = (int)$versionParts[0] + 1;
            if (count($versionParts) > 1) {
                $versionParts[1] = 0;
            }
            $this->version = implode('.', $versionParts);
            $this->save();
        }
    }
}