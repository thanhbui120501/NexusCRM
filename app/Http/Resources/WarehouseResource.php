<?php

namespace App\Http\Resources;

use App\Models\Distributor;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $dis = Distributor::where('distributor_id',$this->distributor_id)->get();
        return [
            'warehouse_id' => $this->warehouse_id,
            'warehouse_name' => $this->warehouse_name,
            'address' => $this->address,
            'distributor' => DistributorResource::collection($dis),
            'product_quantity' => $this->product_quantity,     
            'update_at' => $this->updated_at,
            'create_at' => $this->created_at,
            'status' => $this->status == 1 ? true : false,
        ];
    }
}
