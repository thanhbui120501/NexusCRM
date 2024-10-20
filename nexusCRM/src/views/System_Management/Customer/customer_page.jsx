import { useState, useEffect } from "react";
import ShowDataDropDown from "../Account/showDataDropdown";
import axiosClient from "../../../axiosClient";
import DialogComponent from "../../../components/dialog";
import ShowFillter from "../Account/showFillter";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Customer() {
    const localUser = JSON.parse(localStorage.getItem("USER"));
    //change url with no reload
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    //
    const [selectedCustomer, setSelectedACustomer] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [openDropDownData, setOpenDropDownData] = useState(false);
    const [customers, setCustomers] = useState([]);
    //total record
    // eslint-disable-next-line no-unused-vars
    const [totalRecords, setTotalRecords] = useState(0);
    // //total account this month
    // const [accountThisMonth, setAccountThisMonth] = useState(0);
    // //total disable account
    // const [disableAccount, setDisableAccount] = useState(0);
    // //total user lastmonth
    // const [lastmonthUser, setLastMonthUser] = useState(0);
    // //get disable account last month
    // const [disableAccountLastMonth, setDisableAccountLastMonth] = useState(0);
    //total pages
    const [totalPages, setTotalPages] = useState(0);
    const [showRowNumber, setShowRowNumber] = useState(5);
    //set loading
    const [loading, setLoading] = useState(true);
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
        customer_id: null,
    });

    const onCallbackFillter = (val) => {
        onCallBackDataFillter({
            startD: val.startD,
            endD: val.endD,
            customer_id: val.id,
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
        if (selectedCustomer.includes(id)) {
            setSelectedACustomer(
                selectedCustomer.filter((userId) => userId !== id)
            );
        } else {
            setSelectedACustomer([...selectedCustomer, id]);
        }
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedACustomer([]); // Bỏ chọn tất cả
        } else {
            const allUserIds = customers
                .filter(
                    (user) =>
                        localUser.role[0].role_level < user.role[0].role_level
                )
                .map((user) => user.customer_id);
            setSelectedACustomer(allUserIds); // Chọn tất cả
        }
        setIsAllSelected(!isAllSelected); // Đảo trạng thái isAllSelected
    };
    const callbackSubmitfillter = (val) => {
        submitFillter(val);
    };
    const getCustomerByKeyword = async () => {
        if (!keywordFromUrl || keywordFromUrl == "") return;
        try {
            const response = await axiosClient.get(
                "/customer/search-customer-by-keyword",
                {
                    params: {
                        keyword: keywordFromUrl,
                    },
                }
            );
            setCustomers(response.data.data);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    const getFillterData = async () => {
        try {
            const response = await axiosClient.get("/account/account-fillter", {
                params: {
                    start_date: dataCallback.startD,
                    end_date: dataCallback.end_date,
                    created_by: dataCallback.customer_id,
                },
            });
            submitFillter(false);
            setCustomers(response.data.data);
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
    const getCustomers = async (page, limit) => {
        try {
            const offset = (page - 1) * limit;

            setLoading(true);
            const response = await axiosClient.get(
                "/customer/get-list-customer",
                {
                    params: {
                        limit: limit,
                        offset: offset,
                    },
                }
            );

            //set user and records
            setCustomers(response.data.data);
            setTotalRecords(response.data.totalRecords);
            // setDisableAccount(response.data.total_disable_account);
            // setLastMonthUser(response.data.account_lastmonth);
            // setDisableAccountLastMonth(response.data.disable_account_lastmonth);
            // setAccountThisMonth(response.data.account_this_month);
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

    const deletedCustomer = async () => {
        const data = new FormData();
        selectedCustomer.forEach((user, index) => {
            data.append(`customers[${index}]`, user);
        });

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axiosClient.post(
                `/customer/delete-customer/`,
                data
            );
            if (response.status === 204) {
                toast.success("Xóa khách hàng thành công!", {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            getCustomers(currentPage, showRowNumber);
            setSelectedACustomer([]);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    // Lấy keyword từ URL (nếu có)
    const keywordFromUrl = searchParams.get("keyword") || "";
    useEffect(() => {
        getCustomerByKeyword();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keywordFromUrl]);
    useEffect(() => {
        isSubmitFillter && getFillterData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitFillter]);
    //get user by number row
    useEffect(() => {
        getCustomers(currentPage, showRowNumber);
        getListAdmin();
    }, [currentPage, showRowNumber]);
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

    //change url
    const handleSearch = (keyword) => {
        // Cập nhật URL với keyword trong query string
        if (keyword.trim()) {
            navigate(`?keyword=${keyword}`);
        } else {
            navigate("/customer"); // Nếu không có keyword, điều hướng về trang chính
        }
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
                                ? "bg-gray-900 text-white hover:bg-[#262626]"
                                : "text-gray-900 hover:text-white hover:bg-gray-900"
                        } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
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
                                    ? "bg-gray-900 text-white hover:bg-[#262626]"
                                    : "text-gray-900 hover:text-white hover:bg-gray-900"
                            } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
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
                        className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-gray-900"
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
                                ? "bg-gray-900 text-white hover:bg-[#262626]"
                                : "text-gray-900 hover:text-white hover:bg-gray-900"
                        }
                            
                         w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
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
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-900 hover:text-white hover:bg-gray-900"
                            }
                                
                             w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                            type="button"
                            onClick={() => handlePageChange(1)}
                        >
                            {1}
                        </button>
                    );
                    pages.push(
                        <div
                            key={"more_1"}
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-gray-900"
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
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-900 hover:text-white hover:bg-gray-900"
                                } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
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
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-900 hover:text-white hover:bg-gray-900"
                            }
                                
                             w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
                            type="button"
                            onClick={() => handlePageChange(1)}
                        >
                            {1}
                        </button>
                    );
                    pages.push(
                        <div
                            key={"more_2"}
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-gray-900"
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
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-900 hover:text-white hover:bg-gray-900"
                                } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
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
                            className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-gray-900"
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
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-900 hover:text-white hover:bg-gray-900"
                            } w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50`}
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
        <div className="flex flex-col h-full items-start gap-3 justify-start self-stretch pl-6 pr-6 overflow-y-auto">
            <ToastContainer />
            <div className="flex justify-between items-end self-stretch">
                <div className="flex flex-col flex-1 items-start gap-2 ">
                    <h1 className="self-stretch text-gray-900 font-semibold text-3xl">
                        Khách hàng
                    </h1>
                    <h1 className="self-stretch text-gray-400 font-medium text-base">
                        Quản lí tất cả khách hàng tại đây
                    </h1>
                </div>
                <div className="relative flex items-center gap-2">
                    {customers.length !== 0 && (
                        <div className="flex pt-2 pb-2 pl-3 pr-3 items-center self-stretch border rounded-lg border-[#E5E5E5]">
                            <img
                                src="/icons/search.svg"
                                alt="icon-search"
                                className={`w-5 h-5 cursor-pointer`}
                                onClick={() => {
                                    handleSearch(keywordFromUrl);
                                }}
                            />
                            <div className="flex items-center gap-[2px] ml-2 flex-1">
                                <input
                                    type="text"
                                    value={keywordFromUrl}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    placeholder="Tìm kiếm khách hàng"
                                />
                            </div>
                        </div>
                    )}
                    {customers.length !== 0 && (
                        <img src="/icons/line.svg" alt="icon-statistics" />
                    )}
                    {customers.length !== 0 && (
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
                    {selectedCustomer.length == 0 ? (
                        <div
                            className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-orange-600 hover:bg-[#C2410C] cursor-pointer"
                            // onClick={() => {
                            //     handleNavigation("/account/create");
                            // }}
                        >
                            <div className="flex w-5 h-5 flex-col justify-center  ">
                                <img
                                    src="/icons/addnew.svg"
                                    alt="icon-addnew"
                                    className=""
                                />
                            </div>
                            <h1 className="text-center font-semibold text-sm text-white">
                                Thêm mới
                            </h1>
                        </div>
                    ) : (
                        <div
                            className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] cursor-pointer onClick={()=>{}}"
                            onClick={() => {
                                deletedCustomer();
                            }}
                        >
                            <h1 className="text-center font-semibold text-sm text-white">
                                Xóa ({selectedCustomer.length})
                            </h1>
                        </div>
                    )}
                </div>
            </div>
            {/* <AccountStatistics
                loading={loading}
                users={totalRecords}
                userThisMonth={accountThisMonth}
                disableAccount={disableAccount}
                lastmonthUser={lastmonthUser}
                disableAccountLastMonth={disableAccountLastMonth}
            /> */}
            {customers.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center w-full mt-4">
                    <h1 className="text-base font-medium text-red-600">
                        Chưa có khách hàng nào trên hệ thống!
                    </h1>
                    <h1
                        onClick={() => {
                            handleNavigation("/account/create");
                        }}
                        className="cursor-pointer text-blue-600 text-sm font-medium underline"
                    >
                        Thêm khách hàng ngay
                    </h1>
                </div>
            ) : (
                <div className="flex pb-6 flex-col items-start gap-3 self-stretch">
                    <div className="flex items-start self-stretch overflow-x-hidden overflow-y-auto  max-w-full">
                        <table className="w-full table-fixed bg-white ">
                            <thead className="rounded-t-lg sticky top-0 z-10">
                                <tr className="bg-gray-50 text-gray-500 text-sm font-medium">
                                    <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg w-[5%]">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            className="accent-[#EA580C] border-2 border-gray-500 w-6 h-5"
                                        />
                                    </th>
                                    <th className="py-3 px-6 text-center w-[5%]">
                                        #
                                    </th>
                                    <th className="py-3 px-6 text-left w-[12%] whitespace-nowrap">
                                        Ảnh đại diện
                                    </th>
                                    <th className="py-3 px-6 text-left w-[15%] whitespace-nowrap">
                                        Tên khách hàng
                                    </th>
                                    <th className="py-3 px-6 text-left w-[15%] whitespace-nowrap">
                                        Số điện thoại
                                    </th>
                                    <th className="py-3 px-6 text-left w-[20%] whitespace-nowrap">
                                        Email
                                    </th>
                                    <th className="py-3 px-6 text-left w-[25%] whitespace-nowrap">
                                        Địa chỉ
                                    </th>

                                    <th className="py-3 px-6 text-left rounded-tr-lg rounded-br-lg w-[20%] whitespace-nowrap ">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {customers.map((customer, index) => (
                                    <tr
                                        key={customer.customer_id}
                                        onDoubleClick={() => {
                                            handleNavigation(
                                                `/customer/${customer.customer_id}`
                                            );
                                        }}
                                        className={`border-b border-gray-200 hover:bg-orange-100 ${
                                            selectedCustomer.includes(
                                                customer.customer_id
                                            )
                                                ? "bg-orange-100"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-3 px-6 text-left">
                                            <input
                                                type="checkbox"
                                                disabled={
                                                    localUser.role[0]
                                                        .role_level >= 3
                                                        ? true
                                                        : false
                                                }
                                                checked={selectedCustomer.includes(
                                                    customer.customer_id
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        customer.customer_id
                                                    )
                                                }
                                                className="accent-[#EA580C] border-2 border-gray-500 w-6 h-5"
                                            />
                                        </td>
                                        <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-base text-gray-900">
                                            {startIndex + index}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {customer.image_name ? (
                                                <img
                                                    src={`http://127.0.0.1:8000/uploads/${customer.image_name}`}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-xl object-fill"
                                                />
                                            ) : (
                                                <img
                                                    src={`/images/avatar.png`}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-xl object-fill"
                                                />
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900 whitespace-nowrap text-ellipsis overflow-hidden">
                                            {customer.full_name}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900 whitespace-nowrap text-ellipsis overflow-hidden">
                                            {customer.phone_number}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900 whitespace-nowrap text-ellipsis overflow-hidden">
                                            {customer.email}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900 whitespace-nowrap text-ellipsis overflow-hidden">
                                            {}
                                            129, Phan Văn Hớn, P. Tân Thới Nhất,
                                            q12, TP Hồ Chí Minh
                                        </td>
                                        <td className="py-3 px-6 text-left whitespace-nowrap text-ellipsis">
                                            {/* {user.status == 1 ? (
                                                <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#16A34A] bg-[#F0FDF4]">
                                                    <li className="font-medium text-sm text-[#16A34A]">
                                                        Đang hoạt động
                                                    </li>
                                                </ul>
                                            ) : (
                                                <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#DC2626] bg-[#FEF2F2]">
                                                    <li className="font-medium text-sm text-[#DC2626]">
                                                        Ngưng hoạt động
                                                    </li>
                                                </ul>
                                            )} */}
                                            {}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center self-stretch">
                        <div className=" flex items-start gap-3">
                            <div className="relative overflow-visible flex flex-col items-start gap-1 max-h-none">
                                <div
                                    className="flex pl-3 pr-3 pt-2 pb-2 items-center gap-[10px] border rounded-lg border-gray-200"
                                    onClick={() =>
                                        setOpenDropDownData(!openDropDownData)
                                    }
                                >
                                    <h1 className="text-gray-900 font-medium text-sm cursor-pointer">
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

                            <h1 className="text-gray-900 font-medium text-sm mt-2">
                                Hiển thị 1 - {showRowNumber} dòng dữ liệu{" "}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                className="flex px-3 py-2 justify-items-center gap-[10px] rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 active:text-white active:bg-gray-900 focus:text-white focus:bg-gray-900 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Đầu tiên
                            </button>
                            <button
                                onClick={() => handlePrev()}
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all  text-gray-900 hover:text-white hover:bg-gray-900  focus:text-white focus:bg-gray-900  active:text-white active:bg-gray-900 disabled:pointer-events-none disabled:opacity-50"
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
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all  text-gray-900 hover:text-white hover:bg-gray-900  focus:text-white focus:bg-gray-900  active:text-white active:bg-gray-900 disabled:pointer-events-none disabled:opacity-50"
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
                                className="flex px-3 py-2 justify-items-center gap-[10px] rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 active:text-white active:bg-gray-900 focus:text-white focus:bg-gray-900 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Cuối cùng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                    <h1 className="text-sm font-medium text-white">
                        Đang tải danh sách khách hàng
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
        </div>
    );
}

// export function AccountStatistics({
//     loading,
//     users,
//     userThisMonth,
//     disableAccount,
//     lastmonthUser,
//     disableAccountLastMonth,
// }) {
//     //format number
//     const formatNumber = (value) => {
//         if (Number.isInteger(value)) {
//             return value;
//         }

//         return value.toFixed(2);
//     };
//     //get percent
//     const getAccountPercent = (current, lastmonth) => {
//         let grow = loading ? 0 : current - lastmonth;
//         if (lastmonth === 0) {
//             if (current === 0) {
//                 return (
//                     <div className="flex items-center justify-center gap-2.5 border border-b-[#BBF7D0] bg-[#F0FDF4] rounded-full">
//                         <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
//                             <img
//                                 src="/icons/arrow-trend-up.svg"
//                                 alt="arrow-trend-up"
//                             />
//                             <h1 className="text-[#16A34A] font-medium text-sm">
//                                 0 %
//                             </h1>
//                         </div>
//                     </div>
//                 );
//             }
//             return (
//                 <div className="flex items-center justify-center gap-2.5 border border-b-[#BBF7D0] bg-[#F0FDF4] rounded-full">
//                     <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
//                         <img
//                             src="/icons/arrow-trend-up.svg"
//                             alt="arrow-trend-up"
//                         />
//                         <h1 className="text-[#16A34A] font-medium text-sm">
//                             100 %
//                         </h1>
//                     </div>
//                 </div>
//             );
//         }
//         if (grow === 0) {
//             return (
//                 <div className="flex items-center justify-center gap-2.5 border border-b-[#BBF7D0] bg-[#F0FDF4] rounded-full">
//                     <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
//                         <img
//                             src="/icons/arrow-trend-up.svg"
//                             alt="arrow-trend-up"
//                         />
//                         <h1 className="text-[#16A34A] font-medium text-sm">
//                             0 %
//                         </h1>
//                     </div>
//                 </div>
//             );
//         } else {
//             if (grow > 0) {
//                 let percent = formatNumber((grow / lastmonth) * 100);
//                 return (
//                     <div className="flex items-center justify-center gap-2.5 border border-b-[#BBF7D0] bg-[#F0FDF4] rounded-full">
//                         <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
//                             <img
//                                 src="/icons/arrow-trend-up.svg"
//                                 alt="arrow-trend-up"
//                             />
//                             <h1 className="text-[#16A34A] font-medium text-sm">
//                                 {percent} %
//                             </h1>
//                         </div>
//                     </div>
//                 );
//             } else {
//                 let percent = formatNumber((grow / lastmonth) * 100);
//                 return (
//                     <div className="flex items-center justify-center gap-2.5 border border-b-[#FECACA] bg-[#FEF2F2] rounded-full">
//                         <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
//                             <img
//                                 src="/icons/arrow-trend-down.svg"
//                                 alt="arrow-trend-down"
//                             />
//                             <h1 className="text-[#DC2626] font-medium text-sm">
//                                 {percent * -1} %
//                             </h1>
//                         </div>
//                     </div>
//                 );
//             }
//         }
//     };

//     return (
//         <div className="flex pb-6 items-center self-stretch">
//             <div className="flex items-center gap-6 flex-1">
//                 <div className="flex px-6 py-5 flex-col items-start gap-3 flex-1 border rounded-xl border-b-[#E5E5E5] bg-[#FFF]">
//                     <div className="flex items-center gap-2">
//                         <h1 className="text-base font-medium text-gray-900">
//                             Tổng tài khoản
//                         </h1>
//                         <img
//                             src="/icons/circle-info.svg"
//                             alt="icon-info"
//                             className="cursor-pointer"
//                         />
//                     </div>
//                     <h1 className="text-4xl font-bold text-gray-900">
//                         {loading ? 0 : users + 1}
//                     </h1>
//                     <div className="flex items-center gap-2 self-stretch">
//                         <h1 className="font-medium text-base text-[#A3A3A3]">
//                             so với tháng trước
//                         </h1>

//                         {getAccountPercent(userThisMonth, lastmonthUser)}
//                     </div>
//                 </div>
//                 <div className="flex px-6 py-5 flex-col items-start gap-3 flex-1 border rounded-xl border-b-[#E5E5E5] bg-[#FFF]">
//                     <div className="flex items-center gap-2">
//                         <h1 className="text-base font-medium text-gray-900">
//                             Tài khoản ngưng hoạt động
//                         </h1>
//                         <img
//                             src="/icons/circle-info.svg"
//                             alt="icon-info"
//                             className="cursor-pointer"
//                         />
//                     </div>
//                     <h1 className="text-4xl font-bold text-gray-900">
//                         {loading
//                             ? 0
//                             : formatNumber(
//                                   (disableAccount / (users + 1)) * 100
//                               )}
//                         %
//                     </h1>
//                     <div className="flex items-center gap-2 self-stretch">
//                         <h1 className="font-medium text-base text-[#A3A3A3]">
//                             so với tháng trước
//                         </h1>
//                         {getAccountPercent(
//                             disableAccount,
//                             disableAccountLastMonth
//                         )}
//                     </div>
//                 </div>
//                 <div className="flex px-6 py-5 flex-col items-start gap-3 flex-1 border rounded-xl border-b-[#E5E5E5] bg-[#FFF]">
//                     <div className="flex items-center gap-2">
//                         <h1 className="text-base font-medium text-gray-900">
//                             Doanh thu/Tài khoản
//                         </h1>
//                         <img
//                             src="/icons/circle-info.svg"
//                             alt="icon-info"
//                             className="cursor-pointer"
//                         />
//                     </div>
//                     <h1 className="text-4xl font-bold text-gray-900">
//                         2,250,000,000
//                     </h1>
//                     <div className="flex items-center gap-2 self-stretch">
//                         <h1 className="font-medium text-base text-[#A3A3A3]">
//                             so với tháng trước
//                         </h1>
//                         <div className="flex items-center justify-center gap-2.5 border bg-[#F0FDF4] rounded-full">
//                             <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
//                                 <img
//                                     src="/icons/arrow-trend-up.svg"
//                                     alt="arrow-trend-up"
//                                 />
//                                 <h1 className="text-[#16A34A] font-medium text-sm">
//                                     12 %
//                                 </h1>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
