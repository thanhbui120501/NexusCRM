<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Promotion;
use App\Models\PromotionType;

class PromotionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $promotion_type = PromotionType::where('promotion_type_id',$this->promotion_type_id)->get();
        return [
            'promotion_id' => $this->promotion_id,
            'promotion_name' => $this->promotion_name,  
            'description' => $this->description,
            'type' => $this->type,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'condition' => $this->condition,
            'amount' => $this->amount,
            'percentage' => $this->percentage,
            'maximum_limit' => $this->maximum_limit,
            'promotion_type' => PromotionTypeResource::collection($promotion_type),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'status' => $this->status
        ];
    }
}
