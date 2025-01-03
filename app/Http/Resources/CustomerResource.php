<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Account;
use App\Models\Address;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //get account manage customer
        //$account = Account::where('account_id',$this->account_id)->get();
        $default_address = "";
        $get_address = Address::where('customer_id',$this->customer_id)->where('is_default_address',1)->first();
        
        if($get_address){
            $default_address = $get_address->address_line .', '. $get_address->town .', '. $get_address->ward .', '. $get_address->province;
        }
        return  [
            'customer_id' => $this->customer_id,          
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'full_name' => $this->full_name,
            'gender' => $this->gender == 0 ? "Male" : "Female",
            'image_name' => $this->image_name,
            'date_of_birth' => $this->date_of_birth,
            'province' => $get_address ? $get_address->province : "",
            'town' => $get_address ? $get_address->town : "",
            'ward' => $get_address ? $get_address->ward : "",
            'address' => $default_address,
            'customer_class' => $this->customer_class,
            'customer_group' => $this->customer_group,
            'customer_source' => $this->customer_source,
            //'account_created' => AccountResource::collection($account),     
            'updated_at' => $this->created_at,
            'created_at' => $this->updated_at,
            'status' => $this->status,           
        ];
        
    }
}
