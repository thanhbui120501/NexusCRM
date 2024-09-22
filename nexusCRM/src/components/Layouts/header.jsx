import { useState } from "react";
import DropDownProfile from "./dropdown";
import { useLocation } from "react-router-dom";
// eslint-disable-next-line react/prop-types
export default function Header() {
    const [localUser] = useState(JSON.parse(localStorage.getItem("USER")));

    const [openProfile, setOpenProfile] = useState(false);

    const location = useLocation();

    // Kiểm tra route và xác định tiêu đề
    const getTitle = () => {
        switch (location.pathname) {
            case "/":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-900">
                            Thống kê
                        </h1>
                    </>
                );
            case "/account":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-400">
                            <span className="pr-3">Quản lí hệ thống</span>{" "}
                            <span>/</span>{" "}
                            <span className="font-medium text-sm text-gray-900 pl-3">
                                Tài khoản
                            </span>
                        </h1>
                    </>
                );
            // Thêm các route khác nếu cần
            case "/customer":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-400">
                            <span className="pr-3">Quản lí hệ thống</span>{" "}
                            <span>/</span>{" "}
                            <span className="font-medium text-sm text-gray-900 pl-3">
                                Khách hàng
                            </span>
                        </h1>
                    </>
                );
            case "/role":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-400">
                            <span className="pr-3">Quản lí hệ thống</span>{" "}
                            <span>/</span>{" "}
                            <span className="font-medium text-sm text-gray-900 pl-3">
                                Chức vụ
                            </span>
                        </h1>
                    </>
                );
            case "/setting":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-900">
                            Cài đặt
                        </h1>
                    </>
                );
            case "/selling":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-900">
                            Bán hàng
                        </h1>
                    </>
                );
            case "/sell-program":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-900">
                            Chương trình
                        </h1>
                    </>
                );
            case "/help":
                return (
                    <>
                        <h1 className="font-medium text-sm text-gray-900">
                            Trợ giúp
                        </h1>
                    </>
                );
            default:
                return "Trang chính";
        }
    };
    return (
        <div className="flex pl-6 pt-3 pr-3 pb-3 justify-between items-center gap-3 self-stretch h-14 border-b-2 border-gray-200">
            <div className="flex flex-col items-start w-[798px] gap-[10px]">
                {getTitle()}
            </div>
            <div className="flex">
                <div className="flex p-[10px] justify-center items-center gap-2 border border-b-[#E5E5E5] bg-[#FFFFFF] rounded-lg cursor-pointer">
                    <img
                        src="/icons/bell.svg"
                        alt="icon-statistics"
                        className="flex flex-col justify-center w-5 h-5 "
                    />
                </div>
                <img src="/icons/line.svg" alt="icon-statistics" />
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl w-10 h-10">
                            <img
                                src={`${
                                    localUser.image_name == null
                                        ? "/images/avatar.png"
                                        : "http://127.0.0.1:8000/uploads/" +
                                          localUser.image_name
                                }`}
                                alt="avatar"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col items-start w-[126px] gap-[2px]">
                            <h1 className="self-stretch text-sm font-medium text-gray-900">
                                {localUser.full_name}
                            </h1>
                            <h1 className="self-stretch text-xs font-medium text-gray-400">
                                {localUser.email}
                            </h1>
                        </div>
                    </div>
                    <img
                        src="/icons/statis_more_icon.svg"
                        alt="icon-selected"
                        className={`w-5 h-5 ${
                            openProfile ? "rotate-90" : "rotate-0"
                        } cursor-pointer`}
                        onClick={() => setOpenProfile(!openProfile)}
                    />
                </div>
            </div>
            {openProfile && <DropDownProfile />}
        </div>
    );
}
