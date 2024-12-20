/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../../../../axiosClient";

export default function AddressDialog({
    onClose,
    customer_id,
    updateAddress,
    onUpdateAddress,
    setStatusCode,
    addAddress,
    listAddress,
    type,
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
    const handldeAccept = () => {
        if (type == "updated") {
            if (
                listDistrict.some((item) => item.id === district.id) &&
                listWard.some((item) => item.id === ward.id)
            ) {
                onCreateAddress();
            } else {
                return;
            }
        } else {
            addAddress(
                province.full_name,
                district.full_name,
                ward.full_name,
                addressLine,
                defaultAddress
            );
            onClose(false);
        }
    };
    return (
        <div
            className="fixed flex flex-col inset-0 bg-background-black bg-opacity-50 z-[100] items-center justify-center"
            onClick={() => onClose(false)}
        >
            <div
                className="flex p-4 flex-col items-start gap-3 rounded-xl bg-background-surface_default dark:bg-background-neutral-hover shadow-custom w-[45rem]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center self-stretch">
                    <h1 className="text-base font-medium text-text-primary dark:text-text-white">
                        Thêm địa chỉ mới
                    </h1>
                    <div
                        onClick={() => onClose(false)}
                        className="flex justify-center items-center gap-2 border rounded-lg bg-background-surface_default w-8 h-8 cursor-pointer"
                    >
                        <img
                            src="/icons/xmark.svg"
                            alt="xmark_close_sidepanel"
                            className="w-4 h-4"
                        />
                    </div>
                </div>
                <div className="flex py-2.5 flex-col justify-between items-start self-stretch">
                    <div className="border border-border-neutral-default h-[1px] w-full"></div>
                </div>
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <div className="flex justify-center items-start gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                                Chọn đất nước
                            </h1>

                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default `}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
                                        type="text"
                                        name="nation"
                                        id="nation"
                                        value={"Việt Nam"}
                                        readOnly
                                        placeholder="Chọn đất nước"
                                    />
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="cursor-pointer w-5 h-5 text-text-primary dark:text-text-white -rotate-90"
                                    >
                                        <path d="M16.5625 9.01562L10.625 14.6016C10.4297 14.7969 10.1953 14.875 10 14.875C9.76562 14.875 9.53125 14.7969 9.33594 14.6406L3.39844 9.01562C3.00781 8.66406 3.00781 8.07812 3.35938 7.6875C3.71094 7.29688 4.29688 7.29688 4.6875 7.64844L10 12.6484L15.2734 7.64844C15.6641 7.29688 16.25 7.29688 16.6016 7.6875C16.9531 8.07812 16.9531 8.66406 16.5625 9.01562Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                            <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                                Tỉnh/TP
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default `}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
                                        type="text"
                                        name="province"
                                        id="province"
                                        readOnly
                                        placeholder="Chọn Tỉnh/TP"
                                        value={
                                            province &&
                                            Object.keys(province).length > 0
                                                ? province.full_name
                                                : ""
                                        }
                                    />
                                    <svg
                                        onClick={() =>
                                            setOpenSelectProvince(
                                                !openSelectProvince
                                            )
                                        }
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`cursor-pointer w-5 h-5 text-text-primary dark:text-text-white ${
                                            openSelectProvince
                                                ? "rotate-0"
                                                : "-rotate-90"
                                        }`}
                                    >
                                        <path d="M16.5625 9.01562L10.625 14.6016C10.4297 14.7969 10.1953 14.875 10 14.875C9.76562 14.875 9.53125 14.7969 9.33594 14.6406L3.39844 9.01562C3.00781 8.66406 3.00781 8.07812 3.35938 7.6875C3.71094 7.29688 4.29688 7.29688 4.6875 7.64844L10 12.6484L15.2734 7.64844C15.6641 7.29688 16.25 7.29688 16.6016 7.6875C16.9531 8.07812 16.9531 8.66406 16.5625 9.01562Z" />
                                    </svg>
                                </div>
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
                            <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                                Quận/Huyện
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default `}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
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
                                    />
                                    <svg
                                        onClick={() => {
                                            province &&
                                                Object.keys(province).length >
                                                    0 &&
                                                setOpenSelectDistrict(
                                                    !openSelectDistrict
                                                );
                                        }}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`cursor-pointer w-5 h-5 text-text-primary dark:text-text-white ${
                                            openSelectDistrict
                                                ? "rotate-0"
                                                : "-rotate-90"
                                        }`}
                                    >
                                        <path d="M16.5625 9.01562L10.625 14.6016C10.4297 14.7969 10.1953 14.875 10 14.875C9.76562 14.875 9.53125 14.7969 9.33594 14.6406L3.39844 9.01562C3.00781 8.66406 3.00781 8.07812 3.35938 7.6875C3.71094 7.29688 4.29688 7.29688 4.6875 7.64844L10 12.6484L15.2734 7.64844C15.6641 7.29688 16.25 7.29688 16.6016 7.6875C16.9531 8.07812 16.9531 8.66406 16.5625 9.01562Z" />
                                    </svg>
                                </div>
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
                            <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                                Phường/Xã/Thị Trấn
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default `}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
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
                                    />
                                    <svg
                                        onClick={() => {
                                            district &&
                                                Object.keys(district).length >
                                                    0 &&
                                                setOpenSelectWard(
                                                    !openSelectWard
                                                );
                                        }}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`cursor-pointer w-5 h-5 text-text-primary dark:text-text-white ${
                                            openSelectWard
                                                ? "rotate-0"
                                                : "-rotate-90"
                                        }`}
                                    >
                                        <path d="M16.5625 9.01562L10.625 14.6016C10.4297 14.7969 10.1953 14.875 10 14.875C9.76562 14.875 9.53125 14.7969 9.33594 14.6406L3.39844 9.01562C3.00781 8.66406 3.00781 8.07812 3.35938 7.6875C3.71094 7.29688 4.29688 7.29688 4.6875 7.64844L10 12.6484L15.2734 7.64844C15.6641 7.29688 16.25 7.29688 16.6016 7.6875C16.9531 8.07812 16.9531 8.66406 16.5625 9.01562Z" />
                                    </svg>
                                </div>
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
                            <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                                Địa chỉ
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default `}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="text"
                                        name="address-line"
                                        id="address-line"
                                        placeholder="Nhập địa chỉ"
                                        value={addressLine}
                                        onChange={handleChange}
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="text-sm font-medium text-text-primary dark:text-text-white">Phường/Xã/Thị Trấn</h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-border-neutral-default rounded-lg">
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
                            className="w-5 h-5 text-text-brand ring-1 ring-background-neutral-default  bg-background-neutral-subtle_hover rounded  focus:ring-background-brand-default "
                        />
                        <h1 className="text-base font-medium text-text-primary dark:text-text-white">
                            Đặt làm địa chỉ mặc định
                        </h1>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 self-stretch">
                    {listAddress != null && listAddress.length >= 10 && (
                        <h1 className="text-sm font-medium text-text-negative">
                            Số lượng địa chỉ đã đạt giới hạn
                        </h1>
                    )}
                    {(listDistrict.some((item) => item.id === district.id) ===
                        false ||
                        addressLine === "" ||
                        listWard.some((item) => item.id === ward.id) ===
                            false) && (
                        <h1 className="text-sm font-medium text-text-negative">
                            Địa chỉ không hợp lệ
                        </h1>
                    )}

                    <button
                        onClick={() => onClose(false)}
                        className="flex flex-col py-2 px-4 items-center justify-center gap-2 border border-border-neutral-default bg-background-surface_default hover:bg-background-neutral-subtle_hover rounded-lg"
                    >
                        <h1 className="text-sm font-semibold text-text-primary ">
                            Hủy
                        </h1>
                    </button>
                    {addressLine != "" &&
                        province &&
                        Object.keys(province).length > 0 &&
                        district &&
                        Object.keys(district).length > 0 &&
                        ward &&
                        Object.keys(ward).length > 0 &&
                        listDistrict.some((item) => item.id === district.id) ==
                            true &&
                        listWard.some((item) => item.id === ward.id) ==
                            true && (
                            <button
                                onClick={handldeAccept}
                                className="flex flex-col py-2 px-4 items-center justify-center gap-2 border  bg-background-black hover:bg-background-neutral-press rounded-lg"
                            >
                                <h1 className="text-sm font-semibold text-text-white">
                                    Xác nhận
                                </h1>
                            </button>
                        )}
                </div>
                {loadingCreate && (
                    <div className="fixed flex flex-col inset-0 bg-background-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                        <h1 className="text-sm font-medium text-text-white">
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
        <div className="flex flex-col absolute rounded-lg top-16 border bg-background-surface_default dark:bg-background-neutral-default z-50 p-2 h-40 overflow-y-auto overflow-x-hidden gap-2 w-full">
            {listProvince.map((pro) => (
                <div
                    key={pro.id}
                    className="flex pl-1 py-1 hover:bg-background-neutral-subtle_hover dark:hover:bg-background-neutral-press cursor-pointer rounded-lg"
                    onClick={() => {
                        onClose(false);
                        onData(pro);
                    }}
                >
                    <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                        {pro.full_name}
                    </h1>
                </div>
            ))}
        </div>
    );
}

export function SelectDistrictDropdown({ listDistrict, onClose, onData }) {
    return (
        <div className="flex flex-col absolute rounded-lg top-16 border bg-background-surface_default dark:bg-background-neutral-default z-50 p-2 h-40 overflow-y-auto overflow-x-hidden gap-2 w-full">
            {listDistrict.map((dis) => (
                <div
                    key={dis.id}
                    className="flex pl-1 py-1 hover:bg-background-neutral-subtle_hover dark:hover:bg-background-neutral-press cursor-pointer rounded-lg"
                    onClick={() => {
                        onClose(false);
                        onData(dis);
                    }}
                >
                    <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                        {dis.full_name}
                    </h1>
                </div>
            ))}
        </div>
    );
}

export function SelectWardDropdown({ listWard, onClose, onData }) {
    return (
        <div className="flex flex-col absolute rounded-lg top-16 border bg-background-surface_default dark:bg-background-neutral-default z-50 p-2 h-40 overflow-y-auto overflow-x-hidden gap-2 w-full">
            {listWard.map((war) => (
                <div
                    key={war.id}
                    className="flex pl-1 py-1 hover:bg-background-neutral-subtle_hover dark:hover:bg-background-neutral-press cursor-pointer rounded-lg"
                    onClick={() => {
                        onClose(false);
                        onData(war);
                    }}
                >
                    <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
                        {war.full_name}
                    </h1>
                </div>
            ))}
        </div>
    );
}
