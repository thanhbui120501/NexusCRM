/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import { toast, ToastContainer } from "react-toastify";
export default function SidePanel({ isOpen, onData, role, onUpdated }) {
    //navigate
    const navigate = useNavigate();
    //role status?
    const status = role.status;
    const [checked, setChecked] = useState(status);
    //set loading
    const [loading, setLoading] = useState(false);
    //set role status
    const handleCheckboxChange = (val) => {
        setChecked(val);
        updateStatus(val);
    };
    //navidate to account create page
    const handleNavigation = (path) => {
        navigate(path);
    };
    const updateStatus = async (val) => {
        try {
            console.log(val);
            setLoading(true);
            const data = {
                status: val ? "1" : "0",
            };

            const response = await axiosClient.patch(
                `/role/update-role/${role.role_id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data);
            if (response.status === 200) {                   
                if (onUpdated) {
                    onUpdated(true);
                } else {
                    console.error("onUpdated is undefined");
                }            
                        
            }
        } catch (err) {
            console.log(err);
            toast.error("Cập nhật thất bại!", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }finally {
            setLoading(false); // Đặt loading về false trong cả trường hợp thành công và thất bại
        }
    };
    return (
        <div
            className={`flex flex-col items-start fixed top-0 right-0 h-screen w-[712px] bg-white shadow-lg transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out z-[200] overflow-y-auto overflow-x-hidden`}
        >
            <div
                name="header"
                id="header"
                className="flex px-6 py-4 justify-between items-center self-stretch"
            >
                <h1 className="text-gray-900 text-base font-medium">
                    Chi tiết chức vụ
                </h1>
                <ToastContainer />
                <div
                    onClick={() => {
                        onData(false);
                    }}
                    className="flex  justify-center items-center gap-2 border rounded-lg bg-white w-8 h-8 cursor-pointer"
                >
                    <img
                        src="/icons/xmark.svg"
                        alt="xmark_close_sidepanel"
                        className="w-4 h-4"
                    />
                </div>
            </div>
            <div className="w-full h-px bg-gray-300 my-2.5"></div>
            <div
                name="body"
                id="body"
                className="flex p-6 flex-col items-start gap-6 flex-1 self-stretch"
            >
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {role.role_name}
                    </h1>
                    <h1 className="text-base font-medium text-[#A3A3A3]">
                        {role.description}
                    </h1>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <input
                        type="checkbox"
                        id="checkbox"
                        checked={
                            checked === undefined ? !!role.status : checked
                        }
                        onChange={(e) => {
                            handleCheckboxChange(e.target.checked);
                        }}
                        //onClick={() => {updateStatus();}}
                        className="h-4 w-4  bg-gray-100 border-gray-300 rounded-lg accent-[#EA580C]"
                    />
                    <h1 className="text-base font-medium text-[#171717]">
                        Hoạt động
                    </h1>
                </div>
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <h1 className="text-base font-semibold text-[#171717]">
                        Phân quyền chức năng
                    </h1>
                    <div className="grid grid-cols-4 gap-2">
                        {role?.role_function?.map((func, index) => (
                            <div
                                key={index}
                                className="flex px-3 py-1 justify-center items-center gap-2.5 border bg-[#fafafa] rounded-full"
                            >
                                <h1 className="text-sm font-medium text-[#171717]">
                                    {func}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
                {/* {show list account} */}
                {role?.list_member?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full mt-4">
                        <h1 className="text-base font-medium text-red-600">
                            Không có nhân viên nào giữ chức vụ này!
                        </h1>
                        <h1
                            onClick={() => {
                                handleNavigation("/account/create");
                            }}
                            className="cursor-pointer text-blue-600 text-sm font-medium underline"
                        >
                            Thêm nhân viên ngay
                        </h1>
                    </div>
                ) : (
                    <div className="flex flex-col items-start gap-4 self-stretch">
                        <div
                            name="title"
                            className="flex justify-between items-center self-stretch"
                        >
                            <h1 className="text-base font-semibold text-gray-900">
                                Danh sách nhân viên
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="flex pt-2 pb-2 pl-3 pr-3 items-center self-stretch border rounded-lg border-[#E5E5E5]">
                                    <img
                                        src="/icons/search.svg"
                                        alt="icon-search"
                                        className={`w-5 h-5 cursor-pointer`}
                                        onClick={() => {}}
                                    />
                                    <div className="flex items-center gap-[2px] ml-2 flex-1">
                                        <input
                                            type="text"
                                            // value={}
                                            //onChange={() => {}}
                                            placeholder="Tìm kiếm tài khoản"
                                        />
                                    </div>
                                </div>
                                <img
                                    src="/icons/line.svg"
                                    alt="icon-statistics"
                                />
                                <div
                                    className="flex p-[10px] justify-center items-center gap-2 border rounded-lg border-[#E5E5E5] cursor-pointer"
                                    onClick={() => {}}
                                >
                                    <img
                                        src="/icons/sliders.svg"
                                        alt="icon-sliders"
                                        className="flex flex-col items-center w-5 h-5 "
                                    />
                                </div>
                            </div>
                        </div>
                        {/* { list account here} */}
                        <div
                            name="list-account"
                            className="flex flex-col items-start gap-3 self-stretch"
                        >
                            {/* {account item here} */}
                            {role?.list_member?.map((mem) => (
                                <div
                                    key={mem.account_id}
                                    className="flex flex-col items-start gap-3 self-stretch"
                                >
                                    <div
                                        name="user-item"
                                        className="flex justify-between items-center self-stretch"
                                    >
                                        <div
                                            name="account-info"
                                            className="flex items-center gap-2"
                                        >
                                            <img
                                                src={`http://127.0.0.1:8000/uploads/${mem.image_name}`}
                                                alt="avatar-img"
                                                className="rounded-full w-10 h-10"
                                            />
                                            <div className="flex flex-col items-start gap-1">
                                                <h1 className="text-sm font-medium text-[#A3A3A3]">
                                                    {mem.account_id}
                                                </h1>
                                                <h1 className="text-base font-semibold text-gray-900">
                                                    {mem.full_name}
                                                </h1>
                                            </div>
                                        </div>
                                        {mem.status ? (
                                            <div className="flex justify-center items-center gap-2.5 border border-[#16A34A] bg-[#F0FDF4]  rounded-[4px] px-3 py-1">
                                                <h1 className="font-medium text-sm text-[#16A34A]">
                                                    Đang hoạt động
                                                </h1>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center gap-2.5 border border-[#DC2626] bg-[#FEF2F2] rounded-[4px] px-3 py-1">
                                                <h1 className="font-medium text-sm text-[#DC2626]">
                                                    Ngưng hoạt động
                                                </h1>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full h-px bg-gray-300"></div>
                                </div>
                            ))}
                        </div>

                        {/* {padnigation here} */}
                    </div>
                )}
            </div>
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-10 items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                    <h1 className="text-sm font-medium text-white">Đang cập nhật</h1>
                </div>
            )}
        </div>
    );
}
