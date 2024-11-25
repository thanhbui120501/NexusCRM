import { useState, useEffect } from "react";
import ShowDataDropDown from "../Account/showDataDropdown";
import axiosClient from "../../../axiosClient";
import DialogComponent from "../../../components/dialog";
import ShowFillter from "../Account/showFillter";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Customer() {
    //const localUser = JSON.parse(localStorage.getItem("USER") || sessionStorage.getItem("USER")) ;
    //change url with no reload
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    //
    const [selectedCustomer, setSelectedACustomer] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [openDropDownData, setOpenDropDownData] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customersCount, setCustomerCount] = useState(1);
    //total record
    // eslint-disable-next-line no-unused-vars
    const [totalRecords, setTotalRecords] = useState(0);
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
            const allUserIds = customers.map((user) => user.customer_id);
            setSelectedACustomer(allUserIds); // Chọn tất cả
        }
        setIsAllSelected(!isAllSelected); // Đảo trạng thái isAllSelected
    };
    const callbackSubmitfillter = (val) => {
        submitFillter(val);
    };
    const getCustomerByKeyword = async () => {
        try {
            setLoadingSearch(true);
            if (!keyword || keyword == "") {
                getCustomers(currentPage, showRowNumber);
            }
            const response = await axiosClient.get(
                "/customer/search-customer-by-keyword",
                {
                    params: {
                        keyword: keyword,
                    },
                }
            );
            setCustomers(response.data.data);
            //set pages
            const pages = Math.ceil(response.data.data.length / showRowNumber);
            setTotalPages(pages);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        } finally {
            setLoadingSearch(false);
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
            setCustomerCount(response.data.data.length);
            setTotalRecords(response.data.totalRecords);

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
            const response = await axiosClient.post(
                `/customer/delete-customer`,
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
        if (keyword.trim() != "") {
            getCustomerByKeyword();
        } else {
            getCustomers(currentPage, showRowNumber); // Nếu không có keyword, điều hướng về trang chính
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

    //handle customer status
    const handleCustomerStatus = (sta) => {
        switch (sta) {
            case "Active":
                return (
                    <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#16A34A] bg-[#F0FDF4]">
                        <li className="font-medium text-sm text-[#16A34A]">
                            Đang hoạt động
                        </li>
                    </ul>
                );
            case "Locked":
                return (
                    <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-yellow-400 bg-yellow-50">
                        <li className="font-medium text-sm text-yellow-400">
                            Tạm khóa
                        </li>
                    </ul>
                );
            case "Expired":
                return (
                    <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-blue-400 bg-blue-50">
                        <li className="font-medium text-sm text-blue-400">
                            Đóng băng
                        </li>
                    </ul>
                );
            default:
                return (
                    <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#DC2626] bg-[#FEF2F2]">
                        <li className="font-medium text-sm text-[#DC2626]">
                            Ngưng hoạt động
                        </li>
                    </ul>
                );
        }
        // <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#16A34A] bg-[#F0FDF4]">
        //                                             <li className="font-medium text-sm text-[#16A34A]">
        //                                                 Đang hoạt động
        //                                             </li>
        //                                         </ul>
        //                                     ) : (
        //                                         <ul className="flex pl-3 pr-3 pt-1 pb-1 w-[140px] h-[20px] justify-center items-center gap-[10px] border rounded-[4px] border-[#DC2626] bg-[#FEF2F2]">
        //                                             <li className="font-medium text-sm text-[#DC2626]">
        //                                                 Ngưng hoạt động
        //                                             </li>
        //                                         </ul>
    };
    return (
        <>
            <ToastContainer />
            <div className="flex justify-between items-end self-stretch">
                <div className="flex flex-col flex-1 items-start gap-2 ">
                    <h1 className="self-stretch text-text-primary font-semibold text-3xl">
                        Khách hàng
                    </h1>
                    <h1 className="self-stretch text-text-secondary font-medium text-base">
                        Quản lí tất cả khách hàng tại đây
                    </h1>
                </div>
                <div className="relative flex items-center gap-2">
                    {loadingSearch && (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-[2px] border-border-brand-default border-solid"></div>
                    )}
                    {customersCount > 0 && (
                        <>
                            <div className="flex pt-2 pb-2 pl-3 pr-3 items-center self-stretch border rounded-lg border-border-neutral-default">
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
                                        placeholder="Tìm kiếm sản phẩm"
                                    />
                                </div>
                            </div>
                            <img src="/icons/line.svg" alt="icon-statistics" />
                            <div
                                className="flex p-[10px] justify-center items-center gap-2 border rounded-lg border-border-neutral-default cursor-pointer"
                                // onClick={() => setOpenFillter(!openFillter)}
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
                    {selectedCustomer.length == 0 ? (
                        <div
                            className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-background-brand-default hover:bg-background-brand-hover cursor-pointer"
                            onClick={() => {
                                handleNavigation("/customer/create");
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
                            className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-background-negative-default hover:bg-background-negative-hover cursor-pointer"
                            onClick={() => {
                                deletedCustomer();
                            }}
                        >
                            <h1 className="text-center font-semibold text-sm text-text-white">
                                Xóa ({selectedCustomer.length})
                            </h1>
                        </div>
                    )}
                </div>
            </div>
            {customersCount == 0 && !loading ? (
                <div className="flex flex-col items-center justify-center w-full mt-4">
                    <h1 className="text-base font-medium text-text-negative">
                        Chưa có khách hàng nào trên hệ thống!
                    </h1>
                    <h1
                        onClick={() => {
                            handleNavigation("/account/create");
                        }}
                        className="cursor-pointer text-text-info text-sm font-medium underline"
                    >
                        Thêm khách hàng ngay
                    </h1>
                </div>
            ) : (
                <div className="flex pb-6 flex-col items-start gap-3 self-stretch">
                    <div className="flex items-start self-stretch overflow-x-hidden overflow-y-auto  max-w-full">
                        <table className="w-full table-fixed bg-background-surface_default ">
                            <thead className="rounded-t-lg sticky top-0 z-10">
                                <tr className="bg-gray-50 text-text-gray text-sm font-medium">
                                    <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg w-[5%]">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            className="accent-background-brand-default border-2 border-gray-500 w-6 h-5"
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
                                {customers.length == 0 && !loading ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="py-6 text-center text-text-gray"
                                        >
                                            Không có khách hàng nào được tìm
                                            thấy
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer, index) => (
                                        <tr
                                            key={customer.customer_id}
                                            onDoubleClick={() => {
                                                handleNavigation(
                                                    `/customer/${customer.customer_id}`
                                                );
                                            }}
                                            className={`border-b border-border-neutral-subtle hover:bg-background-brand-subtle_hover ${
                                                selectedCustomer.includes(
                                                    customer.customer_id
                                                )
                                                    ? "bg-background-brand-subtle_hover"
                                                    : ""
                                            }`}
                                        >
                                            <td className="py-3 px-6 text-left">
                                                <input
                                                    type="checkbox"
                                                    // disabled={
                                                    //     localUser.role[0]
                                                    //         .role_level <= 4
                                                    //         ? true
                                                    //         : false
                                                    // }
                                                    checked={selectedCustomer.includes(
                                                        customer.customer_id
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            customer.customer_id
                                                        )
                                                    }
                                                    className="accent-background-brand-default border-2 w-6 h-5"
                                                />
                                            </td>
                                            <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-base text-text-primary">
                                                {startIndex + index}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {customer.image_name ? (
                                                    <img
                                                        src={`http://127.0.0.1:8000/uploads/${customer.image_name}`}
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
                                                {customer.full_name}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                {customer.phone_number}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                {customer.email}
                                            </td>
                                            <td className="py-3 px-6 text-left font-medium text-base text-text-primary whitespace-nowrap text-ellipsis overflow-hidden">
                                                {customer.address}
                                            </td>
                                            <td className="py-3 px-6 text-left whitespace-nowrap text-ellipsis">
                                                {handleCustomerStatus(
                                                    customer.status
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
                                    className="flex pl-3 pr-3 pt-2 pb-2 items-center gap-[10px] border rounded-lg border-border-neutral-subtle"
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
                <div className="fixed flex flex-col inset-0 bg-background-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                    <h1 className="text-sm font-medium text-text-white">
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
        </>
    );
}
