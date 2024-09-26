/* eslint-disable react/prop-types */
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { format } from "date-fns";
// eslint-disable-next-line no-unused-vars
export default function ShowFillter({
    onData,
    onCloseFillter,
    listFillter,
    listAdmin,
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
    // const getData = (val) => {
    //     onData(val);
    // };

    const handleCloseFillter = (val) => {
        onCloseFillter(val);
    };

    return (
        <div className="absolute fillter flex flex-col p-3 items-start gap-2 border rounded-xl bg-[#FFF] shadow-[0px 4px 8px 0px] ">
            <div className="flex flex-col items-start gap-2 relative">
                {listFillter.map((fillter, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-neutral-100">
                                <div className="flex flex-col items-start gap-1.5 self-stretch">
                                    <div className="flex px-3 py-2 items-center gap-2 self-stretch">
                                        <div className="w-[180px] min-w-0 flex items-center">
                                            <h1 className="font-normal text-base text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
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
                                            <img
                                                src="/icons/statis_more_icon.svg"
                                                alt="icon-selected"
                                                className={`flex flec-col justify-center w-5 h-5 rotate-90 cursor-pointer`}
                                            />
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
                            <div className="flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-neutral-100">
                                <div className="flex flex-col items-start gap-1.5 self-stretch">
                                    <div className="flex px-3 py-2 items-center gap-2 self-stretch min-w-[0]">
                                        {/* <input
                                        type="text"
                                        className="flex items-center gap-0.5 flex-1 font-normal text-base text-gray-900"
                                    /> */}
                                        <h1 className="font-normal text-base text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {getSubTitileSearchBy(fillter.type)}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-neutral-100">
                                <div className="flex flex-col items-start gap-1.5 self-stretch">
                                    <div className="flex px-3 py-2 items-center gap-2 self-stretch">
                                        {/* <input
                                        type="text"
                                        className="flex items-center gap-0.5 flex-1 font-normal text-base text-gray-900"
                                    /> */}
                                        <div className="w-[180px] min-w-0 flex items-center">
                                            <h1 className="font-normal text-base text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
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
                                                    <img
                                                        src="/icons/calendar.svg"
                                                        alt="icon-calendar"
                                                        className={`flex flec-col justify-center w-5 h-5 rotate-90 cursor-pointer `}
                                                    />
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
                    <h1 className="font-semibold text-sm text-orange-600">
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
                        className="flex h-32 py-2 px-3 justify-center items-center gap-2 self-stretch border rounded-lg border-gray-100 bg-white cursor-pointer"
                    >
                        <h1 className="text-center font-semibold text-xs text-[#171717]">
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
                            handleCloseFillter(false);
                        }}
                        className="flex h-32 py-2 px-3 justify-center items-center gap-2 self-stretch rounded-lg bg-[#171717] cursor-pointer"
                    >
                        <h1 className="text-center font-semibold text-xs text-[#FFF]">
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
        <div className="absolute flex flex-col  gap-3 items-center bg-gray-50 z-[100] top-9 w-40  rounded-lg">
            {listItem.map((item) => (
                <div
                    key={item}
                    className="flex justify-center items-center gap-2 hover:bg-gray-100 p-2 cursor-pointer w-full"
                    onClick={() => {
                        callbackOpen(false);
                        callbackData(item);
                    }}
                >
                    <h1 className="text-base font-medium">{item}</h1>
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
        <div className="absolute flex flex-col  gap-3 items-center bg-gray-50 z-[100] top-[5.5rem] w-40 max-h-40 rounded-lg overflow-y-auto">
            {listItem.map((item) => (
                <div
                    key={item.account_id}
                    className="flex justify-center items-center gap-2 hover:bg-gray-100 p-2 cursor-pointer w-full"
                    onClick={() => {
                        callbackAminOpen(false);
                        callbackAdminData(item.username);
                        callbackIdAccount(item.account_id);
                    }}
                >
                    <h1 className="text-base font-medium">{item.username}</h1>
                </div>
            ))}
        </div>
    );
}
