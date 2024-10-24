import { useEffect, useState, useRef } from "react";
import CustomerInfo from "./Customer_info/customer_info";
import CustomerActivityHistory from "./Customer_activity_history/customer_activity_history";
import CustomerOrders from "./Customer_order/customer_order";
import axiosClient from "../../../../axiosClient";
import { useParams } from "react-router-dom";
import Skeleton from "../../../../components/skeleton";
export default function CustomerDetail() {
    const personalInfoRef = useRef(); 
    //get account_id
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("info");
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const tabs = [
        {
            id: "info",
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 0C18.6094 0 24 5.39062 24 12C24 18.6562 18.6094 24 12 24C5.34375 24 0 18.6562 0 12C0 5.39062 5.34375 0 12 0ZM12 6C10.125 6 8.625 7.54688 8.625 9.375C8.625 11.25 10.125 12.75 12 12.75C13.8281 12.75 15.375 11.25 15.375 9.375C15.375 7.54688 13.8281 6 12 6ZM12 21C14.4375 21 16.6875 20.0156 18.3281 18.375C17.5781 16.4062 15.7031 15 13.5 15H10.5C8.25 15 6.375 16.4062 5.625 18.375C7.26562 20.0156 9.51562 21 12 21Z" />
                </svg>
            ),
            label: "Thông tin khách hàng",
        },
        {
            id: "orders",
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 18 21"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M4.625 6.75V4.875C4.625 2.49219 6.57812 0.5 9 0.5C11.3828 0.5 13.375 2.49219 13.375 4.875V6.75H15.875C16.8906 6.75 17.75 7.60938 17.75 8.625V16.75C17.75 18.8203 16.0703 20.5 14 20.5H4C1.89062 20.5 0.25 18.8203 0.25 16.75V8.625C0.25 7.60938 1.07031 6.75 2.125 6.75H4.625ZM6.5 6.75H11.5V4.875C11.5 3.50781 10.3672 2.375 9 2.375C7.59375 2.375 6.5 3.50781 6.5 4.875V6.75ZM2.125 8.625V16.75C2.125 17.8047 2.94531 18.625 4 18.625H14C15.0156 18.625 15.875 17.8047 15.875 16.75V8.625H13.375V10.8125C13.375 11.3594 12.9453 11.75 12.4375 11.75C11.8906 11.75 11.5 11.3594 11.5 10.8125V8.625H6.5V10.8125C6.5 11.3594 6.07031 11.75 5.5625 11.75C5.01562 11.75 4.625 11.3594 4.625 10.8125V8.625H2.125Z" />
                </svg>
            ),
            label: "Đơn hàng",
        },
        {
            id: "history",
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M21 7.5C22.6406 7.5 24 8.85938 24 10.5V21C24 22.6875 22.6406 24 21 24H3C1.3125 24 0 22.6875 0 21V10.5C0 8.85938 1.3125 7.5 3 7.5H21ZM21 9.75H3C2.57812 9.75 2.25 10.125 2.25 10.5V21C2.25 21.4219 2.57812 21.75 3 21.75H21C21.375 21.75 21.75 21.4219 21.75 21V10.5C21.75 10.125 21.375 9.75 21 9.75ZM20.625 3.75C21.2344 3.75 21.75 4.26562 21.75 4.875C21.75 5.53125 21.2344 6 20.625 6H3.375C2.71875 6 2.25 5.53125 2.25 4.875C2.25 4.26562 2.71875 3.75 3.375 3.75H20.625ZM18.375 0C18.9844 0 19.5 0.515625 19.5 1.125C19.5 1.78125 18.9844 2.25 18.375 2.25H5.625C4.96875 2.25 4.5 1.78125 4.5 1.125C4.5 0.515625 4.96875 0 5.625 0H18.375Z" />
                </svg>
            ),
            label: "Lịch sử hoạt động",
        },
    ];
    const [allowUpdate] = useState(true);
    //set open update button
    const [openUpdateButton, setOpenUpdateButton] = useState(false);
    useEffect(() => {
        getCustomerById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getCustomerById = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(
                `customer/get-customer-by-id/${id}`
            );
            if (response.status === 200) {
                const customer = response.data.data;
                setCustomer(customer);
            }
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        } finally {
            setLoading(false);
        }
    };
    const getTapSelect = () => {
        switch (activeTab) {
            case "info":
                return (
                    <CustomerInfo
                        customer={customer}
                        openUpdateButton={openUpdateButton}
                        onCloseUpdate={setOpenUpdateButton}
                        ref={personalInfoRef}
                    />
                );
            case "orders":
                return <CustomerOrders customer={customer} />;
            default:
                return <CustomerActivityHistory customer={customer} />;
        }
    };
    const getLodingHeader = () => {
        return (
            <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 self-stretch">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-6 w-24" />
            </div>
        );
    };
    const getCustomerClass = (cla) => {
        switch (cla) {
            case "None":
                return "Hạng thành viên";
            case "Bronze":
                return "Hạng đồng";
            case "Silver":
                return "Hạng bạc";
            case "Gold":
                return "Hạng thành viên";
            default:
                return "Hạng kim cương";
        }
    };
    const handleSubmit = () => {
        if (personalInfoRef.current) {
          personalInfoRef.current.submitForm(); // Gọi phương thức submit từ PersonalInfo
        }
    };
    
    return (
        <div className="flex flex-col items-center self-stretch px-6 overflow-y-auto overflow-x-hidden">
            <div
                name="customer-header"
                className="flex py-6 justify-between items-start self-stretch"
            >
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="animate-spin border-t-4 border-orange-600 border-solid rounded-full w-16 h-16"></div>
                    ) : (
                        <img
                            src={`http://127.0.0.1:8000/uploads/${
                                customer != null && customer.image_name
                            }`}
                            alt=""
                            className="rounded-full w-16 h-16"
                        />
                    )}
                    {loading ? (
                        getLodingHeader()
                    ) : (
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2 self-stretch">
                                <h1 className="font-semibold text-2xl">
                                    {customer != null && customer.full_name}
                                </h1>

                                <div className="flex py-1 pl-2 pr-2.5 justify-center items-center gap-2.5 border border-[#FEF08A] rounded-full bg-[#FEFCE8]">
                                    <img
                                        src="/icons/crown.svg"
                                        alt="crown"
                                        className="w-4 h-4"
                                    />
                                    <h1 className="text-sm font-medium text-yellow-500">
                                        {getCustomerClass(
                                            customer != null &&
                                                customer.customer_class
                                        )}
                                    </h1>
                                </div>
                            </div>
                            <h1 className="text-base font-medium text-[#A3A3A3]">
                                {customer != null && customer.customer_id}
                            </h1>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {openUpdateButton ? (
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => {
                                handleSubmit();
                                //setOpenUpdateButton(false);
                            }}
                        >
                            <div
                                className={`flex py-2 px-4 h-10 justify-center items-center gap-2 self-stretch ${
                                    allowUpdate
                                        ? "bg-[#EA580C] hover:bg-[#C2410C]"
                                        : "bg-orange-400"
                                }   rounded-lg `}
                            >
                                <img
                                    src="/icons/save.svg"
                                    alt="save"
                                    className="flex w-5 h-5 flex-col justify-center"
                                />
                                <h1 className="text-sm font-semibold text-[#fff]">
                                    Lưu
                                </h1>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setOpenUpdateButton(true)}
                            className="flex cursor-pointer px-4 py-2 flex-col items-center gap-2 justify-center self-stretch border border-[#E5E5E5] rounded-lg bg-[#ffff] hover:bg-gray-200"
                        >
                            <h1 className="text-sm font-semibold text-[#171717]">
                                Chỉnh sửa thông tin
                            </h1>
                        </div>
                    )}
                    <img
                        src="/icons/dots.svg"
                        alt="dots"
                        className="cursor-pointer"
                    />
                </div>
            </div>
            <div
                name="tab-bar"
                className="flex items-center gap-6 self-stretch border-b-2 border-gray-300"
            >
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex py-3 items-center gap-2 cursor-pointer border-b-2 ${
                            activeTab === tab.id
                                ? "border-black"
                                : "border-transparent"
                        } transition-all duration-300`}
                    >
                        <div
                            className={`${
                                activeTab === tab.id
                                    ? "text-black"
                                    : "text-gray-400"
                            } transition-colors duration-300`}
                        >
                            {tab.icon}
                        </div>
                        <h1
                            className={`text-base font-medium ${
                                activeTab === tab.id
                                    ? "text-black"
                                    : "text-gray-500"
                            } transition-colors duration-300`}
                        >
                            {tab.label}
                        </h1>
                    </div>
                ))}
            </div>
            <div className="flex py-6 flex-col items-start gap-6 self-stretch">
                {customer == null ? <InfoLoading /> : getTapSelect()}
            </div>
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                    <h1 className="text-sm font-medium text-white">
                        Đang tải thông tin khách hàng
                    </h1>
                </div>
            )}
        </div>
    );
}

export function InfoLoading() {
    return (
        <div className="flex py-6 flex-col items-start gap-6 self-stretch">
            <div
                name="personal-info"
                className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-x-gray-200"
            >
                <Skeleton className="h-7 w-24" />
                <div
                    name="col-1"
                    className="flex justify-center items-start gap-4 self-stretch"
                >
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div
                    name="col-2"
                    className="flex justify-center items-start gap-4 self-stretch"
                >
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
            <div
                name="personal-info"
                className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-x-gray-200"
            >
                <Skeleton className="h-7 w-24" />
                <div
                    name="col-1"
                    className="flex justify-center items-start gap-4 self-stretch"
                >
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div
                    name="col-2"
                    className="flex justify-center items-start gap-4 self-stretch"
                >
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
