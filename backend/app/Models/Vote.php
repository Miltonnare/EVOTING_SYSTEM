<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Vote extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'uuid',
        'election_id',
        'category_id',
        'candidate_id',
        'voter_id_hash',
        'vote_receipt_hash',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
            if (empty($model->created_at)) {
                $model->created_at = now();
            }
        });
    }

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
