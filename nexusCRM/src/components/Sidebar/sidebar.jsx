import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function SideBar() {
    //get location
    const location = useLocation();
    //set open sidebar
    const [open, setOpen] = useState(true);
    //system manage
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const [selectedSubMenuTap, setselectedSubMenuTap] = useState(0);
    //tap selected
    const [selectedTap, setTapSelected] = useState(0);
    //selling tap selected
    const [openSellSubMenu, setOpenSellSubMenu] = useState(false);
    const [selectedSellSubMenuTap, setselectedSellSubMenuTap] = useState(0);
    //get local user or session user
    const localUser = JSON.parse(
        localStorage.getItem("USER") || sessionStorage.getItem("USER")
    );
    //get id user
    const { id } = useParams();
    //get current route
    useEffect(() => {
        if (
            location.pathname === "/account" ||
            (location.pathname.startsWith("/account/") && id) ||
            location.pathname === "/account/create"
        ) {
            setTapSelected(1);
            setselectedSubMenuTap(0);
        }
        if (location.pathname === "/") {
            setTapSelected(0);
        }
        if (location.pathname === "/role") {
            setTapSelected(1);
            setselectedSubMenuTap(1);
        }
        if (
            location.pathname === "/customer" ||
            (location.pathname.startsWith("/customer/") && id) ||
            location.pathname === "/customer/create"
        ) {
            setTapSelected(1);
            setselectedSubMenuTap(2);
        }
        if (location.pathname === "/products") {
            setTapSelected(2);
            setselectedSellSubMenuTap(0);
        }
        if (location.pathname === "/warehouses") {
            setTapSelected(2);
            setselectedSellSubMenuTap(1);
        }
        if (location.pathname === "/orders") {
            setTapSelected(2);
            setselectedSellSubMenuTap(2);
        }
        if (location.pathname === "/sell-program") {
            setTapSelected(3);
        }
        if (location.pathname === "/setting") {
            setTapSelected(4);
        }
        if (location.pathname === "/help") {
            setTapSelected(5);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //set Tap Manage Selected
    const setTapManageSelected = () => {
        setOpenSubMenu(!openSubMenu);
        setTapSelected(1);
        setOpenSellSubMenu(false);
        setselectedSubMenuTap(0);
        handleNavigation("/account");
    };
    //set Tap Manage Selected
    const setTapSellingSelected = () => {
        setOpenSellSubMenu(!openSellSubMenu);
        setTapSelected(2);
        setOpenSubMenu(false);
        setselectedSellSubMenuTap(0);
        handleNavigation("/products");
    };
    //navigator
    const navigate = useNavigate();
    //handle navigate
    const handleNavigation = (path) => {
        navigate(path);
    };

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
        <div className="flex h-screen">
            <nav
                className={`p-3 flex flex-col items-start flex-shrink-0 self-stretch bg-background-neutral-subtle dark:bg-gray-900 overflow-y-hidden overflow-x-hidden transition-all ${
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
                            className={`text-base font-bold text-text-primary dark:text-text-white duration-300 ${
                                !open && "scale-0"
                            }`}
                        >
                            Nexus
                        </h1>
                    </div>
                    <div
                        className={`flex justify-center items-center w-8 h-8 gap-5 p-2 rounded-lg border-border-neutral-subtle border bg-background-surface_default duration-300 ${
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
                        className={`flex justify-center items-center gap-5 p-2 rounded-lg border-border-neutral-subtle border bg-background-surface_default`}
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
                        className={`text-sm font-medium text-text-secondary duration-500 `}
                    >
                        TỔNG QUAN
                    </h1>
                </div>
                <div
                    key={0}
                    className={`flex p-4 gap-2 items-center rounded-lg self-stretch ${
                        !open ? "w-[52px] h-[52px] mt-2" : "mt-1"
                    } cursor-pointer  ${
                        selectedTap == 0
                            ? "bg-background-surface_default"
                            : "text-text-primary dark:text-text-white hover:bg-background-surface_default dark:hover:text-text-primary"
                    }`}
                    onClick={() => {
                        setTapSelected(0);
                        handleNavigation("/");
                    }}
                >
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 18 19"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9.625 0.75C10.6406 0.75 11.5 1.60938 11.5 2.625V16.375C11.5 17.4297 10.6406 18.25 9.625 18.25H8.375C7.32031 18.25 6.5 17.4297 6.5 16.375V2.625C6.5 1.60938 7.32031 0.75 8.375 0.75H9.625ZM9.625 2.625H8.375V16.375H9.625V2.625ZM3.375 8.25C4.39062 8.25 5.25 9.10938 5.25 10.125V16.375C5.25 17.4297 4.39062 18.25 3.375 18.25H2.125C1.07031 18.25 0.25 17.4297 0.25 16.375V10.125C0.25 9.10938 1.07031 8.25 2.125 8.25H3.375ZM3.375 10.125H2.125V16.375H3.375V10.125ZM12.75 5.125C12.75 4.10938 13.5703 3.25 14.625 3.25H15.875C16.8906 3.25 17.75 4.10938 17.75 5.125V16.375C17.75 17.4297 16.8906 18.25 15.875 18.25H14.625C13.5703 18.25 12.75 17.4297 12.75 16.375V5.125ZM14.625 16.375H15.875V5.125H14.625V16.375Z"
                            fill="currentColor"
                        />
                    </svg>
                    {open && (
                        <h1
                            className={`text-sm font-medium duration-300 ${
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
                        className={`flex p-4 items-center justify-between rounded-lg ${
                            !open ? "w-[52px] h-[52px] mt-2" : "mt-1"
                        } self-stretch cursor-pointer ${
                            selectedTap == 1
                                ? "bg-background-surface_default"
                                : "text-text-primary dark:text-text-white hover:bg-background-surface_default dark:hover:text-text-primary"
                        }`}
                        onClick={setTapManageSelected}
                    >
                        <div className="flex items-center gap-2">
                            <svg
                                viewBox="0 0 24 20"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                            >
                                <path d="M23.0938 11.0859L19.3438 18.5859C19.1484 19.0156 18.7188 19.25 18.2109 19.25H3.25C1.84375 19.25 0.75 18.1562 0.75 16.75V4.25C0.75 2.88281 1.84375 1.75 3.25 1.75H7.82031C8.48438 1.75 9.10938 2.02344 9.57812 2.49219L11.4922 4.25H17C18.3672 4.25 19.5 5.38281 19.5 6.75V8H17.625V6.75C17.625 6.4375 17.3125 6.125 17 6.125H10.75L8.25 3.82031C8.13281 3.70312 7.97656 3.625 7.82031 3.625H3.25C2.89844 3.625 2.625 3.9375 2.625 4.25V15.5L5.39844 9.95312C5.59375 9.52344 6.02344 9.25 6.49219 9.25H22C22.8984 9.25 23.5234 10.2266 23.0938 11.0859Z" />
                            </svg>
                            {open && (
                                <h1
                                    className={`text-sm font-medium duration-300 opacity-100`}
                                >
                                    Quản lí hệ thống
                                </h1>
                            )}
                        </div>
                        <button
                            className="flex flex-col justify-center items-center gap-[10px]"
                            onClick={() => setOpenSubMenu(!openSubMenu)}
                        >
                            <svg
                                viewBox="0 0 9 15"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 ${!open && "scale-0"} ${
                                    openSellSubMenu && "rotate-90"
                                }`}
                            >
                                <path d="M2.47656 0.9375L8.0625 6.875C8.21875 7.07031 8.33594 7.30469 8.33594 7.5C8.33594 7.73438 8.21875 7.96875 8.0625 8.16406L2.47656 14.1016C2.125 14.4922 1.53906 14.4922 1.14844 14.1406C0.757812 13.7891 0.757812 13.2031 1.10938 12.8125L6.10938 7.5L1.10938 2.22656C0.757812 1.83594 0.757812 1.25 1.14844 0.898438C1.53906 0.546875 2.125 0.546875 2.47656 0.9375Z" />
                            </svg>
                        </button>
                    </div>
                )}
                {localUser.role[0].role_level <= 3 && openSubMenu && open && (
                    <div className="flex flex-col items-start animate-fade-in">
                        <div
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSubMenuTap(0);
                                setTapSelected(1);
                                handleNavigation("/account");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm  ${
                                    selectedSubMenuTap == 0
                                        ? "text-text-primary dark:text-text-white"
                                        : "text-text-secondary hover:text-text-primary dark:hover:text-text-white"
                                }`}
                            >
                                Tài khoản
                            </h1>
                        </div>
                        <div
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSubMenuTap(1);
                                setTapSelected(1);
                                handleNavigation("/role");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm ${
                                    selectedSubMenuTap == 1
                                        ? "text-text-primary dark:text-text-white"
                                        : "text-text-secondary hover:text-text-primary dark:hover:text-text-white"
                                }`}
                            >
                                Chức vụ
                            </h1>
                        </div>
                        <div
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSubMenuTap(2);
                                setTapSelected(1);
                                handleNavigation("/customer");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm ${
                                    selectedSubMenuTap == 2
                                        ? "text-text-primary dark:text-text-white"
                                        : "text-text-secondary hover:text-text-primary dark:hover:text-text-white"
                                }`}
                            >
                                Khách hàng
                            </h1>
                        </div>
                    </div>
                )}
                <div
                    key={2}
                    className={`flex p-4 items-center justify-between rounded-lg ${
                        !open ? "w-[52px] h-[52px] mt-2" : "mt-1"
                    } self-stretch cursor-pointer ${
                        selectedTap == 2
                            ? "bg-background-surface_default"
                            : "text-text-primary dark:text-text-white hover:bg-background-surface_default dark:hover:text-text-primary"
                    }`}
                    onClick={setTapSellingSelected}
                >
                    <div className="flex items-center gap-2">
                        <svg
                            viewBox="0 0 18 21"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                        >
                            <path d="M4.625 4.875C4.625 2.49219 6.57812 0.5 9 0.5C11.3828 0.5 13.375 2.49219 13.375 4.875V6.75H15.875C16.8906 6.75 17.75 7.60938 17.75 8.625V16.75C17.75 18.8203 16.0703 20.5 14 20.5H4C1.89062 20.5 0.25 18.8203 0.25 16.75V8.625C0.25 7.60938 1.07031 6.75 2.125 6.75H4.625V4.875ZM6.5 6.75H11.5V4.875C11.5 3.50781 10.3672 2.375 9 2.375C7.59375 2.375 6.5 3.50781 6.5 4.875V6.75ZM5.5625 10.5C6.07031 10.5 6.5 10.1094 6.5 9.5625C6.5 9.05469 6.07031 8.625 5.5625 8.625C5.01562 8.625 4.625 9.05469 4.625 9.5625C4.625 10.1094 5.01562 10.5 5.5625 10.5ZM12.4375 8.625C11.8906 8.625 11.5 9.05469 11.5 9.5625C11.5 10.1094 11.8906 10.5 12.4375 10.5C12.9453 10.5 13.375 10.1094 13.375 9.5625C13.375 9.05469 12.9453 8.625 12.4375 8.625Z" />
                        </svg>
                        {open && (
                            <h1
                                className={`text-sm font-medium duration-300 opacity-100`}
                            >
                                Bán hàng
                            </h1>
                        )}
                    </div>
                    <button
                        className="flex flex-col justify-center items-center gap-[10px]"
                        onClick={() => setOpenSellSubMenu(!openSellSubMenu)}
                    >
                        <svg
                            viewBox="0 0 9 15"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-4 h-4 ${!open && "scale-0"} ${
                                openSellSubMenu && "rotate-90"
                            }`}
                        >
                            <path d="M2.47656 0.9375L8.0625 6.875C8.21875 7.07031 8.33594 7.30469 8.33594 7.5C8.33594 7.73438 8.21875 7.96875 8.0625 8.16406L2.47656 14.1016C2.125 14.4922 1.53906 14.4922 1.14844 14.1406C0.757812 13.7891 0.757812 13.2031 1.10938 12.8125L6.10938 7.5L1.10938 2.22656C0.757812 1.83594 0.757812 1.25 1.14844 0.898438C1.53906 0.546875 2.125 0.546875 2.47656 0.9375Z" />
                        </svg>
                    </button>
                </div>
                {openSellSubMenu && open && (
                    <div className="flex flex-col items-start animate-fade-in">
                        <div
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSellSubMenuTap(0);
                                setTapSelected(2);
                                handleNavigation("/products");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm  ${
                                    selectedSellSubMenuTap == 0
                                        ? "text-text-primary dark:text-text-white"
                                        : "text-text-secondary hover:text-text-primary dark:hover:text-text-white"
                                }`}
                            >
                                Sản phẩm
                            </h1>
                        </div>
                        <div
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSellSubMenuTap(1);
                                setTapSelected(2);
                                handleNavigation("/warehouses");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm ${
                                    selectedSellSubMenuTap == 1
                                        ? "text-text-primary dark:text-text-white"
                                        : "text-text-secondary hover:text-text-primary dark:hover:text-text-white"
                                }`}
                            >
                                Kho
                            </h1>
                        </div>
                        <div
                            className="flex p-4 items-center gap-2 self-stretch cursor-pointer"
                            onClick={() => {
                                setselectedSellSubMenuTap(2);
                                setTapSelected(2);
                                handleNavigation("/orders");
                            }}
                        >
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <h1
                                className={`font-medium text-sm ${
                                    selectedSellSubMenuTap == 2
                                        ? "text-text-primary dark:text-text-white"
                                        : "text-text-secondary hover:text-text-primary dark:hover:text-text-white"
                                }`}
                            >
                                Đơn hàng
                            </h1>
                        </div>
                    </div>
                )}

                <div
                    key={3}
                    className={`flex p-4 gap-2 items-center rounded-lg self-stretch ${
                        !open ? "w-[52px] h-[52px] mt-2" : "mt-1"
                    } cursor-pointer  ${
                        selectedTap == 3
                            ? "bg-background-surface_default"
                            : "text-text-primary dark:text-text-white hover:bg-background-surface_default dark:hover:text-text-primary"
                    }`}
                    onClick={() => {
                        setTapSelected(3);
                        handleNavigation("/sell-program");
                    }}
                >
                    <svg
                        viewBox="0 0 20 21"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                    >
                        <path d="M6.25 8C6.25 7.33594 6.79688 6.75 7.5 6.75C8.16406 6.75 8.75 7.33594 8.75 8C8.75 8.70312 8.16406 9.25 7.5 9.25C6.79688 9.25 6.25 8.70312 6.25 8ZM13.75 13C13.75 13.7031 13.1641 14.25 12.5 14.25C11.7969 14.25 11.25 13.7031 11.25 13C11.25 12.3359 11.7969 11.75 12.5 11.75C13.1641 11.75 13.75 12.3359 13.75 13ZM8.125 13.6641C7.77344 14.0547 7.1875 14.0547 6.83594 13.6641C6.44531 13.3125 6.44531 12.7266 6.83594 12.3359L11.8359 7.33594C12.1875 6.98438 12.7734 6.98438 13.125 7.33594C13.5156 7.72656 13.5156 8.3125 13.125 8.66406L8.125 13.6641ZM13.4375 2.21875C14.7266 2.0625 16.0547 2.45312 17.0703 3.42969C18.0469 4.44531 18.4375 5.77344 18.2812 7.0625C19.2969 7.88281 20 9.13281 20 10.5C20 11.9062 19.2969 13.1562 18.2812 13.9766C18.4375 15.2266 18.0469 16.5938 17.0703 17.5703C16.0547 18.5859 14.7266 18.9766 13.4375 18.8203C12.6172 19.8359 11.3672 20.5 10 20.5C8.59375 20.5 7.34375 19.8359 6.52344 18.8203C5.23438 18.9766 3.90625 18.5859 2.89062 17.5703C1.91406 16.5938 1.52344 15.2266 1.67969 13.9766C0.664062 13.1562 0 11.9062 0 10.5C0 9.13281 0.664062 7.88281 1.67969 7.0625C1.52344 5.77344 1.91406 4.44531 2.89062 3.42969C3.90625 2.45312 5.23438 2.0625 6.52344 2.21875C7.34375 1.20312 8.59375 0.5 10 0.5C11.3672 0.5 12.6172 1.20312 13.4375 2.21875ZM7.42188 4.40625L6.71875 4.17188C5.85938 3.89844 4.88281 4.09375 4.21875 4.75781C3.55469 5.42188 3.35938 6.39844 3.63281 7.21875L3.86719 7.96094L3.16406 8.35156C2.38281 8.74219 1.875 9.5625 1.875 10.5C1.875 11.4766 2.38281 12.2969 3.16406 12.6875L3.86719 13.0391L3.63281 13.7812C3.35938 14.6406 3.55469 15.5781 4.21875 16.2812C4.88281 16.9453 5.85938 17.1406 6.71875 16.8672L7.42188 16.6328L7.8125 17.3359C8.20312 18.1172 9.02344 18.625 10 18.625C10.9375 18.625 11.7578 18.1172 12.1484 17.3359L12.5391 16.6328L13.2422 16.8672C14.1016 17.1406 15.0781 16.9453 15.7422 16.2812C16.4062 15.5781 16.6016 14.6406 16.3281 13.7812L16.0938 13.0391L16.7969 12.6875C17.5781 12.2969 18.125 11.4766 18.125 10.5C18.125 9.5625 17.5781 8.74219 16.7969 8.35156L16.0938 7.96094L16.3281 7.21875C16.6016 6.39844 16.4062 5.42188 15.7422 4.75781C15.0781 4.09375 14.1016 3.89844 13.2422 4.17188L12.5391 4.40625L12.1484 3.70312C11.7578 2.92188 10.9375 2.375 10 2.375C9.02344 2.375 8.20312 2.92188 7.8125 3.70312L7.42188 4.40625Z" />
                    </svg>
                    {open && (
                        <h1 className="text-sm font-medium duration-300 opacity-100">
                            Chương trình
                        </h1>
                    )}
                </div>
                <div
                    className={`${open ? "flex" : "hidden"} pt-3 pb-3 pl-4 ${
                        !open && "w-[52px] h-[52px]"
                    }  pr-4 items-center self-stretch duration-300`}
                >
                    <h1
                        className={`text-sm font-medium text-text-secondary duration-500 `}
                    >
                        CÀI ĐẶT
                    </h1>
                </div>
                <div
                    key={4}
                    className={`flex p-4 gap-2 items-center self-stretch rounded-lg ${
                        !open ? "w-[52px] h-[52px] mt-2" : "mt-1"
                    }  cursor-pointer hover:bg-background-surface_default ${
                        selectedTap == 4
                            ? "bg-background-surface_default"
                            : "text-text-primary dark:text-text-white hover:bg-background-surface_default dark:hover:text-text-primary"
                    }`}
                    onClick={() => {
                        setTapSelected(4);
                        handleNavigation("/setting");
                    }}
                >
                    <svg
                        viewBox="0 0 20 21"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                    >
                        <path d="M6.25 10.5C6.25 8.42969 7.89062 6.75 10 6.75C12.0703 6.75 13.75 8.42969 13.75 10.5C13.75 12.5703 12.0703 14.25 10 14.25C7.89062 14.25 6.25 12.5703 6.25 10.5ZM10 8.625C8.94531 8.625 8.125 9.48438 8.125 10.5C8.125 11.5547 8.94531 12.375 10 12.375C11.0156 12.375 11.875 11.5547 11.875 10.5C11.875 9.48438 11.0156 8.625 10 8.625ZM11.4453 0.5C12.3047 0.5 13.0469 1.125 13.2422 1.94531L13.5547 3.23438C13.9062 3.39062 14.2188 3.58594 14.4922 3.78125L15.7812 3.39062C16.6016 3.15625 17.5 3.50781 17.9297 4.25L19.375 6.78906C19.8047 7.53125 19.6484 8.46875 19.0234 9.05469L18.0859 9.95312C18.0859 10.1484 18.125 10.3438 18.125 10.5C18.125 10.6953 18.0859 10.8906 18.0859 11.0469L19.0234 11.9844C19.6484 12.5703 19.8047 13.5078 19.375 14.25L17.9297 16.7891C17.5 17.5312 16.6016 17.8828 15.7812 17.6484L14.4922 17.2578C14.2188 17.4531 13.9062 17.6484 13.5547 17.8047L13.2422 19.0938C13.0469 19.9141 12.3047 20.5 11.4453 20.5H8.51562C7.65625 20.5 6.91406 19.9141 6.71875 19.0938L6.40625 17.8047C6.05469 17.6484 5.74219 17.4531 5.46875 17.2578L4.17969 17.6484C3.35938 17.8828 2.46094 17.5312 2.03125 16.7891L0.585938 14.25C0.15625 13.5078 0.3125 12.5703 0.9375 11.9844L1.875 11.0469C1.875 10.8906 1.875 10.6953 1.875 10.5C1.875 10.3438 1.875 10.1484 1.875 9.95312L0.9375 9.05469C0.3125 8.46875 0.15625 7.53125 0.585938 6.78906L2.03125 4.25C2.46094 3.50781 3.35938 3.15625 4.17969 3.39062L5.46875 3.78125C5.74219 3.58594 6.05469 3.39062 6.40625 3.23438L6.71875 1.94531C6.91406 1.125 7.65625 0.5 8.51562 0.5H11.4453ZM8.00781 4.5625L7.57812 4.75781C7.07031 4.95312 6.60156 5.22656 6.21094 5.53906L5.82031 5.85156L3.67188 5.1875L2.22656 7.72656L3.82812 9.25L3.78906 9.71875C3.75 9.99219 3.75 10.2656 3.75 10.5C3.75 10.7734 3.75 11.0469 3.78906 11.3203L3.82812 11.7891L2.22656 13.3125L3.67188 15.8516L5.82031 15.1875L6.21094 15.5C6.60156 15.8125 7.07031 16.0859 7.57812 16.2812L8.00781 16.4766L8.51562 18.625H11.4453L11.9531 16.4766L12.3828 16.2812C12.8906 16.0859 13.3594 15.8125 13.75 15.5L14.1406 15.1875L16.2891 15.8516L17.7344 13.3125L16.1328 11.7891L16.1719 11.3203C16.2109 11.0469 16.25 10.7734 16.25 10.5C16.25 10.2656 16.2109 9.99219 16.1719 9.71875L16.1328 9.25L17.7344 7.72656L16.2891 5.1875L14.1406 5.85156L13.75 5.53906C13.3594 5.22656 12.8906 4.95312 12.3828 4.75781L11.9531 4.5625L11.4453 2.375H8.51562L8.00781 4.5625Z" />
                    </svg>
                    {open && (
                        <h1
                            className={`text-sm font-medium duration-300 opacity-100`}
                        >
                            Cài đặt hệ thống
                        </h1>
                    )}
                </div>
                <div
                    key={5}
                    className={`flex p-4 gap-2 items-center self-stretch rounded-lg ${
                        !open ? "w-[52px] h-[52px] mt-2" : "mt-1"
                    }  cursor-pointer  ${
                        selectedTap == 5
                            ? "bg-background-surface_default"
                            : "text-text-primary dark:text-text-white hover:bg-background-surface_default dark:hover:text-text-primary"
                    }`}
                    onClick={() => {
                        setTapSelected(5);
                        handleNavigation("/help");
                    }}
                >
                    <svg
                        viewBox="0 0 20 21"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                    >
                        <path d="M13.5156 14.25C16.4062 14.25 18.75 16.5938 18.75 19.4844C18.75 20.0703 18.2812 20.5 17.6953 20.5H2.26562C1.67969 20.5 1.25 20.0703 1.25 19.4844C1.25 16.5938 3.55469 14.25 6.44531 14.25H13.5156ZM3.20312 18.625H16.7578C16.3672 17.2188 15.0781 16.125 13.5156 16.125H6.44531C4.88281 16.125 3.59375 17.2188 3.20312 18.625ZM10 4.875C8.24219 4.875 6.875 6.28125 6.875 8C6.875 8.78125 7.14844 9.44531 7.57812 9.99219C7.14844 10.4609 6.875 11.0859 6.875 11.75C6.875 11.8281 6.875 11.8672 6.875 11.9062C5.74219 11.0078 5 9.60156 5 8C5 5.26562 7.22656 3 10 3C12.7344 3 15 5.26562 15 8C15 8.58594 14.8828 9.13281 14.6875 9.64062C14.375 10.1484 13.7891 10.5 13.125 10.5H12.7734C12.6562 10.3438 12.5391 10.1484 12.3828 9.99219C12.8125 9.44531 13.125 8.78125 13.125 8C13.125 6.28125 11.7188 4.875 10 4.875ZM3.125 9.25C2.77344 9.25 2.5 8.97656 2.5 8.625V8C2.5 3.89844 5.85938 0.5 10 0.5C14.1016 0.5 17.5 3.89844 17.5 8V8.625C17.4609 11.0469 15.5078 13 13.125 13H9.375C8.67188 13 8.125 12.4531 8.125 11.75C8.125 11.0859 8.67188 10.5 9.375 10.5H10.625C11.2891 10.5 11.875 11.0859 11.875 11.75H13.125C14.8438 11.75 16.25 10.3828 16.25 8.625V8C16.25 4.5625 13.4375 1.75 10 1.75C6.52344 1.75 3.75 4.5625 3.75 8V8.625C3.75 8.97656 3.4375 9.25 3.125 9.25Z" />
                    </svg>
                    {open && (
                        <h1
                            className={`text-sm font-medium duration-300 opacity-100 `}
                        >
                            Trợ giúp
                        </h1>
                    )}
                </div>
            </nav>
        </div>
    );
}
