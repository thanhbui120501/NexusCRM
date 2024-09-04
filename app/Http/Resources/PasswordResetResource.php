<?php

namespace App\Http\Resources;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PasswordResetResource extends JsonResource
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
            'reset_id' => $this->reset_id,    
            'token' => $this->token,           
            'account' => AccountResource::collection($account),           
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'status' => $this->status == 1 ? true : false,
        ];
    }
    
}