<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\District;
use App\Models\Ward;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use GuzzleHttp\Client;

class ProvincesResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $province = Province::orderBy('name')->get();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List provinces",
            'data' => $province,

        ];
        return response()->json($arr, Response::HTTP_OK);
    }
    public function getListDistrict(Province $province)
    {
        $district = District::where('province_id', $province->id)->orderBy('name')->get();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List districts",
            'data' => $district,

        ];
        return response()->json($arr, Response::HTTP_OK);
    }
    public function getListWard(District $district)
    {
        $ward = Ward::where('district_id', $district->id)->orderBy('name')->get();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List wards",
            'data' => $ward,

        ];
        return response()->json($arr, Response::HTTP_OK);
    }
    public function updateProvince(Request $request)
    {

        $client = new Client();

        try {
            $response = $client->request('GET', 'https://esgoo.net/api-tinhthanh/4/0.htm', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $request->bearerToken(),
                    'Accept'        => 'application/json',
                ],
            ]);

            $responseData = json_decode($response->getBody(), true);

            if (isset($responseData['data']) && is_array($responseData['data'])) {
                foreach ($responseData['data'] as $provinceData) {
                    // Lưu tỉnh
                    $province = Province::updateOrCreate(
                        ['id' => $provinceData['id']],
                        [
                            'id' => $provinceData['id'],
                            'name' => $provinceData['name'],
                            'name_en' => $provinceData['name_en'],
                            'full_name' => $provinceData['full_name'],
                            'full_name_en' => $provinceData['full_name_en'],
                            'latitude' => $provinceData['latitude'],
                            'longitude' => $provinceData['longitude'],
                        ]
                    );

                    // Lưu quận/huyện
                    if (isset($provinceData['data2']) && is_array($provinceData['data2'])) {
                        foreach ($provinceData['data2'] as $districtData) {
                            $district = District::updateOrCreate(
                                ['id' => $districtData['id']],
                                [
                                    'id' => $districtData['id'],
                                    'province_id' => $province->id,
                                    'name' => $districtData['name'],
                                    'name_en' => $districtData['name_en'],
                                    'full_name' => $districtData['full_name'],
                                    'full_name_en' => $districtData['full_name_en'],
                                    'latitude' => $districtData['latitude'],
                                    'longitude' => $districtData['longitude'],
                                ]
                            );

                            // Lưu xã/phường
                            if (isset($districtData['data3']) && is_array($districtData['data3'])) {
                                foreach ($districtData['data3'] as $wardData) {
                                    Ward::updateOrCreate(
                                        ['id' => $wardData['id']],
                                        [
                                            'id' => $wardData['id'],
                                            'district_id' => $district->id,
                                            'name' => $wardData['name'],
                                            'name_en' => $wardData['name_en'],
                                            'full_name' => $wardData['full_name'],
                                            'full_name_en' => $wardData['full_name_en'],
                                            'latitude' => $wardData['latitude'],
                                            'longitude' => $wardData['longitude'],
                                        ]
                                    );
                                }
                            }
                        }
                    }
                }
                return response()->json(['message' => 'Location data updated successfully']);
            } else {
                return response()->json(['error' => 'Invalid data format'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
