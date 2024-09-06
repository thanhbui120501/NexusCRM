<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'promotion_type_id' => $this->promotion_type_id,
            'promotion_type_name' => $this->promotion_type_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'status' => $this->status == 1 ? true : false,
        ];
    }
}
