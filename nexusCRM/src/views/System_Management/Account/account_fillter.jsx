/* eslint-disable react/prop-types */
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

export default function AccountFillter({
    onData,
    onCloseFillter,
    listFillter,
    listAdmin,
    onSubmit,
}) {
    const timeFillter = listFillter.find((filter) => filter.type === "time");
    const roleFillter = listFillter.find((fillter) => fillter.type === "role");
    //get list Role
    const [listRole] = useState(roleFillter ? roleFillter.searchBy : []);
    const [listRoleItem] = useState(listRole[0]);
    //get list time
    const [listTime] = useState(timeFillter ? timeFillter.searchBy : []);
    const [listTimeItem, setTimeItem] = useState(listTime[0]);
    const [openTimeItem, setOpenTimeItem] = useState(false);
    const [openAdminItem, setOpenAdminItem] = useState(false);
    const [id, setAdminId] = useState(
        listAdmin != null ? listAdmin[0].account_id : ""
    );
    const [itemAdmin, setItemAdmin] = useState(
        listAdmin != null ? listAdmin[0].username : ""
    );

    const date = new Date(
        timeFillter.time.split("/")[2],
        timeFillter.time.split("/")[1] - 1,
        timeFillter.time.split("/")[0]
    );
    //set date in datepicker
    const [startDate, setStartDate] = useState(date);
    const [endDate, setEndDate] = useState(date);
    const [showDatePicker, setShowDatePicker] = useState(false);
    //call back data

    const callbackIdAccount = (val) => {
        setAdminId(val);
    };
    const callbackOpen = (val) => {
        setOpenTimeItem(val);
    };
    const callbackData = (val) => {
        setTimeItem(val);
    };
    const callbackAdminOpen = (val) => {
        setOpenAdminItem(val);
    };
    const callbackAdminData = (val) => {
        setItemAdmin(val);
    };
    const getTitileSearchBy = (by) => {
        switch (by) {
            case "time":
                return "Tạo vào";
            case "role":
                return "Tạo bởi";
            default:
                "Không xác định";
        }
    };
    const getSubTitileSearchBy = (by) => {
        switch (by) {
            case "time":
                return listTimeItem;
            case "role":
                return listRoleItem;
            default:
                "Không xác định";
        }
    };
    const getThirdTitleSearchBy = (by) => {
        switch (by) {
            case "time": {
                if (timeFillter) {
                    if (listTimeItem === "Khoảng") {
                        return (
                            format(startDate, "dd/MM/yyyy") +
                            " - " +
                            format(endDate, "dd/MM/yyyy")
                        );
                    } else {
                        return format(startDate, "dd/MM/yyyy");
                    }
                } else {
                    return "";
                }
            }
            case "role":
                return itemAdmin;
            default:
                "Không xác định";
        }
    };
    const handleCloseFillter = (val) => {
        onCloseFillter(val);
    };
    const handleSubmit = (val) => {
        onSubmit(val);
    };
    return (
        <div className="absolute fillter flex flex-col p-3 items-start gap-2 border rounded-xl bg-background-surface_default dark:bg-background-neutral-hover shadow-[0px 4px 8px 0px] ">
            <div className="flex flex-col items-start gap-2 relative">
                {listFillter.map((fillter, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-border-neutral-subtle_hover">
                                <div className="flex flex-col items-start gap-1.5 self-stretch">
                                    <div className="flex px-3 py-2 items-center gap-2 self-stretch">
                                        <div className="w-[180px] min-w-0 flex items-center">
                                            <h1 className="font-normal text-base text-text-primary dark:text-text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                                {getTitileSearchBy(
                                                    fillter.type
                                                )}
                                            </h1>
                                        </div>

                                        <div
                                            className="flex w-4 h-5 flex-col justify-center items-center gap-2.5"
                                            onClick={() => {
                                                fillter.type === "time" &&
                                                    setOpenTimeItem(
                                                        !openTimeItem
                                                    );
                                                fillter.type === "role" &&
                                                    setOpenAdminItem(
                                                        !openAdminItem
                                                    );
                                            }}
                                        >
                                            <svg
                                                viewBox="0 0 9 15"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-5 h-5 rotate-90 cursor-pointer text-text-primary dark:text-text-white"
                                            >
                                                <path
                                                    d="M2.47656 0.9375L8.0625 6.875C8.21875 7.07031 8.33594 7.30469 8.33594 7.5C8.33594 7.73438 8.21875 7.96875 8.0625 8.16406L2.47656 14.1016C2.125 14.4922 1.53906 14.4922 1.14844 14.1406C0.757812 13.7891 0.757812 13.2031 1.10938 12.8125L6.10938 7.5L1.10938 2.22656C0.757812 1.83594 0.757812 1.25 1.14844 0.898438C1.53906 0.546875 2.125 0.546875 2.47656 0.9375Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {openTimeItem && (
                                <ShowListTimeItem
                                    listItem={listTime}
                                    callbackOpen={callbackOpen}
                                    callbackData={callbackData}
                                />
                            )}
                            {openAdminItem && (
                                <ShowListAdminItem
                                    listItem={listAdmin}
                                    callbackAminOpen={callbackAdminOpen}
                                    callbackAdminData={callbackAdminData}
                                    callbackIdAccount={callbackIdAccount}
                                />
                            )}
                            <div className="flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-border-neutral-subtle_hover">
                                <div className="flex flex-col items-start gap-1.5 self-stretch">
                                    <div className="flex px-3 py-2 items-center gap-2 self-stretch min-w-[0]">
                                        <h1 className="font-normal text-base text-text-primary dark:text-text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                            {getSubTitileSearchBy(fillter.type)}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-border-neutral-subtle_hover">
                                <div className="flex flex-col items-start gap-1.5 self-stretch">
                                    <div className="flex px-3 py-2 items-center gap-2 self-stretch">
                                        <div className="w-[180px] min-w-0 flex items-center">
                                            <h1 className="font-normal text-base text-text-primary dark:text-text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                                {getThirdTitleSearchBy(
                                                    fillter.type
                                                )}
                                            </h1>
                                        </div>
                                        {fillter.type === "time" && (
                                            <div className="relative">
                                                <div
                                                    className="flex w-5 h-5 flex-col justify-center items-center gap-2.5 "
                                                    onClick={() =>
                                                        setShowDatePicker(
                                                            !showDatePicker
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        viewBox="0 0 20 21"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-5 h-5 cursor-pointer text-text-primary dark:text-text-white"
                                                    >
                                                        <path
                                                            d="M7.1875 3H12.8125V1.4375C12.8125 0.929688 13.2031 0.5 13.75 0.5C14.2578 0.5 14.6875 0.929688 14.6875 1.4375V3H16.25C17.6172 3 18.75 4.13281 18.75 5.5V18C18.75 19.4062 17.6172 20.5 16.25 20.5H3.75C2.34375 20.5 1.25 19.4062 1.25 18V5.5C1.25 4.13281 2.34375 3 3.75 3H5.3125V1.4375C5.3125 0.929688 5.70312 0.5 6.25 0.5C6.75781 0.5 7.1875 0.929688 7.1875 1.4375V3ZM3.125 18C3.125 18.3516 3.39844 18.625 3.75 18.625H16.25C16.5625 18.625 16.875 18.3516 16.875 18V8H3.125V18Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </div>
                                                {showDatePicker && (
                                                    <div className="absolute top-8 -right-3 z-100">
                                                        {listTimeItem ===
                                                        "Khoảng" ? (
                                                            <DatePicker
                                                                selectsRange
                                                                startDate={
                                                                    startDate
                                                                }
                                                                endDate={
                                                                    endDate
                                                                }
                                                                onChange={(
                                                                    date
                                                                ) => {
                                                                    if (
                                                                        Array.isArray(
                                                                            date
                                                                        )
                                                                    ) {
                                                                        setStartDate(
                                                                            date[0]
                                                                        ); // Cập nhật startDate
                                                                        setEndDate(
                                                                            date[1]
                                                                        ); // Cập nhật endDate
                                                                    } else {
                                                                        setStartDate(
                                                                            date
                                                                        ); // Nếu chỉ có một ngày được chọn
                                                                    }
                                                                }}
                                                                inline
                                                                locale={vi}
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                            />
                                                        ) : (
                                                            <DatePicker
                                                                selected={
                                                                    startDate
                                                                }
                                                                onChange={(
                                                                    date
                                                                ) => {
                                                                    setStartDate(
                                                                        date
                                                                    );
                                                                }}
                                                                inline
                                                                locale={vi}
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex flex-col justify-center items-center gap-2.5 w-4 h-4 cursor-pointer">
                            <img
                                src="/icons/xmark.svg"
                                alt="delete-x"
                                className={`flex flec-col justify-center`}
                            />
                        </div> */}
                    </div>
                ))}
            </div>
            <div className="flex py-2 flex-col items-start gap-2.5 w-[88px]">
                <div className="flex justify-center items-center self-stretch gap-y-0.5 cursor-pointer">
                    <img
                        src="/icons/addNewFillterItem.svg"
                        alt="icon-addnew-fillter-item"
                        className=""
                    />
                    <h1 className="font-semibold text-sm text-text-brand">
                        Thêm mới
                    </h1>
                </div>
            </div>
            <div className="flex flex-col items-start self-stretch">
                <img src="/images/line.png" alt="line" />
            </div>
            <div className="flex justify-end items-center gap-3 self-stretch h-8">
                <div className="flex flex-col items-start gap-2.5 w-[90x] h-full">
                    <div
                        onClick={() => handleCloseFillter(false)}
                        className="flex h-32 py-2 px-3 justify-center items-center gap-2 self-stretch border rounded-lg border-border-neutral-subtle_hover bg-background-surface_default cursor-pointer hover:bg-background-neutral-subtle_hover"
                    >
                        <h1 className="text-center font-semibold text-xs text-text-primary">
                            Xóa bộ lọc
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-2.5 w-[120px] h-full">
                    <div
                        onClick={() => {
                            onData({
                                startD: format(startDate, "dd/MM/yyyy"),
                                endD:
                                    listTimeItem === "Khoảng"
                                        ? format(endDate, "dd/MM/yyyy")
                                        : null,
                                idAdmin: id,
                            });
                            handleSubmit(true);
                            handleCloseFillter(false);
                        }}
                        className="flex h-32 py-2 px-3 justify-center items-center gap-2 self-stretch rounded-lg bg-background-neutral-default cursor-pointer hover:bg-background-neutral-press"
                    >
                        <h1 className="text-center font-semibold text-xs text-text-white">
                            Áp dụng bộ lọc
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ShowListTimeItem({ listItem, callbackOpen, callbackData }) {
    return (
        <div className="absolute flex flex-col p-1  gap-3 items-center border bg-background-neutral-subtle dark:bg-background-neutral-default z-[100] top-11 w-40 rounded-lg">
            {listItem.map((item) => (
                <div
                    key={item}
                    className="flex justify-center items-center rounded-lg p-1 gap-2 hover:bg-background-neutral-subtle_hover dark:hover:bg-background-neutral-hover cursor-pointer w-full"
                    onClick={() => {
                        callbackOpen(false);
                        callbackData(item);
                    }}
                >
                    <h1 className="text-base font-medium text-text-primary dark:text-text-white">{item}</h1>
                </div>
            ))}
        </div>
    );
}
export function ShowListAdminItem({
    listItem,
    callbackAminOpen,
    callbackAdminData,
    callbackIdAccount,
}) {
    return (
        <div className="absolute flex flex-col p-1 gap-3 items-center border bg-background-neutral-subtle dark:bg-background-neutral-default z-[100] top-[6rem] w-40 max-h-40 rounded-lg overflow-y-auto">
            {listItem.map((item) => (
                <div
                    key={item.account_id}
                    className="flex justify-center items-center rounded-lg p-1 gap-2 hover:bg-background-neutral-subtle_hover dark:hover:bg-background-neutral-hover cursor-pointer w-full"
                    onClick={() => {
                        callbackAminOpen(false);
                        callbackAdminData(item.username);
                        callbackIdAccount(item.account_id);
                    }}
                >
                    <h1 className="text-base font-medium text-text-primary dark:text-text-white">{item.username}</h1>
                </div>
            ))}
        </div>
    );
}
