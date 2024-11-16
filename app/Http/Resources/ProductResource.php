<?php

namespace App\Http\Resources;

use App\Models\Distributor;
use App\Models\Product_Image;
use App\Models\Promotion;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
        $images = Product_Image::where('product_id',$this->product_id)->first()->image_name;
        $promotions = Promotion::where('promotion_id', $this->promotion_id)->first()->promotion_id;
        $warehouses = Warehouse::where('warehouse_id', $this->warehouse_id)->first()->warehouse_name;
        //get distributor id
        $distributor_id = Warehouse::where('warehouse_id', $this->warehouse_id)->first()->distributor_id;
        $distributor = Distributor::where('distributor_id', $distributor_id )->first()->distributor_name;
        return [
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'product_quantity' => $this->product_quantity,
            'description' => $this->description,
            'start_date' => $this->start_date,
            'selling_price' =>  $this->selling_price,
            'import_price' =>  $this->import_price,
            'promotions' =>  $promotions,
            'unit_of_measure' =>  $this->unit_of_measure,
            'weight' =>  $this->weight,
            'product_images' =>  $this->product_images,
            'images' => $images,
            'product_catalog' =>  $this->product_catalog,
            'inventory' =>  $this->inventory,
            'status' =>  $this->status,
            'warehouses' =>  $warehouses,
            'distributor' => $distributor,
            'created_at' =>  $this->created_at,
            'updated_at' =>  $this->updated_at
        ];
    }
}
