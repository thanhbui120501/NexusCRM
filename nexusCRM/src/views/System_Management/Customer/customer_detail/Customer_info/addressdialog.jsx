/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../../../../axiosClient";

export default function AddressDialog({
    onClose,
    customer_id,
    updateAddress,
    onUpdateAddress,
    setStatusCode,
}) {
    //set province
    const [listProvince, getListProvince] = useState([]);
    const [province, setProvince] = useState({});
    //set district
    const [listDistrict, getListDistrict] = useState([]);
    const [district, setDistrict] = useState({});
    //set ward
    const [listWard, getListWard] = useState([]);
    const [ward, setWard] = useState({});
    //set default address
    const [defaultAddress, setDefaultAddress] = useState(false);
    //address line
    const [addressLine, setAddressLine] = useState("");
    //open select province
    const [openSelectProvince, setOpenSelectProvince] = useState(false);
    //open select district
    const [openSelectDistrict, setOpenSelectDistrict] = useState(false);
    //open select ward
    const [openSelectWard, setOpenSelectWard] = useState(false);
    //set loading
    const [loadingCreate, setLoadingCreate] = useState(false);
    //handle change
    const handleChange = (e) => {
        const maxWords = 100;
        const value = e.target.value;
        const words = value.trim().split(/\s+/);

        // Kiểm tra số từ và ký tự đặc biệt
        if (words.length <= maxWords) {
            setAddressLine(value);
        }
    };
    //get list province
    useEffect(() => {
        getListProvinces();
    }, []);
    //get list district
    useEffect(() => {
        if (province && Object.keys(province).length > 0) {
            getListDistricts(province.id);
        }
    }, [province]);
    //get list ward
    useEffect(() => {
        if (district && Object.keys(district).length > 0) {
            getListWards(district.id);
        }
    }, [district]);
    const getListProvinces = async () => {
        try {
            const response = await axiosClient.get(
                "/province/get-list-province"
            );

            if (response.status === 200) {
                getListProvince(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getListDistricts = async (id) => {
        try {
            const response = await axiosClient.get(
                `/province/get-list-district/${id}`
            );
            if (response.status === 200) {
                getListDistrict(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getListWards = async (id) => {
        try {
            const response = await axiosClient.get(
                `/province/get-list-ward/${id}`
            );
            if (response.status === 200) {
                getListWard(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleCheckboxChange = (val) => {
        setDefaultAddress(val);
    };
    //create address
    const onCreateAddress = async () => {
        try {
            setLoadingCreate(true);
            const data = new FormData();
            data.append("address_line", addressLine);
            data.append("province", province.full_name);
            data.append("town", ward.full_name);
            data.append("ward", district.full_name);
            data.append("country", "Việt Nam");
            data.append("is_default_address", defaultAddress ? 1 : 0);
            const response = await axiosClient.post(
                "/address/create-customer-address",
                data,
                {
                    params: {
                        customer_id: customer_id,
                    },
                }
            );

            if (response.status === 201) {
                setStatusCode(200);
                onUpdateAddress(!updateAddress);
                onClose(false);
            }
        } catch (error) {
            console.error("Lỗi khi tạo địa chỉ:", error);
            const status = error.status;
            setStatusCode(status);
            onClose(false);
        } finally {
            setLoadingCreate(false);
        }
    };
    return (
        <div
            className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[100] items-center justify-center"
            onClick={() => onClose(false)}
        >
            <div
                className="flex p-4 flex-col items-start gap-3 rounded-xl bg-[#fff] shadow-custom w-[45rem]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center self-stretch">
                    <h1 className="text-base font-medium text-[#171717]">
                        Thêm địa chỉ mới
                    </h1>
                    <div
                        onClick={() => onClose(false)}
                        className="flex justify-center items-center gap-2 border rounded-lg bg-white w-8 h-8 cursor-pointer"
                    >
                        <img
                            src="/icons/xmark.svg"
                            alt="xmark_close_sidepanel"
                            className="w-4 h-4"
                        />
                    </div>
                </div>
                <div className="flex py-2.5 flex-col justify-between items-start self-stretch">
                    <div className="border bg-[#e5e5e5] h-[1px] w-full"></div>
                </div>
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <div className="flex justify-center items-start gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="text-sm font-medium text-[#171717]">
                                Chọn đất nước
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-[#E5E5E5] rounded-lg">
                                <input
                                    type="text"
                                    name="nation"
                                    id="nation"
                                    value={"Việt Nam"}
                                    readOnly
                                    placeholder="Chọn đất nước"
                                    className="flex items-center gap-0.5 flex-1"
                                />
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    className="cursor-pointer"
                                    // onClick={() =>
                                    //     setOpenSelectProvince(
                                    //         !openSelectProvince
                                    //     )
                                    // }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                            <h1 className="text-sm font-medium text-[#171717]">
                                Tỉnh/TP
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-[#E5E5E5] rounded-lg">
                                <input
                                    type="text"
                                    name="province"
                                    id="province"
                                    readOnly
                                    placeholder="Chọn Tỉnh/TP"
                                    className="flex items-center gap-0.5 flex-1 text-sm font-medium text-[#171717]"
                                    value={
                                        province &&
                                        Object.keys(province).length > 0
                                            ? province.full_name
                                            : ""
                                    }
                                />
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setOpenSelectProvince(
                                            !openSelectProvince
                                        )
                                    }
                                />
                            </div>
                            {openSelectProvince && (
                                <SelectProvinceDropdown
                                    listProvince={listProvince}
                                    onClose={setOpenSelectProvince}
                                    onData={setProvince}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center items-start gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                            <h1 className="text-sm font-medium text-[#171717]">
                                Quận/Huyện
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-[#E5E5E5] rounded-lg">
                                <input
                                    type="text"
                                    name="district"
                                    id="district"
                                    readOnly
                                    placeholder="Chọn Quận/Huyện"
                                    value={
                                        district &&
                                        Object.keys(district).length > 0
                                            ? district.full_name
                                            : ""
                                    }
                                    className="flex items-center gap-0.5 flex-1 text-sm font-medium text-[#171717]"
                                />
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        province &&
                                            Object.keys(province).length > 0 &&
                                            setOpenSelectDistrict(
                                                !openSelectDistrict
                                            );
                                    }}
                                />
                            </div>
                            {openSelectDistrict && (
                                <SelectDistrictDropdown
                                    listDistrict={listDistrict}
                                    onClose={setOpenSelectDistrict}
                                    onData={setDistrict}
                                />
                            )}
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                            <h1 className="text-sm font-medium text-[#171717]">
                                Phường/Xã/Thị Trấn
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-[#E5E5E5] rounded-lg">
                                <input
                                    type="text"
                                    name="ward"
                                    id="ward"
                                    readOnly
                                    placeholder="Chọn Phường/Xã/Thị Trấn"
                                    value={
                                        ward && Object.keys(ward).length > 0
                                            ? ward.full_name
                                            : ""
                                    }
                                    className="flex items-center gap-0.5 flex-1 text-sm font-medium text-[#171717]"
                                />
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        district &&
                                            Object.keys(district).length > 0 &&
                                            setOpenSelectWard(!openSelectWard);
                                    }}
                                />
                            </div>
                            {openSelectWard && (
                                <SelectWardDropdown
                                    listWard={listWard}
                                    onClose={setOpenSelectWard}
                                    onData={setWard}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center items-start gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="text-sm font-medium text-[#171717]">
                                Địa chỉ
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-[#E5E5E5] rounded-lg">
                                <input
                                    type="text"
                                    name="address-line"
                                    id="address-line"
                                    placeholder="Nhập địa chỉ"
                                    value={addressLine}
                                    onChange={handleChange}
                                    className="flex items-center gap-0.5 flex-1 text-sm font-medium text-[#171717]"
                                />
                                {/* <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    className="cursor-pointer"
                                    // onClick={() =>
                                    //     setOpenSelectProvince(
                                    //         !openSelectProvince
                                    //     )
                                    // }
                                /> */}
                            </div>
                        </div>
                        {/* <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="text-sm font-medium text-[#171717]">Phường/Xã/Thị Trấn</h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-[#E5E5E5] rounded-lg">
                                <input type="text" name="ward" id="ward" readOnly placeholder="Chọn Phường/Xã/Thị Trấn" className="flex items-center gap-0.5 flex-1"/>
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    className="cursor-pointer"
                                    // onClick={() =>
                                    //     setOpenSelectProvince(
                                    //         !openSelectProvince
                                    //     )
                                    // }
                                />
                            </div>
                        </div> */}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="checkbox"
                            checked={defaultAddress}
                            onChange={(e) => {
                                handleCheckboxChange(e.target.checked);
                            }}
                            className="h-4 w-4  bg-gray-100 border-gray-300 rounded-lg accent-[#EA580C]"
                        />
                        <h1 className="text-base font-medium text-[#171717]">
                            Đặt làm địa chỉ mặc định
                        </h1>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 self-stretch">
                    {(listDistrict.some((item) => item.id === district.id) ===
                        false ||
                        addressLine === "" ||
                        listWard.some((item) => item.id === ward.id) ===
                            false) && (
                        <h1 className="text-sm font-medium text-red-600">
                            Địa chỉ không hợp lệ
                        </h1>
                    )}
                    <button
                        onClick={() => onClose(false)}
                        className="flex flex-col py-2 px-4 items-center justify-center gap-2 border border-[#E5E5E5] bg-[#fff] hover:bg-gray-200 rounded-lg"
                    >
                        <h1 className="text-sm font-semibold text-[#171717]">
                            Hủy
                        </h1>
                    </button>
                    {addressLine != "" &&
                        province &&
                        Object.keys(province).length > 0 &&
                        district &&
                        Object.keys(district).length > 0 &&
                        ward &&
                        Object.keys(ward).length > 0 && (
                            <button
                                onClick={() => {
                                    listDistrict.some(
                                        (item) => item.id === district.id
                                    ) &&
                                        listWard.some(
                                            (item) => item.id === ward.id
                                        ) &&
                                        onCreateAddress();
                                }}
                                className="flex flex-col py-2 px-4 items-center justify-center gap-2 border  bg-[#171717] hover:bg-gray-500 rounded-lg"
                            >
                                <h1 className="text-sm font-semibold text-[#fff]">
                                    Xác nhận
                                </h1>
                            </button>
                        )}
                </div>
                {loadingCreate && (
                    <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                        <h1 className="text-sm font-medium text-white">
                            Đang thêm mới địa chỉ
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}

export function SelectProvinceDropdown({ listProvince, onClose, onData }) {
    return (
        <div className="flex flex-col absolute top-16 border bg-white z-50 p-2 h-40 overflow-y-auto overflow-x-hidden gap-2 w-full">
            {listProvince.map((pro) => (
                <div
                    key={pro.id}
                    className="flex hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                        onClose(false);
                        onData(pro);
                    }}
                >
                    <h1 className="text-sm font-medium text-[#171717]">
                        {pro.full_name}
                    </h1>
                </div>
            ))}
        </div>
    );
}

export function SelectDistrictDropdown({ listDistrict, onClose, onData }) {
    return (
        <div className="flex flex-col absolute top-16 border bg-white p-2 h-32 z-50 overflow-y-auto overflow-x-hidden gap-2 w-full">
            {listDistrict?.map((dis) => (
                <div
                    key={dis.id}
                    className="flex hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                        onClose(false);
                        onData(dis);
                    }}
                >
                    <h1 className="text-sm font-medium text-[#171717]">
                        {dis.full_name}
                    </h1>
                </div>
            ))}
        </div>
    );
}

export function SelectWardDropdown({ listWard, onClose, onData }) {
    return (
        <div className="flex flex-col absolute top-16 border bg-white p-2 z-50 h-28 overflow-y-auto overflow-x-hidden gap-2 w-full">
            {listWard.map((war) => (
                <div
                    key={war.id}
                    className="flex hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                        onClose(false);
                        onData(war);
                    }}
                >
                    <h1 className="text-sm font-medium text-[#171717]">
                        {war.full_name}
                    </h1>
                </div>
            ))}
        </div>
    );
}
