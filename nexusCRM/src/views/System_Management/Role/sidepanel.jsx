/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import { toast, ToastContainer } from "react-toastify";
import ShowDataDropDown from "../Account/showDataDropdown";

export default function SidePanel({ isOpen, onData, role, onUpdated }) {
    //navigate
    const navigate = useNavigate();
    //role status?
    const status = role.status;
    const [checked, setChecked] = useState(status);
    //set loading
    const [loading, setLoading] = useState(false);
    //set open dropdown data
    const [openDropDownData, setOpenDropDownData] = useState(false);
    //set number row
    const [showRowNumber, setShowRowNumber] = useState(5);
    //set total
    const [totalPages, setTotalPages] = useState(0);
    //set current page
    const [currentPage, setCurrentPage] = useState(1);
    //set index
    const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
    const [indexOfLastItem, setIndexOfLastItem] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(role?.list_member);
    //show toast
    const showErrorToast = () => {
        toast.error("Chức năng này sẽ sớm có trên hệ thống!", {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    //handel search
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        const filtered = role?.list_member.filter(
            (item) =>
                item.full_name.toLowerCase().includes(term.toLowerCase()) ||
                item.account_id.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        if (isOpen) {
            handleSetTotalPages();
            const lastIndex = currentPage * showRowNumber;
            const firstIndex = lastIndex - showRowNumber;
            setIndexOfLastItem(lastIndex);
            setIndexOfFirstItem(firstIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, currentPage, showRowNumber, searchTerm]);
    //set role status
    const handleCheckboxChange = (val) => {
        setChecked(val);
        updateStatus(val);
    };
    //handle selected row
    const handleSeclectRowNumber = (row) => {
        setShowRowNumber(row);
        setCurrentPage(1);
    };
    //close dropdown
    const handleCloseDropdow = () => {
        setOpenDropDownData(false);
    };
    //navidate to account create page
    const handleNavigation = (path) => {
        navigate(path);
    };
    const updateStatus = async (val) => {
        try {
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
        } finally {
            setLoading(false);
        }
    };
    //handle page change
    const handlePageChange = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };
    //handle next page
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    //handle prev page
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    //handle set total page
    const handleSetTotalPages = () => {
        const pages = Math.ceil(
            (searchTerm === ""
                ? role?.list_member?.length
                : filteredData.length) / showRowNumber
        );
        setTotalPages(pages);
    };
    const renderPagination = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        className={`flex ${
                            currentPage === i
                                ? "bg-background-neutral-default text-text-white hover:bg-background-neutral-hover"
                                : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                        } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                        type="button"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={`flex ${
                                currentPage === i
                                    ? "bg-background-neutral-default text-text-white hover:bg-background-neutral-hover"
                                    : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                            } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                            type="button"
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </button>
                    );
                }
                pages.push(
                    <div
                        key={"more_0"}
                        className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary"
                        type="text"
                    >
                        ...
                    </div>
                );
                pages.push(
                    <button
                        key={totalPages}
                        className={`flex ${
                            currentPage === totalPages
                                ? "bg-background-neutral-default text-text-white hover:bg-background-neutral-hover"
                                : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                        }
                            
                         w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                        type="button"
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            } else {
                if (currentPage > totalPages - 5) {
                    pages.push(
                        <button
                            key={1}
                            className={`flex ${
                                currentPage === 1
                                    ? "bg-background-neutral-default text-text-white"
                                    : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                            }
                                
                             w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                            type="button"
                            onClick={() => handlePageChange(1)}
                        >
                            {1}
                        </button>
                    );
                    pages.push(
                        <div
                            key={"more_1"}
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary"
                            type="text"
                        >
                            ...
                        </div>
                    );
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(
                            <button
                                key={i}
                                className={`flex ${
                                    currentPage === i
                                        ? "bg-background-neutral-default text-text-white"
                                        : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                                } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                                type="button"
                                onClick={() => handlePageChange(i)}
                            >
                                {i}
                            </button>
                        );
                    }
                } else {
                    pages.push(
                        <button
                            key={1}
                            className={`flex ${
                                currentPage === 1
                                    ? "bg-background-neutral-default text-text-white"
                                    : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                            }
                                
                             w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                            type="button"
                            onClick={() => handlePageChange(1)}
                        >
                            {1}
                        </button>
                    );
                    pages.push(
                        <div
                            key={"more_2"}
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary"
                            type="text"
                        >
                            ...
                        </div>
                    );
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(
                            <button
                                key={i}
                                className={`flex ${
                                    currentPage === i
                                        ? "bg-background-neutral-default text-text-white"
                                        : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                                } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                                type="button"
                                onClick={() => handlePageChange(i)}
                            >
                                {i}
                            </button>
                        );
                    }
                    pages.push(
                        <div
                            key={"more_3"}
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary"
                            type="text"
                        >
                            ...
                        </div>
                    );
                    pages.push(
                        <button
                            key={totalPages}
                            className={`flex ${
                                currentPage === totalPages
                                    ? "bg-background-neutral-default text-text-white"
                                    : "text-text-primary hover:text-text-white hover:bg-background-neutral-default"
                            } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default active:text-text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                            type="button"
                            onClick={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    );
                }
            }
        }
        return pages;
    };
    return (
        <div
            className={`flex flex-col items-start fixed top-0 right-0 h-screen w-[712px] bg-background-surface_default shadow-lg transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }  transition-transform duration-300 ease-in-out z-[200] overflow-y-auto overflow-x-hidden `}
        >
            <div
                name="header"
                id="header"
                className="flex px-6 py-4 justify-between items-center self-stretch"
            >
                <h1 className="text-text-primary text-base font-medium">
                    Chi tiết chức vụ
                </h1>
                <ToastContainer />
                <div
                    onClick={() => {
                        onData(false);
                    }}
                    className="flex  justify-center items-center gap-2 border rounded-lg bg-background-surface_default w-8 h-8 cursor-pointer"
                >
                    <img
                        src="/icons/xmark.svg"
                        alt="xmark_close_sidepanel"
                        className="w-4 h-4"
                    />
                </div>
            </div>
            <div className="flex h-2 py-2.5 flex-col justify-between items-start self-stretch flex-shrink-0">
                <div className="w-full h-[1px] min-h-[1px] bg-background-neutral-subtle_disabled block "></div>
            </div>
            <div
                name="body"
                id="body"
                className="flex p-6 flex-col items-start gap-6 flex-1 self-stretch"
            >
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <h1 className="text-xl font-semibold text-text-primary">
                        {role.role_name}
                    </h1>
                    <h1 className="text-base font-medium text-text-secondary">
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
                        className="h-4 w-4  bg-gray-100 border-gray-300 rounded-lg accent-background-brand-default"
                    />
                    <h1 className="text-base font-medium text-text-primary">
                        Hoạt động
                    </h1>
                </div>
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <h1 className="text-base font-semibold text-text-primary">
                        Phân quyền chức năng
                    </h1>
                    <div className="grid grid-cols-4 gap-2">
                        {role?.role_function?.map((func, index) => (
                            <div
                                key={index}
                                className="flex px-3 py-1 justify-center items-center gap-2.5 border bg-background-neutral-subtle rounded-full"
                            >
                                <h1 className="text-sm font-medium text-text-primary">
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
                            <h1 className="text-base font-semibold text-text-primary">
                                Danh sách nhân viên
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="flex pt-2 pb-2 pl-3 pr-3 items-center self-stretch border rounded-lg border-border-neutral-default">
                                    <img
                                        src="/icons/search.svg"
                                        alt="icon-search"
                                        className={`w-5 h-5 cursor-pointer`}
                                        onClick={() => {}}
                                    />
                                    <div className="flex items-center gap-[2px] ml-2 flex-1">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            placeholder="Tìm kiếm nhân viên"
                                        />
                                    </div>
                                </div>
                                <img
                                    src="/icons/line.svg"
                                    alt="icon-statistics"
                                />
                                <div
                                    className="flex p-[10px] justify-center items-center gap-2 border rounded-lg border-border-neutral-default cursor-pointer"
                                    onClick={() => {
                                        showErrorToast();
                                    }}
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
                            {(searchTerm === ""
                                ? role?.list_member
                                : filteredData
                            )
                                ?.slice(indexOfFirstItem, indexOfLastItem)
                                ?.map((mem) => (
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
                                                    onError={(e) => {
                                                        e.target.onerror = null; // Ngăn lặp vô hạn khi ảnh thay thế cũng lỗi
                                                        e.target.src =
                                                            "https://dummyimage.com/150x150/cccccc/000000&text=N/A"; // Đường dẫn đến ảnh mặc định
                                                    }}
                                                />
                                                <div className="flex flex-col items-start gap-1">
                                                    <h1 className="text-sm font-medium text-text-secondary">
                                                        {mem.account_id}
                                                    </h1>
                                                    <h1 className="text-base font-semibold text-text-primary">
                                                        {mem.full_name}
                                                    </h1>
                                                </div>
                                            </div>
                                            {mem.status ? (
                                                <div className="flex justify-center items-center gap-2.5 border border-border-positive-default bg-background-positive-subtle  rounded-[4px] px-3 py-1">
                                                    <h1 className="font-medium text-sm text-text-positive">
                                                        Đang hoạt động
                                                    </h1>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center items-center gap-2.5 border border-border-negative-default bg-background-negative-subtle rounded-[4px] px-3 py-1">
                                                    <h1 className="font-medium text-sm text-text-negative">
                                                        Ngưng hoạt động
                                                    </h1>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full h-px bg-background-neutral-subtle_disabled"></div>
                                    </div>
                                ))}
                        </div>

                        <div className="flex justify-between items-center self-stretch">
                            <div className="relative overflow-visible flex flex-col items-start gap-1 max-h-none">
                                <div
                                    className="flex pl-3 pr-3 pt-2 pb-2 items-center gap-[10px] border rounded-lg border-border-neutral-subtle"
                                    onClick={() => {
                                        setOpenDropDownData(!openDropDownData);
                                        handleSetTotalPages();
                                    }}
                                >
                                    <h1 className="text-text-primary font-medium text-sm cursor-pointer">
                                        {showRowNumber}
                                    </h1>
                                    <img
                                        src="/icons/statis_more_icon.svg"
                                        alt="icon-selected"
                                        className={`w-4 h-4 cursor-pointer`}
                                    />
                                </div>
                                {openDropDownData && (
                                    <ShowDataDropDown
                                        onData={handleSeclectRowNumber}
                                        onCloseDropdow={handleCloseDropdow}
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePrev()}
                                    className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all  text-text-primary hover:text-text-white hover:bg-background-neutral-default  focus:text-text-white focus:bg-background-neutral-default  active:text-text-white active:bg-background-neutral-default disabled:pointer-events-none disabled:opacity-50"
                                    type="button"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {renderPagination()}

                                <button
                                    onClick={() => handleNext()}
                                    className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all  text-text-primary hover:text-text-white hover:bg-background-neutral-default  focus:text-text-white focus:bg-background-neutral-default  active:text-text-white active:bg-background-neutral-default disabled:pointer-events-none disabled:opacity-50"
                                    type="button"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="absolute inset-0 bg-background-black bg-opacity-50 z-[900] flex flex-col items-center justify-center ">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                    <h1 className="text-sm font-medium text-text-white">
                        Đang cập nhật
                    </h1>
                </div>
            )}
        </div>
    );
}
