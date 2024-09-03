<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DistributorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'distributor_id' => $this->distributor_id,
            'distributor_name' => $this->distributor_name,
            'address' => $this->address,
            'representative_name' => $this->representative_name,
            'phone_number' => $this->phone_number,
            'business_sector' => $this->business_sector,
            'update_at' => $this->updated_at,
            'create_at' => $this->created_at,
            'status' => $this->status == 1 ? true : false,
        ];
    }
}
