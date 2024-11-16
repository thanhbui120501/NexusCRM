<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
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
        return [
            'image_id' => $this->image_id,
            'image_name' => $this->product_name,                        
            'status' => $this->status == 1 ? true : false,            
            'created_at' => $this->created_at,
            'updated_at' =>  $this->updated_at
        ];
    }
}
