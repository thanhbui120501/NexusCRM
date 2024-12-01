/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ShowDataDropDown from "./showDataDropdown";
import axiosClient from "../../../axiosClient";
import DialogComponent from "../../../components/dialog";
import ShowFillter from "./showFillter";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Account() {
    const localUser = JSON.parse(
        localStorage.getItem("USER") || sessionStorage.getItem("USER")
    );
    //change url with no reload
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    //
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [openDropDownData, setOpenDropDownData] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(1);
    //total record
    const [totalRecords, setTotalRecords] = useState(0);
    //total account this month
    const [accountThisMonth, setAccountThisMonth] = useState(0);
    //total disable account
    const [disableAccount, setDisableAccount] = useState(0);
    //total user lastmonth
    const [lastmonthUser, setLastMonthUser] = useState(0);
    //get disable account last month
    const [disableAccountLastMonth, setDisableAccountLastMonth] = useState(0);
    //total pages
    const [totalPages, setTotalPages] = useState(0);
    const [showRowNumber, setShowRowNumber] = useState(5);
    //set loading
    const [loading, setLoading] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [accecpt, setAccecpt] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    //show fillter
    const [openFillter, setOpenFillter] = useState(false);
    const [listAdmin, setListAdmin] = useState([]);
    const [isSubmitFillter, submitFillter] = useState(false);
    //allow deleted

    // eslint-disable-next-line no-unused-vars
    const [listFillter, setListFillter] = useState([
        {
            type: "time",
            searchBy: ["Ngày", "Khoảng"],
            time: new Date().toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
        },
        {
            type: "role",
            searchBy: ["Admin", "Giám đốc"],
        },
    ]);
    //callback data fillter
    const [dataCallback, onCallBackDataFillter] = useState({
        startD: null,
        endD: null,
        account_id: null,
    });

    const onCallbackFillter = (val) => {
        onCallBackDataFillter({
            startD: val.startD,
            endD: val.endD,
            account_id: val.id,
        });
    };
    //callback from showfillter
    const callbackFillTer = (val) => {
        setOpenFillter(val);
    };

    //set value show dialog
    // eslint-disable-next-line no-unused-vars
    const [dialog, setValuesDialog] = useState({
        title: "",
        description: "",
        color: "",
        bgColor: "",
        hoverColor: "",
    });
    const handleClickToOpen = () => {
        setOpen(true);
    };

    const handleToClose = () => {
        setOpen(false);
    };
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    //close dropdown
    const handleCloseDropdow = () => {
        setOpenDropDownData(false);
    };
    const handleSeclectRowNumber = (row) => {
        setShowRowNumber(row);
        setCurrentPage(1);
    };

    const handleCheckboxChange = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedUsers([]); // Bỏ chọn tất cả
        } else {
            const allUserIds = users
                .filter(
                    (user) =>
                        localUser.role[0].role_level < user.role[0].role_level
                )
                .map((user) => user.account_id);
            setSelectedUsers(allUserIds); // Chọn tất cả
        }
        setIsAllSelected(!isAllSelected); // Đảo trạng thái isAllSelected
    };
    const callbackSubmitfillter = (val) => {
        submitFillter(val);
    };
    const getUserByKeyword = async (page, limit) => {
        try {
            setLoadingSearch(true);
            if (!keyword || keyword == "") {
                getUsers(currentPage, showRowNumber);
            }
            const offset = (page - 1) * limit;
            const response = await axiosClient.get(
                "/account/search-account-by-keyword",
                {
                    params: {
                        keyword: keyword,
                        limit: limit,
                        offset: offset
                    },
                }
            );
            setUsers(response.data.data);
            //set pages
            const pages = Math.ceil(response.data.totalRecords / limit);
            setTotalPages(pages);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        } finally {
            setLoadingSearch(false);
        }
    };
    const getFillterData = async (page, limit) => {
        try {
            const offset = (page - 1) * limit;
            const response = await axiosClient.get("/account/account-fillter", {
                params: {
                    start_date: dataCallback.startD,
                    end_date: dataCallback.end_date,
                    created_by: dataCallback.account_id,
                    limit: limit,
                    offset: offset,
                },
            });
            submitFillter(false);
            setUsers(response.data.data);
            const pages = Math.ceil(response.data.totalRecords / limit);
            setTotalPages(pages);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    const getListAdmin = async () => {
        try {
            const response = await axiosClient.get("/account/get-list-admin");
            setListAdmin(response.data.data);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    const getUsers = async (page, limit) => {
        try {
            const offset = (page - 1) * limit;

            setLoading(true);
            const response = await axiosClient.get("/account/get-all-account", {
                params: {
                    limit: limit,
                    offset: offset,
                },
            });

            //set user and records
            setUsers(response.data.data);
            setUsersCount(response.data.data.length);
            setTotalRecords(response.data.totalRecords);
            setDisableAccount(response.data.total_disable_account);
            setLastMonthUser(response.data.account_lastmonth);
            setDisableAccountLastMonth(response.data.disable_account_lastmonth);
            setAccountThisMonth(response.data.account_this_month);
            //set pages
            const pages = Math.ceil(response.data.totalRecords / limit);
            setTotalPages(pages);
            setLoading(false);
        } catch (err) {
            const response = err.response;
            setError(response.message);
        } finally {
            setLoading(false);
        }
    };

    const deletedUser = async () => {
        const data = new FormData();
        selectedUsers.forEach((user, index) => {
            data.append(`users[${index}]`, user);
        });

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axiosClient.post(
                "/account/delete-account",
                data
            );
            toast.success("Xóa tài khoản thành công!", {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            getUsers(currentPage, showRowNumber);
            setSelectedUsers([]);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };

    useEffect(() => {
        isSubmitFillter && getFillterData(currentPage, showRowNumber);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitFillter]);
    //get user by number row
    useEffect(() => {
        getUsers(currentPage, showRowNumber);
        getListAdmin();
    }, [currentPage, showRowNumber]);
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    //change url
    const handleSearch = (keyword) => {
        // Cập nhật URL với keyword trong query string
        if (keyword.trim() != "") {
            getUserByKeyword(currentPage, showRowNumber);
        } else {
            getUsers(currentPage, showRowNumber); // Nếu không có keyword, điều hướng về trang chính
        }
    };
    const handleChange = (keyword) => {
        setKeyword(keyword);
    };
    const handlePageChange = (page) => {
        if (page !== currentPage) {
            // Kiểm tra để tránh vòng lặp vô hạn
            setCurrentPage(page);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
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

    //get statrindex in table
    const startIndex = (currentPage - 1) * showRowNumber + 1;

    return (
        <>
            <ToastContainer />
            <div className="flex justify-between items-end self-stretch">
                <div className="flex flex-col flex-1 items-start gap-2 ">
                    <h1 className="self-stretch text-text-primary font-semibold text-3xl">
                        Tài khoản
                    </h1>
                    <h1 className="self-stretch text-text-secondary font-medium text-base">
                        Quản lí tất cả tài khoản tại đây
                    </h1>
                </div>
                <div className="relative flex items-center gap-2">
                    {loadingSearch && (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-[2px] border-border-brand-default border-solid"></div>
                    )}
                    {usersCount > 0 && (
                        <>
                            <div className="flex pt-2 pb-2 pl-3 pr-3 items-center self-stretch border rounded-lg border-[#E5E5E5]">
                                <img
                                    src="/icons/search.svg"
                                    alt="icon-search"
                                    className={`w-5 h-5 cursor-pointer`}
                                    onClick={() => {
                                        handleSearch(keyword);
                                    }}
                                />
                                <div className="flex items-center gap-[2px] ml-2 flex-1">
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) =>
                                            handleChange(e.target.value)
                                        }
                                        placeholder="Tìm kiếm tài khoản"
                                    />
                                </div>
                            </div>
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <div
                                className="flex p-[10px] justify-center items-center gap-2 border rounded-lg border-[#E5E5E5] cursor-pointer"
                                onClick={() => setOpenFillter(!openFillter)}
                            >
                                <img
                                    src="/icons/sliders.svg"
                                    alt="icon-sliders"
                                    className="flex flex-col items-center w-5 h-5 "
                                />
                            </div>
                        </>
                    )}
                    {openFillter && (
                        <ShowFillter
                            onCloseFillter={callbackFillTer}
                            listFillter={listFillter}
                            listAdmin={listAdmin}
                            onData={onCallbackFillter}
                            onSubmit={callbackSubmitfillter}
                        />
                    )}
                    {selectedUsers.length == 0 ? (
                        <div
                            className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-background-brand-default hover:bg-background-brand-hover cursor-pointer"
                            onClick={() => {
                                handleNavigation("/account/create");
                            }}
                        >
                            <div className="flex w-5 h-5 flex-col justify-center  ">
                                <img
                                    src="/icons/addnew.svg"
                                    alt="icon-addnew"
                                    className=""
                                />
                            </div>
                            <h1 className="text-center font-semibold text-sm text-text-white">
                                Thêm mới
                            </h1>
                        </div>
                    ) : (
                        <div
                            className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-background-negative-default hover:bg-background-negative-hover cursor-pointer onClick={()=>{}}"
                            onClick={() => {
                                deletedUser();
                            }}
                        >
                            <h1 className="text-center font-semibold text-sm text-text-white">
                                Xóa ({selectedUsers.length})
                            </h1>
                        </div>
                    )}
                </div>
            </div>
            <AccountStatistics
                loading={loading}
                users={totalRecords}
                userThisMonth={accountThisMonth}
                disableAccount={disableAccount}
                lastmonthUser={lastmonthUser}
                disableAccountLastMonth={disableAccountLastMonth}
            />
            {usersCount.length == 0 && !loading ? (
                <div className="flex flex-col items-center justify-center w-full mt-4">
                    <h1 className="text-base font-medium text-text-negative">
                        Chưa có nhân viên nào trên hệ thống!
                    </h1>
                    <h1
                        onClick={() => {
                            handleNavigation("/account/create");
                        }}
                        className="cursor-pointer text-text-info text-sm font-medium underline"
                    >
                        Thêm nhân viên ngay
                    </h1>
                </div>
            ) : (
                <div className="flex pb-6 flex-col items-start gap-3 self-stretch">
                    <div className="flex items-start self-stretch overflow-x-hidden overflow-y-auto  max-w-full">
                        <table className="w-full table-fixed bg-background-surface_default">
                            <thead className="rounded-t-lg sticky top-0 z-10">
                                <tr className="bg-background-neutral-subtle text-text-gray text-sm font-medium">
                                    <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg w-[5%]">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            className="accent-background-brand-default border-2 border-border-gray w-6 h-5"
                                        />
                                    </th>
                                    <th className="py-3 px-6 text-center w-[5%]">
                                        #
                                    </th>
                                    <th className="py-3 px-6 text-left w-[12%] whitespace-nowrap">
                                        Ảnh đại diện
                                    </th>
                                    <th className="py-3 px-6 text-left w-[20%] whitespace-nowrap">
                                        Tên tài khoản
                                    </th>
                                    <th className="py-3 px-6 text-left w-[20%] whitespace-nowrap">
                                        Tên nhân viên
                                    </th>
                                    <th className="py-3 px-6 text-left w-[15%] whitespace-nowrap">
                                        Số điện thoại
                                    </th>
                                    <th className="py-3 px-6 text-left w-[20%] whitespace-nowrap">
                                        Email
                                    </th>
                                    <th className="py-3 px-6 text-left w-[12%] whitespace-nowrap ">
                                        Chức vụ
                                    </th>
                                    <th className="py-3 px-6 text-left rounded-tr-lg rounded-br-lg w-[20%] whitespace-nowrap ">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-text-gray text-sm font-light">
                                {users.length == 0 && !loading ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="py-6 text-center text-text-gray"
                                        >
                                            Không có tài khoản nào được tìm thấy
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr
                                            key={user.account_id}
                                            onDoubleClick={() => {
                                                handleNavigation(
                                                    `/account/${user.account_id}`
                                                );
                                            }}
                                            className={`border-b border-border-neutral-focus hover:bg-background-brand-subtle_hover ${
                                                selectedUsers.includes(
                                                    user.account_id
                                                )
                                                    ? "bg-background-brand-subtle_hover"
                                                    : ""
                                            }`}
                                        >
                                            <td className="py-3 px-6 text-left">
                                                <input
                                                    type="checkbox"
                                                    disabled={
                                                        localUser.role[0]
                                                            .role_level >=
                                                        user.role[0].role_level
                                                            ? true
                                                            : false
                                                    }
                                                    checked={selectedUsers.includes(
                                                        user.account_id
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            user.account_id
                                                        )
                                                    }
                                                    className="accent-background-brand-default border-2 border-border-gray w-6 h-5"
                                                />
                                            </td>
                                            <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-base text-text-primary">
                                                {startIndex + index}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {user.image_name ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000/uploads/${user.image_name}`}
                                                        alt="Avatar"
                                                        className="w-10 h-10 rounded-xl object-fill"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null; // Ngăn lặp vô hạn khi ảnh thay thế cũng lỗi
                                                            e.target.src =
                                                                "https://dummyimage.com/150x150/cccccc/000000&text=N/A"; // Đường dẫn đến ảnh mặc định
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={`/images/avatar.png`}
                                                        alt="Avatar"
                                                        className="w-10 h-10 rounded-xl object-fill"
                                                    />
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                {user.username}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                {user.full_name}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                {user.phone_number}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                {user.email}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                <ul>
                                                    {user.role.map((r) => (
                                                        <li key={r.role_id}>
                                                            {r.role_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="py-3 px-6 text-left whitespace-nowrap text-ellipsis">
                                                {user.status == 1 ? (
                                                    <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#16A34A] bg-background-positive-subtle">
                                                        <li className="font-medium text-sm text-text-positive">
                                                            Đang hoạt động
                                                        </li>
                                                    </ul>
                                                ) : (
                                                    <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#DC2626] bg-background-negative-subtle">
                                                        <li className="font-medium text-sm text-text-negative">
                                                            Ngưng hoạt động
                                                        </li>
                                                    </ul>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center self-stretch">
                        <div className=" flex items-start gap-3">
                            <div className="relative overflow-visible flex flex-col items-start gap-1 max-h-none">
                                <div
                                    className="flex pl-3 pr-3 pt-2 pb-2 items-center gap-[10px] border rounded-lg border-border-neutral-focus"
                                    onClick={() =>
                                        setOpenDropDownData(!openDropDownData)
                                    }
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

                            <h1 className="text-text-primary font-medium text-sm mt-2">
                                Hiển thị 1 - {showRowNumber} dòng dữ liệu{" "}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                className="flex px-3 py-2 justify-items-center gap-[10px] rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default active:text-text-white active:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default disabled:pointer-events-none disabled:opacity-50"
                            >
                                Đầu tiên
                            </button>
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
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                className="flex px-3 py-2 justify-items-center gap-[10px] rounded-lg text-center transition-all text-sm font-medium  text-text-primary hover:text-text-white hover:bg-background-neutral-default active:text-text-white active:bg-background-neutral-default focus:text-text-white focus:bg-background-neutral-default disabled:pointer-events-none disabled:opacity-50"
                            >
                                Cuối cùng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                    <h1 className="text-sm font-medium text-text-white">
                        Đang tải danh sách nhân viên
                    </h1>
                </div>
            )}
            <DialogComponent
                open={open}
                setOpen={setOpen}
                onClickToOpen={handleClickToOpen}
                onClickToClose={handleToClose}
                title={dialog.title}
                description={dialog.description}
                color={dialog.color}
                bgColor={dialog.bgColor}
                hoverColor={dialog.hoverColor}
            />
        </>
    );
}

export function AccountStatistics({
    loading,
    users,
    userThisMonth,
    disableAccount,
    lastmonthUser,
    disableAccountLastMonth,
}) {
    //format number
    const formatNumber = (value) => {
        if (Number.isInteger(value)) {
            return value;
        }

        return value.toFixed(2);
    };
    //get percent
    const getAccountPercent = (current, lastmonth) => {
        let grow = loading ? 0 : current - lastmonth;
        if (lastmonth === 0) {
            if (current === 0) {
                return (
                    <div className="flex items-center justify-center gap-2.5 border border-border-positive-focus bg-background-positive-subtle rounded-full">
                        <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                            <img
                                src="/icons/arrow-trend-up.svg"
                                alt="arrow-trend-up"
                            />
                            <h1 className="text-text-positive font-medium text-sm">
                                0 %
                            </h1>
                        </div>
                    </div>
                );
            }
            return (
                <div className="flex items-center justify-center gap-2.5 border border-border-positive-focus bg-background-positive-subtle rounded-full">
                    <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                        <img
                            src="/icons/arrow-trend-up.svg"
                            alt="arrow-trend-up"
                        />
                        <h1 className="text-text-positive font-medium text-sm">
                            100 %
                        </h1>
                    </div>
                </div>
            );
        }
        if (grow === 0) {
            return (
                <div className="flex items-center justify-center gap-2.5 border border-border-positive-focus bg-background-positive-subtle rounded-full">
                    <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                        <img
                            src="/icons/arrow-trend-up.svg"
                            alt="arrow-trend-up"
                        />
                        <h1 className="text-text-positive font-medium text-sm">
                            0 %
                        </h1>
                    </div>
                </div>
            );
        } else {
            if (grow > 0) {
                let percent = formatNumber((grow / lastmonth) * 100);
                return (
                    <div className="flex items-center justify-center gap-2.5 border border-border-positive-focus bg-background-positive-subtle rounded-full">
                        <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                            <img
                                src="/icons/arrow-trend-up.svg"
                                alt="arrow-trend-up"
                            />
                            <h1 className="text-text-positive font-medium text-sm">
                                {percent} %
                            </h1>
                        </div>
                    </div>
                );
            } else {
                let percent = formatNumber((grow / lastmonth) * 100);
                return (
                    <div className="flex items-center justify-center gap-2.5 border border-border-negative-focus bg-background-negative-subtle rounded-full">
                        <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                            <img
                                src="/icons/arrow-trend-down.svg"
                                alt="arrow-trend-down"
                            />
                            <h1 className="text-text-negative font-medium text-sm">
                                {percent * -1} %
                            </h1>
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <div className="flex pb-6 items-center self-stretch">
            <div className="flex items-center gap-6 flex-1">
                <div className="flex px-6 py-5 flex-col items-start gap-3 flex-1 border rounded-xl border-b-border-neutral-subtle  bg-background-surface_default">
                    <div className="flex items-center gap-2">
                        <h1 className="text-base font-medium text-text-primary">
                            Tổng tài khoản
                        </h1>
                        <img
                            src="/icons/circle-info.svg"
                            alt="icon-info"
                            className="cursor-pointer"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-text-primary">
                        {loading ? 0 : users + 1}
                    </h1>
                    <div className="flex items-center gap-2 self-stretch">
                        <h1 className="font-medium text-base text-text-secondary">
                            so với tháng trước
                        </h1>

                        {getAccountPercent(userThisMonth, lastmonthUser)}
                    </div>
                </div>
                <div className="flex px-6 py-5 flex-col items-start gap-3 flex-1 border rounded-xl border-b-border-neutral-subtle bg-background-surface_default">
                    <div className="flex items-center gap-2">
                        <h1 className="text-base font-medium text-text-primary">
                            Tài khoản ngưng hoạt động
                        </h1>
                        <img
                            src="/icons/circle-info.svg"
                            alt="icon-info"
                            className="cursor-pointer"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-text-primary">
                        {loading
                            ? 0
                            : formatNumber(
                                  (disableAccount / (users + 1)) * 100
                              )}
                        %
                    </h1>
                    <div className="flex items-center gap-2 self-stretch">
                        <h1 className="font-medium text-base text-text-secondary">
                            so với tháng trước
                        </h1>
                        {getAccountPercent(
                            disableAccount,
                            disableAccountLastMonth
                        )}
                    </div>
                </div>
                <div className="flex px-6 py-5 flex-col items-start gap-3 flex-1 border rounded-xl border-b-border-neutral-subtle bg-background-surface_default">
                    <div className="flex items-center gap-2">
                        <h1 className="text-base font-medium text-text-primary">
                            Doanh thu/Tài khoản
                        </h1>
                        <img
                            src="/icons/circle-info.svg"
                            alt="icon-info"
                            className="cursor-pointer"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-text-primary">
                        2,250,000,000
                    </h1>
                    <div className="flex items-center gap-2 self-stretch">
                        <h1 className="font-medium text-base text-text-secondary">
                            so với tháng trước
                        </h1>
                        <div className="flex items-center justify-center gap-2.5 border bg-background-positive-subtle rounded-full">
                            <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                                <img
                                    src="/icons/arrow-trend-up.svg"
                                    alt="arrow-trend-up"
                                />
                                <h1 className="text-text-positive font-medium text-sm">
                                    12 %
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
