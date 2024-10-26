<?php
namespace Database\Seeders;
use App\Models\Province;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    public function run()
    {
        $provinces = [
            [ "name" => "Thành phố Hà Nội", "code" => "HN", "division_type" => "thành phố trung ương", "codename" => "thanh_pho_ha_noi", "phone_code" => 24 ],
            [ "name" => "Tỉnh Hà Giang", "code" => "HG", "division_type" => "tỉnh", "codename" => "tinh_ha_giang", "phone_code" => 219 ],
            [ "name" => "Tỉnh Cao Bằng", "code" => "CB", "division_type" => "tỉnh", "codename" => "tinh_cao_bang", "phone_code" => 206 ],
            [ "name" => "Tỉnh Bắc Kạn", "code" => "BK", "division_type" => "tỉnh", "codename" => "tinh_bac_kan", "phone_code" => 209 ],
            [ "name" => "Tỉnh Tuyên Quang", "code" => "TQ", "division_type" => "tỉnh", "codename" => "tinh_tuyen_quang", "phone_code" => 207 ],
            [ "name" => "Tỉnh Lào Cai", "code" => "LC", "division_type" => "tỉnh", "codename" => "tinh_lao_cai", "phone_code" => 214 ],
            [ "name" => "Tỉnh Điện Biên", "code" => "DB", "division_type" => "tỉnh", "codename" => "tinh_dien_bien", "phone_code" => 215 ],
            [ "name" => "Tỉnh Lai Châu", "code" => "LCH", "division_type" => "tỉnh", "codename" => "tinh_lai_chau", "phone_code" => 213 ],
            [ "name" => "Tỉnh Sơn La", "code" => "SL", "division_type" => "tỉnh", "codename" => "tinh_son_la", "phone_code" => 212 ],
            [ "name" => "Tỉnh Yên Bái", "code" => "YB", "division_type" => "tỉnh", "codename" => "tinh_yen_bai", "phone_code" => 216 ],
            [ "name" => "Tỉnh Hoà Bình", "code" => "HB", "division_type" => "tỉnh", "codename" => "tinh_hoa_binh", "phone_code" => 218 ],
            [ "name" => "Tỉnh Thái Nguyên", "code" => "TN", "division_type" => "tỉnh", "codename" => "tinh_thai_nguyen", "phone_code" => 208 ],
            [ "name" => "Tỉnh Lạng Sơn", "code" => "LS", "division_type" => "tỉnh", "codename" => "tinh_lang_son", "phone_code" => 205 ],
            [ "name" => "Tỉnh Quảng Ninh", "code" => "QNI", "division_type" => "tỉnh", "codename" => "tinh_quang_ninh", "phone_code" => 203 ],
            [ "name" => "Tỉnh Bắc Giang", "code" => "BG", "division_type" => "tỉnh", "codename" => "tinh_bac_giang", "phone_code" => 204 ],
            [ "name" => "Tỉnh Phú Thọ", "code" => "PT", "division_type" => "tỉnh", "codename" => "tinh_phu_tho", "phone_code" => 210 ],
            [ "name" => "Tỉnh Vĩnh Phúc", "code" => "VP", "division_type" => "tỉnh", "codename" => "tinh_vinh_phuc", "phone_code" => 211 ],
            [ "name" => "Tỉnh Bắc Ninh", "code" => "BN", "division_type" => "tỉnh", "codename" => "tinh_bac_ninh", "phone_code" => 222 ],
            [ "name" => "Thành phố Hải Phòng", "code" => "HP", "division_type" => "thành phố trung ương", "codename" => "thanh_pho_hai_phong", "phone_code" => 225 ],
            [ "name" => "Tỉnh Hưng Yên", "code" => "HY", "division_type" => "tỉnh", "codename" => "tinh_hung_yen", "phone_code" => 221 ],
            [ "name" => "Tỉnh Thái Bình", "code" => "TB", "division_type" => "tỉnh", "codename" => "tinh_thai_binh", "phone_code" => 227 ],
            [ "name" => "Tỉnh Hà Nam", "code" => "HNA", "division_type" => "tỉnh", "codename" => "tinh_ha_nam", "phone_code" => 226 ],
            [ "name" => "Tỉnh Nam Định", "code" => "ND", "division_type" => "tỉnh", "codename" => "tinh_nam_dinh", "phone_code" => 228 ],
            [ "name" => "Tỉnh Ninh Bình", "code" => "NB", "division_type" => "tỉnh", "codename" => "tinh_ninh_binh", "phone_code" => 229 ],
            [ "name" => "Tỉnh Thanh Hóa", "code" => "TH", "division_type" => "tỉnh", "codename" => "tinh_thanh_hoa", "phone_code" => 237 ],
            [ "name" => "Tỉnh Nghệ An", "code" => "NA", "division_type" => "tỉnh", "codename" => "tinh_nghe_an", "phone_code" => 238 ],
            [ "name" => "Tỉnh Hà Tĩnh", "code" => "HT", "division_type" => "tỉnh", "codename" => "tinh_ha_tinh", "phone_code" => 239 ],
            [ "name" => "Tỉnh Quảng Bình", "code" => "QB", "division_type" => "tỉnh", "codename" => "tinh_quang_binh", "phone_code" => 232 ],
            [ "name" => "Tỉnh Quảng Trị", "code" => "QT", "division_type" => "tỉnh", "codename" => "tinh_quang_tri", "phone_code" => 233 ],
            [ "name" => "Tỉnh Thừa Thiên Huế", "code" => "TTH", "division_type" => "tỉnh", "codename" => "tinh_thua_thien_hue", "phone_code" => 234 ],
            [ "name" => "Thành phố Đà Nẵng", "code" => "DNG", "division_type" => "thành phố trung ương", "codename" => "thanh_pho_da_nang", "phone_code" => 236 ],
            [ "name" => "Tỉnh Quảng Nam", "code" => "QN", "division_type" => "tỉnh", "codename" => "tinh_quang_nam", "phone_code" => 235 ],
            [ "name" => "Tỉnh Quảng Ngãi", "code" => "QNg", "division_type" => "tỉnh", "codename" => "tinh_quang_ngai", "phone_code" => 255 ],
            [ "name" => "Tỉnh Bình Định", "code" => "BD", "division_type" => "tỉnh", "codename" => "tinh_binh_dinh", "phone_code" => 256 ],
            [ "name" => "Tỉnh Phú Yên", "code" => "PY", "division_type" => "tỉnh", "codename" => "tinh_phu_yen", "phone_code" => 257 ],
            [ "name" => "Tỉnh Khánh Hòa", "code" => "KH", "division_type" => "tỉnh", "codename" => "tinh_khanh_hoa", "phone_code" => 258 ],
            [ "name" => "Tỉnh Ninh Thuận", "code" => "NT", "division_type" => "tỉnh", "codename" => "tinh_ninh_thuan", "phone_code" => 259 ],
            [ "name" => "Tỉnh Bình Thuận", "code" => "BT", "division_type" => "tỉnh", "codename" => "tinh_binh_thuan", "phone_code" => 252 ],
            [ "name" => "Tỉnh Tây Ninh", "code" => "TNG", "division_type" => "tỉnh", "codename" => "tinh_tay_ninh", "phone_code" => 661 ],
            [ "name" => "Tỉnh Bình Dương", "code" => "BDG", "division_type" => "tỉnh", "codename" => "tinh_binh_duong", "phone_code" => 650 ],
            [ "name" => "Tỉnh Đồng Nai", "code" => "DN", "division_type" => "tỉnh", "codename" => "tinh_dong_nai", "phone_code" => 251 ],
            [ "name" => "Tỉnh Bà Rịa - Vũng Tàu", "code" => "BRVT", "division_type" => "tỉnh", "codename" => "tinh_ba_ria_vung_tau", "phone_code" => 254 ],
            [ "name" => "Thành phố Hồ Chí Minh", "code" => "SG", "division_type" => "thành phố trung ương", "codename" => "thanh_pho_ho_chi_minh", "phone_code" => 28 ],
            [ "name" => "Tỉnh Long An", "code" => "LA", "division_type" => "tỉnh", "codename" => "tinh_long_an", "phone_code" => 272 ],
            [ "name" => "Tỉnh Tiền Giang", "code" => "TG", "division_type" => "tỉnh", "codename" => "tinh_tien_giang", "phone_code" => 273 ],
            [ "name" => "Tỉnh Bến Tre", "code" => "BTR", "division_type" => "tỉnh", "codename" => "tinh_ben_tre", "phone_code" => 275 ],
            [ "name" => "Tỉnh Trà Vinh", "code" => "TV", "division_type" => "tỉnh", "codename" => "tinh_tra_vinh", "phone_code" => 276 ],
            [ "name" => "Tỉnh Vĩnh Long", "code" => "VL", "division_type" => "tỉnh", "codename" => "tinh_vinh_long", "phone_code" => 277 ],
            [ "name" => "Tỉnh Đồng Tháp", "code" => "DT", "division_type" => "tỉnh", "codename" => "tinh_dong_thap", "phone_code" => 278 ],
            [ "name" => "Tỉnh An Giang", "code" => "AG", "division_type" => "tỉnh", "codename" => "tinh_an_giang", "phone_code" => 296 ],
            [ "name" => "Tỉnh Kiên Giang", "code" => "KG", "division_type" => "tỉnh", "codename" => "tinh_kien_giang", "phone_code" => 299 ],
            [ "name" => "Tỉnh Hậu Giang", "code" => "HUG", "division_type" => "tỉnh", "codename" => "tinh_hau_giang", "phone_code" => 291 ],
            [ "name" => "Tỉnh Sóc Trăng", "code" => "ST", "division_type" => "tỉnh", "codename" => "tinh_soc_trang", "phone_code" => 290 ],
            [ "name" => "Tỉnh Bạc Liêu", "code" => "BL", "division_type" => "tỉnh", "codename" => "tinh_bac_lieu", "phone_code" => 293 ],
            [ "name" => "Tỉnh Cà Mau", "code" => "CM", "division_type" => "tỉnh", "codename" => "tinh_ca_mau", "phone_code" => 294 ],
            [ "name" => "Tỉnh Kon Tum", "code" => "KT", "division_type" => "tỉnh", "codename" => "tinh_kon_tum", "phone_code" => 260 ],
            [ "name" => "Tỉnh Gia Lai", "code" => "GL", "division_type" => "tỉnh", "codename" => "tinh_gia_lai", "phone_code" => 261 ],
            [ "name" => "Tỉnh Đắk Lắk", "code" => "DL", "division_type" => "tỉnh", "codename" => "tinh_dak_lak", "phone_code" => 262 ],
            [ "name" => "Tỉnh Đắk Nông", "code" => "DKN", "division_type" => "tỉnh", "codename" => "tinh_dak_nong", "phone_code" => 263 ],
            [ "name" => "Tỉnh Lâm Đồng", "code" => "LD", "division_type" => "tỉnh", "codename" => "tinh_lam_dong", "phone_code" => 264 ],
            [
                "name" => "Tỉnh Bình Phước",
                "code" => "BP",
                "division_type" => "tỉnh",
                "codename" => "tinh_binh_phuoc",
                "phone_code" => 271,
            ],
            [
                "name" => "Thành phố Cần Thơ",
                "code" => "CT",
                "division_type" => "thành phố",
                "codename" => "thanh_pho_can_tho",
                "phone_code" => 710,
            ],
            
        ];
        

        foreach ($provinces as $province) {
            Province::create($province);
        }
    }
}
