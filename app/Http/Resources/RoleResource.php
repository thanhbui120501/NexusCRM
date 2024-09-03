<?php

namespace App\Http\Resources;

use App\Models\Role;
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
        return [
            'role_id' => $this->role_id,
            'role_name' => $this->role_name,
            'description' => $this->description,
            'create_at' => $this->created_at,
            'update_at' => $this->updated_at,
            'status' => $this->status == 1 ? true : false,
        ];
        
    }
    
}