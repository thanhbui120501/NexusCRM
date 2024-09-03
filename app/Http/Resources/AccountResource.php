<?php

namespace App\Http\Resources;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
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
        //return parent::toArray($request);
        $role = Role::where('role_id',$this->role_id)->get();
        
        return [
            'account_id' => $this->account_id,
            'username' => $this->username,            
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'full_name' => $this->full_name,       
            'date_of_birth' => $this->date_of_birth,
            'role' => RoleResource::collection($role),          
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'status' => $this->status == 1 ? true : false,
        ];
    }
    
}