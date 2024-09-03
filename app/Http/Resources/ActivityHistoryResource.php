<?php

namespace App\Http\Resources;

use App\Models\Account;
use App\Models\ActivityHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityHistoryResource extends JsonResource
{
    /**
     * Indicates if the resource's collection keys should be preserved.
     *
     * @var bool
     */
    public $preserveKeys = true;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $account = Account::where('account_id',$this->account_id)->get();
        return [
            'activity_id' => $this->activity_id,
            'activity_name' => $this->activity_name,
            'activity_content' => $this->activity_content,
            'activity_type' => $this->activity_type,
            'username' => $this->username,
            'account' => AccountResource::collection($account),           
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'status' => $this->status == 1 ? true : false,
        ];
    }
    
}