<?php

namespace App\Http\Resources;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $account = Account::where('account_id',$this->account_id)->get();
        return [
            'history_id' => $this->history_id,
            'account' => AccountResource::collection($account),
            'login_time' => $this->login_time,
            'logout_time' => $this->logout_time,
            'ip_address' => $this->ip_address,
            'device_name' => $this->device_name,             
            'status' => $this->status == 1 ? true : false,
        ];
    }
}