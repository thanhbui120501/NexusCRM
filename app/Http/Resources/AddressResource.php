<?php

namespace App\Http\Resources;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
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
        // //return parent::toArray($request);
        // $role = Role::where('role_id',$this->role_id)->get();
        // if($this->account_id != null){
        //     $account = Account::where('account_id',$this->created_by)->get();
        // }
        
        return [
            'address_id' => $this->address_id,
            'customer_id' => $this->customer_id,                 
            'address_line' => $this->address_line,
            'province' => $this->province,
            'town' => $this->town,
            'ward' => $this->ward,      
            'country' => $this->country,                          
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_status' => $this->status == 1 ? true : false,            
        ];
    }
    
}