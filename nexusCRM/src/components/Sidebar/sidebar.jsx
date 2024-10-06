import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
    const [open, setOpen] = useState(true);
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const [selectedTap, setTapSelected] = useState(0);
    const localUser = JSON.parse(localStorage.getItem("USER"));

    const setTapManageSelected = () => {
        setOpenSubMenu(!openSubMenu);
        setTapSelected(1);
    };

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const [selectedSubMenuTap, setselectedSubMenuTap] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const menus = [
        {
            title: "TỔNG QUAN",
            subject: true,
            icon: "/icons/statistics_icon.svg",
        },
        {
            title: "Thống kê",
            subject: false,
            icon: "/icons/system_manage_icon.svg",
        },
        {
            title: "Quản lí hệ thống",
            subject: false,
            subMenu: true,
            icon: "/icons/system_manage_icon.svg",
            subMenuItems: [
                { title: "Tài khoản" },
                { title: "Chức vụ" },
                { title: "Khách hàng" },
            ],
        },
        { title: "Bán hàng", subject: false, icon: "/icons/selling.svg" },
        {
            title: "Chương trình",
            subject: false,
            icon: "/icons/sales_program.svg",
        },
        { title: "CÀI ĐẶT", subject: true },
        {
            title: "Cài đặt hệ thống",
            subject: false,
            icon: "/icons/setting.svg",
        },
        { title: "Trợ giúp", subject: false, icon: "/icons/help.svg" },
    ];
    return (
        <div className="flex h-screen ">
            <nav
                className={`p-3 flex flex-col items-start flex-shrink-0 self-stretch bg-gray-50  transition-all ${
                    open ? "w-72" : "w-20"
                } duration-300 relative`}
            >
                <div
                    className={
                        "pt-3 pb-3 pl-3 pr-3 flex justify-between items-center self-stretch"
                    }
                >
                    <div className="flex items-center gap-2 ">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/93173637173314e133d11df1576e4c797610fa28468e8820ecfbf2dd083cebd2?placeholderIfAbsent=true&apiKey=6129f3f077614e979263c9b69c421594"
                            alt=""
                            className={`object-contain aspect-square w-8`}
                        />
                        <h1
                            className={`text-base font-bold duration-300 ${
                                !open && "scale-0"
                            }`}
                        >
                            Nexus
                        </h1>
                    </div>
                    <div
                        className={`flex justify-center items-center w-8 h-8 gap-5 p-2 rounded-lg border-[#E5E5E5] border bg-white duration-300 ${
                            !open && "scale-0"
                        } cursor-pointer `}
                        onClick={() => setOpen((open) => !open)}
                    >
                        <div className="flex flex-col justify-center ">
                            <img
                                src="/icons/scrollToSmall.svg"
                                alt="icon-scroll-to-small"
                                className="w-4 h-4 object-contain"
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={`${!open ? "flex" : "hidden"} ${
                        !open && "w-[52px] h-[52px]"
                    } ml-[1px]  items-center justify-center gap-2 duration-300 ${
                        open && "scale-0"
                    }`}
                >
                    <button
                        className={`flex justify-center items-center gap-5 p-2 rounded-lg border-[#E5E5E5] border bg-white`}
                        onClick={() => setOpen((open) => !open)}
                    >
                        <img
                            src="/icons/scrollToSmall.svg"
                            alt="icon-scroll-to-small"
                            className="flex flex-col justify-center w-4 h-4 rotate-180"
                        />
                    </button>
                </div>
                <div
                    className={`${
                        open ? "flex" : "hidden"
                    }  pt-3 pb-3 pl-4 pr-4 items-center self-stretch duration-300`}
                >
                    <h1
                        className={`text-sm font-medium text-gray-400 duration-500 `}
                    >
                        TỔNG QUAN
                    </h1>
                </div>
                <div
                    key={0}
                    className={`flex p-4 gap-2 items-center ${
                        !open && "mt-2"
                    } self-stretch ${
                        !open && "w-[52px] h-[52px]"
                    } cursor-pointer hover:bg-white ${
                        selectedTap == 0 && "bg-white"
                    }`}
                    onClick={() => {
                        setTapSelected(0);
                        handleNavigation("/");
                    }}
                >
                    <img
                        src="/icons/statistics_icon.svg"
                        alt="icon-statistics"
                        className="flex flex-col justify-center w-5 h-5 "
                    />
                    {open && (
                        <h1
                            className={`text-sm font-medium text-gray-900 duration-300 ${
                                !open && "scale-0"
                            } `}
                        >
                            Thống kê
                        </h1>
                    )}
                </div>
                {localUser.role[0].role_level <= 3 && (
                    <div
                        key={1}
                        className={`flex p-4 items-center justify-between ${
                            !open && "w-[52px] h-[52px]"
                        } self-stretch cursor-pointer hover:bg-white ${
                            selectedTap == 1 && "bg-white"
                        }`}
                        onClick={setTapManageSelected}
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src="/icons/system_manage_icon.svg"
                                alt="icon-statistics"
                                className="flex flex-col justify-center w-5 h-5"
                            />
                            <h1
                                className={`text-sm font-medium text-gray-900 duration-300 ${
                                    !open && "scale-0"
                                } `}
                            >
                                Quản lí hệ thống
                            </h1>
                        </div>
                        <button
                            className="flex flex-col justify-center items-center gap-[10px]"
                            onClick={() => setOpenSubMenu(!openSubMenu)}
                        >
                            <img
                                src="/icons/statis_more_icon.svg"
                                alt="icon-statistics"
                                className={`flex flex-col justify-center w-4 h-4 ${
                                    !open && "scale-0"
                                } ${openSubMenu && "rotate-90"}`}
                            />
                        </button>
                    </div>
                )}
                {localUser.role[0].role_level <= 3 && openSubMenu && open && (
                    <div className="flex flex-col items-start animate-fade-in">
                        <div
                            key={0}
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSubMenuTap(0);
                                handleNavigation("/account");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm text-gray-400 hover:text-gray-900 ${
                                    selectedSubMenuTap == 0 && "text-gray-900"
                                }`}
                            >
                                Tài khoản
                            </h1>
                        </div>
                        <div
                            key={1}
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSubMenuTap(1);
                                handleNavigation("/role");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm text-gray-400 hover:text-gray-900 ${
                                    selectedSubMenuTap == 1 && "text-gray-900"
                                }`}
                            >
                                Chức vụ
                            </h1>
                        </div>
                        <div
                            key={2}
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSubMenuTap(2);
                                handleNavigation("/customer");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm text-gray-400 hover:text-gray-900 ${
                                    selectedSubMenuTap == 2 && "text-gray-900"
                                }`}
                            >
                                Khách hàng
                            </h1>
                        </div>
                    </div>
                )}
                <div
                    key={2}
                    className={`flex p-4 gap-2 items-center ${
                        !open && "w-[52px] h-[52px]"
                    }  self-stretch cursor-pointer hover:bg-white ${
                        selectedTap == 2 && "bg-white"
                    }`}
                    onClick={() => {
                        setTapSelected(2);
                        handleNavigation("/selling");
                    }}
                >
                    <img
                        src="/icons/selling.svg"
                        alt="icon-statistics"
                        className="flex flex-col justify-center w-5 h-5 "
                    />
                    <h1
                        className={`text-sm font-medium text-gray-900 duration-300 ${
                            !open && "scale-0"
                        } `}
                    >
                        Bán hàng
                    </h1>
                </div>
                <div
                    key={3}
                    className={`flex p-4 gap-2 items-center self-stretch ${
                        !open && "w-[52px] h-[52px]"
                    }  cursor-pointer hover:bg-white ${
                        selectedTap == 3 && "bg-white"
                    }`}
                    onClick={() => {
                        setTapSelected(3);
                        handleNavigation("/sell-program");
                    }}
                >
                    <img
                        src="/icons/sales_program.svg"
                        alt="icon-statistics"
                        className="flex flex-col justify-center w-5 h-5 "
                    />
                    <h1
                        className={`text-sm font-medium text-gray-900 duration-300 ${
                            !open && "scale-0"
                        } `}
                    >
                        Chương trình
                    </h1>
                </div>
                <div
                    className={`${open ? "flex" : "hidden"} pt-3 pb-3 pl-4 ${
                        !open && "w-[52px] h-[52px]"
                    }  pr-4 items-center self-stretch duration-300`}
                >
                    <h1
                        className={`text-sm font-medium text-gray-400 duration-500 `}
                    >
                        CÀI ĐẶT
                    </h1>
                </div>
                <div
                    key={4}
                    className={`flex p-4 gap-2 items-center self-stretch ${
                        !open && "w-[52px] h-[52px]"
                    }  cursor-pointer hover:bg-white ${
                        selectedTap == 4 && "bg-white"
                    }`}
                    onClick={() => {
                        setTapSelected(4);
                        handleNavigation("/setting");
                    }}
                >
                    <img
                        src="/icons/setting.svg"
                        alt="icon-statistics"
                        className="flex flex-col justify-center w-5 h-5 "
                    />
                    <h1
                        className={`text-sm font-medium text-gray-900 duration-300 ${
                            !open && "scale-0"
                        } `}
                    >
                        Cài đặt hệ thống
                    </h1>
                </div>
                <div
                    key={5}
                    className={`flex p-4 gap-2 items-center self-stretch ${
                        !open && "w-[52px] h-[52px]"
                    }  cursor-pointer hover:bg-white ${
                        selectedTap == 5 && "bg-white"
                    }`}
                    onClick={() => {
                        setTapSelected(5);
                        handleNavigation("/help");
                    }}
                >
                    <img
                        src="/icons/help.svg"
                        alt="icon-statistics"
                        className="flex flex-col justify-center w-5 h-5 "
                    />
                    <h1
                        className={`text-sm font-medium text-gray-900 duration-300 ${
                            !open && "scale-0"
                        } `}
                    >
                        Trợ giúp
                    </h1>
                </div>
            </nav>
        </div>
    );
}
