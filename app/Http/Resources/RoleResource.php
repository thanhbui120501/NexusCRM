<?php

namespace App\Http\Resources;

use App\Models\Role;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {       
        $member = Account::where('role_id',$this->role_id)->count();
        return [
            'role_id' => $this->role_id,
            'role_name' => $this->role_name,
            'account_member_count' => $member,
            'role_another_name' => $this->role_another_name,
            'role_level' => $this->role_level,
            'description' => $this->description,
            'create_at' => $this->created_at,
            'update_at' => $this->updated_at,
            'status' => $this->status == 1 ? true : false,
        ];
        
    }
    
}