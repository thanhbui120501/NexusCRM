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
                                ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                        } w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  `}
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
                                    ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                    : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                            } w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium`}
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
                        className="flex w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary dark:text-text-white"
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
                                ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                        }
                            
                         w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center rounded-lg text-center transition-all text-sm font-medium`}
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
                                    ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                    : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                            }
                                
                             w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium`}
                            type="button"
                            onClick={() => handlePageChange(1)}
                        >
                            {1}
                        </button>
                    );
                    pages.push(
                        <div
                            key={"more_1"}
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary dark:text-text-white"
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
                                        ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                        : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                                } w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  `}
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
                                    ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                    : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                            }
                                
                             w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  `}
                            type="button"
                            onClick={() => handlePageChange(1)}
                        >
                            {1}
                        </button>
                    );
                    pages.push(
                        <div
                            key={"more_2"}
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary dark:text-text-white"
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
                                        ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                        : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                                } w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium`}
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
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-text-primary dark:text-text-white"
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
                                    ? "bg-background-neutral-default dark:bg-background-surface_default text-text-white dark:text-text-primary hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover"
                                    : "text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default"
                            } w-9 h-9 px-3 py-2 justify-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium`}
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
            className={`flex flex-col items-start fixed top-0 right-0 h-screen w-[712px] bg-background-surface_default dark:bg-background-neutral-hover shadow-lg transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }  transition-transform duration-300 ease-in-out z-[200] overflow-y-auto overflow-x-hidden `}
        >
            <div
                name="header"
                id="header"
                className="flex px-6 py-4 justify-between items-center self-stretch"
            >
                <h1 className="text-text-primary dark:text-text-white text-base font-medium">
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
                    <h1 className="text-xl font-semibold text-text-primary dark:text-text-white">
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
                        className="w-4 h-4 text-text-brand ring-1 ring-background-neutral-default bg-background-neutral-subtle_hover rounded focus:ring-background-brand-default dark:focus:ring-background-brand-hover dark:ring-offset-gray-800 focus:ring-2"
                    />
                    <h1 className="text-base font-medium text-text-primary dark:text-text-white">
                        Hoạt động
                    </h1>
                </div>
                <div className="flex flex-col items-start gap-3 self-stretch">
                    <h1 className="text-base font-semibold text-text-primary dark:text-text-white">
                        Phân quyền chức năng
                    </h1>
                    <div className="grid grid-cols-4 gap-2">
                        {role?.role_function?.map((func, index) => (
                            <div
                                key={index}
                                className="flex px-3 py-1 justify-center items-center gap-2.5 border bg-background-neutral-subtle dark:bg-background-neutral-default rounded-full"
                            >
                                <h1 className="text-sm font-medium text-text-primary dark:text-text-white">
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
                            <h1 className="text-base font-semibold text-text-primary dark:text-text-white">
                                Danh sách nhân viên
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="flex pt-2 pb-2 pl-3 pr-3 items-center self-stretch border rounded-lg border-border-neutral-default bg-background-surface_default dark:bg-background-neutral-default">
                                    <svg
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-5 h-5 cursor-pointer text-text-primary dark:text-text-white`}
                                        onClick={() => {}}
                                    >
                                        <path d="M19.6875 18.8984C20.0781 19.2891 20.0781 19.875 19.6875 20.2266C19.5312 20.4219 19.2969 20.5 19.0625 20.5C18.7891 20.5 18.5547 20.4219 18.3594 20.2266L13.125 14.9922C11.7188 16.125 9.96094 16.75 8.08594 16.75C3.63281 16.75 0 13.1172 0 8.625C0 4.17188 3.59375 0.5 8.08594 0.5C12.5391 0.5 16.2109 4.17188 16.2109 8.625C16.2109 10.5391 15.5859 12.2969 14.4531 13.6641L19.6875 18.8984ZM1.875 8.625C1.875 12.1016 4.64844 14.875 8.125 14.875C11.5625 14.875 14.375 12.1016 14.375 8.625C14.375 5.1875 11.5625 2.375 8.125 2.375C4.64844 2.375 1.875 5.1875 1.875 8.625Z" />
                                    </svg>
                                    <div className="flex items-center gap-0.5 ml-2 flex-1 ">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            placeholder="Tìm kiếm nhân viên"
                                            className="rounded-lg pl-1 py-1 text-sm font-normal text-text-primary dark:text-text-white dark:placeholder:text-text-secondary focus:ring-1 focus:ring-border-brand-default dark:focus:bg-background-neutral-press bg-background-surface_default dark:bg-background-neutral-hover"
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
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-text-primary dark:text-text-white"
                                    >
                                        <path d="M0 16.75C0 16.2422 0.390625 15.8125 0.9375 15.8125H3.24219C3.63281 14.5625 4.84375 13.625 6.25 13.625C7.61719 13.625 8.82812 14.5625 9.21875 15.8125H19.0625C19.5703 15.8125 20 16.2422 20 16.75C20 17.2969 19.5703 17.6875 19.0625 17.6875H9.21875C8.82812 18.9766 7.61719 19.875 6.25 19.875C4.84375 19.875 3.63281 18.9766 3.24219 17.6875H0.9375C0.390625 17.6875 0 17.2969 0 16.75ZM7.5 16.75C7.5 16.0859 6.91406 15.5 6.25 15.5C5.54688 15.5 5 16.0859 5 16.75C5 17.4531 5.54688 18 6.25 18C6.91406 18 7.5 17.4531 7.5 16.75ZM13.75 7.375C15.1172 7.375 16.3281 8.3125 16.7188 9.5625H19.0625C19.5703 9.5625 20 9.99219 20 10.5C20 11.0469 19.5703 11.4375 19.0625 11.4375H16.7188C16.3281 12.7266 15.1172 13.625 13.75 13.625C12.3438 13.625 11.1328 12.7266 10.7422 11.4375H0.9375C0.390625 11.4375 0 11.0469 0 10.5C0 9.99219 0.390625 9.5625 0.9375 9.5625H10.7422C11.1328 8.3125 12.3438 7.375 13.75 7.375ZM15 10.5C15 9.83594 14.4141 9.25 13.75 9.25C13.0469 9.25 12.5 9.83594 12.5 10.5C12.5 11.2031 13.0469 11.75 13.75 11.75C14.4141 11.75 15 11.2031 15 10.5ZM19.0625 3.3125C19.5703 3.3125 20 3.74219 20 4.25C20 4.79688 19.5703 5.1875 19.0625 5.1875H10.4688C10.0781 6.47656 8.86719 7.375 7.5 7.375C6.09375 7.375 4.88281 6.47656 4.49219 5.1875H0.9375C0.390625 5.1875 0 4.79688 0 4.25C0 3.74219 0.390625 3.3125 0.9375 3.3125H4.49219C4.88281 2.0625 6.09375 1.125 7.5 1.125C8.86719 1.125 10.0781 2.0625 10.4688 3.3125H19.0625ZM6.25 4.25C6.25 4.95312 6.79688 5.5 7.5 5.5C8.16406 5.5 8.75 4.95312 8.75 4.25C8.75 3.58594 8.16406 3 7.5 3C6.79688 3 6.25 3.58594 6.25 4.25Z" />
                                    </svg>
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
                                                    <h1 className="text-base font-semibold text-text-primary dark:text-text-white">
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
                                    <h1 className="text-text-primary dark:text-text-white font-medium text-sm cursor-pointer">
                                        {showRowNumber}
                                    </h1>

                                    <svg
                                        viewBox="0 0 9 15"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-4 h-4 cursor-pointer text-text-primary dark:text-text-white ${
                                            openDropDownData
                                                ? "rotate-90"
                                                : "rotate-0"
                                        }`}
                                    >
                                        <path d="M2.47656 0.9375L8.0625 6.875C8.21875 7.07031 8.33594 7.30469 8.33594 7.5C8.33594 7.73438 8.21875 7.96875 8.0625 8.16406L2.47656 14.1016C2.125 14.4922 1.53906 14.4922 1.14844 14.1406C0.757812 13.7891 0.757812 13.2031 1.10938 12.8125L6.10938 7.5L1.10938 2.22656C0.757812 1.83594 0.757812 1.25 1.14844 0.898438C1.53906 0.546875 2.125 0.546875 2.47656 0.9375Z" />
                                    </svg>
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
                                    className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all  text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default active:text-text-white dark:active:text-text-primary active:bg-background-neutral-default dark:active:bg-background-surface_default focus:text-text-white dark:focus:text-text-primary focus:bg-background-neutral-default dark:focus:bg-background-surface_default disabled:pointer-events-none disabled:opacity-50"
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
                                    className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all  text-text-primary dark:text-text-white hover:text-text-white dark:hover:text-text-primary hover:bg-background-neutral-default dark:hover:bg-background-surface_default active:text-text-white dark:active:text-text-primary active:bg-background-neutral-default dark:active:bg-background-surface_default focus:text-text-white dark:focus:text-text-primary focus:bg-background-neutral-default dark:focus:bg-background-surface_default disabled:pointer-events-none disabled:opacity-50"
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
