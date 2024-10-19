export default function CustomerInfo() {
    return (
        <div className="flex py-6 flex-col items-start gap-6 self-stretch">
            <PersonalInfo />
            <Address />
            <StatisticsActivity />
        </div>
    );
}

export function PersonalInfo() {
    return (
        <div
            name="personal-info"
            className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-x-gray-200"
        >
            <h1 className="text-xl font-semibold text-[#171717]">
                Thông tin cá nhân
            </h1>
            <div
                name="col-1"
                className="flex justify-center items-start gap-4 self-stretch"
            >
                <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                    <h1 className="text-sm font-medium text-[#171717] flex flex-1 gap-0.5">
                        Tên khách hàng
                    </h1>
                    <div className="flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] bg-[#F5F5F5]">
                        <input
                            type="text"
                            value={"Bùi Kim Thanh"}
                            className="bg-[#F5F5F5]"
                        />
                        <div name="prefix"></div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                    <h1 className="text-sm font-medium text-[#171717]">
                        Giới tính
                    </h1>
                    <div className="flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] bg-[#F5F5F5]">
                        <input
                            type="text"
                            value={"Nam"}
                            className="bg-[#F5F5F5] flex flex-1 gap-0.5"
                        />
                        <div name="prefix"></div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                    <h1 className="text-sm font-medium text-[#171717]">
                        Ngày sinh
                    </h1>
                    <div className="flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] bg-[#F5F5F5]">
                        <input
                            type="text"
                            value={"12/05/2001"}
                            className="bg-[#F5F5F5] flex flex-1 gap-0.5"
                        />
                        <div name="prefix">
                            <img src="/icons/calendar.svg" alt="calendar" />
                        </div>
                    </div>
                </div>
            </div>
            <div
                name="col-2"
                className="flex justify-center items-start gap-4 self-stretch"
            >
                <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                    <h1 className="text-sm font-medium text-[#171717] flex flex-1 gap-0.5">
                        Email
                    </h1>
                    <div className="flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] bg-[#F5F5F5]">
                        <input
                            type="text"
                            value={"thanhbui12051@gmail.com"}
                            className="bg-[#F5F5F5]"
                        />
                        <div name="prefix"></div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                    <h1 className="text-sm font-medium text-[#171717]">
                        Số điện thoại
                    </h1>
                    <div className="flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] bg-[#F5F5F5]">
                        <input
                            type="text"
                            value={"Nam"}
                            className="bg-[#F5F5F5] flex flex-1 gap-0.5"
                        />
                        <div name="prefix"></div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                    <h1 className="text-sm font-medium text-[#171717]">
                        Trạng thái
                    </h1>
                    <div className="flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] ">
                        <input
                            type="text"
                            value={"Đang hoạt động"}
                            className=" flex flex-1 gap-0.5"
                            readOnly
                        />
                        <div name="prefix">
                            <img src="/icons/angle-down.svg" alt="calendar" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export function Address() {
    return (
        <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-gray-200">
            <h1 className="text-xl font-semibold text-[#171717]">Địa chỉ</h1>
            <div className="flex flex-col items-start gap-4 self-stretch">
                <div className="flex pb-3 justify-between items-center self-stretch border-b-[1px]">
                    <div className="flex gap-3 items-center">
                        <h1 className="text-base font-medium text-[#171717]">
                            22/18 Cô Giang, Phường 1, Quận 1, TP.HCM
                        </h1>
                        <div className="flex px-2.5 py-0.5 justify-center items-center gap-2.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF]">
                            <h1 className="text-sm font-medium text-[#2563EB]">
                                Địa chỉ mặc định
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-[#E5E5E5] bg-[#fff] cursor-pointer">
                        <img src="/icons/ellipsis.svg" alt="" />
                    </div>
                </div>
                <div className="flex pb-3 justify-between items-center self-stretch border-b-[1px]">
                    <div className="flex gap-3 items-center">
                        <h1 className="text-base font-medium text-[#171717]">
                            984 Huỳnh Tấn Phát, Phường Phú Mỹ, Quận 7, TP.HCM
                        </h1>
                        {/* <div className="flex px-2.5 py-0.5 justify-center items-center gap-2.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF]">
                            <h1 className="text-sm font-medium text-[#2563EB]">Địa chỉ mặc định</h1>
                        </div> */}
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-[#E5E5E5] bg-[#fff] cursor-pointer">
                        <img src="/icons/ellipsis.svg" alt="" />
                    </div>
                </div>
                <div className="flex py-2 cursor-pointer px-3 items-center justify-center gap-2 self-stretch bg-[#171717] rounded-lg w-[123px] h-8 hover:bg-gray-600">
                    <img src="/icons/plus.svg" alt="plus" />
                    <h1 className="text-xs font-semibold text-[#ffff]">
                        Thêm địa chỉ
                    </h1>
                </div>
            </div>
        </div>
    );
}
export function StatisticsActivity() {
    const times = [
        "20 - 0h",
        "16 - 20h",
        "12 - 16h",
        "8 - 12h",
        "4 - 8h",
        "0 - 4h",
    ];
    const acctivities = {
        customer_id: "CUS171024093244",
        activity_frequency: [
            {
                date: 1,
                time_slots: {
                    _04h: 2,
                    _48h: 2,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 5,
                    _200h: 1,
                },
            },
            {
                date: 2,
                time_slots: {
                    _04h: 1,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 5,
                    _200h: 5,
                },
            },
            {
                date: 3,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 3,
                    _200h: 2,
                },
            },
            {
                date: 4,
                time_slots: {
                    _04h: 5,
                    _48h: 5,
                    _812h: 2,
                    _1216h: 4,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 5,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 6,
                time_slots: {
                    _04h: 3,
                    _48h: 5,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 4,
                },
            },
            {
                date: 7,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 3,
                },
            },
            {
                date: 8,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 9,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 10,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 11,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 12,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 13,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 14,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 15,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 4,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 16,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 17,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 18,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 4,
                    _200h: 5,
                },
            },
            {
                date: 19,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 20,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 4,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 21,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 4,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 1,
                },
            },
            {
                date: 22,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 23,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 4,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 24,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 4,
                },
            },
            {
                date: 25,
                time_slots: {
                    _04h: 3,
                    _48h: 5,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 26,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },

            {
                date: 27,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 28,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 3,
                },
            },
            {
                date: 29,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
            {
                date: 31,
                time_slots: {
                    _04h: 3,
                    _48h: 1,
                    _812h: 2,
                    _1216h: 1,
                    _1620h: 2,
                    _200h: 5,
                },
            },
        ],
    };
    const getHeat = (frequency) => {
        let color = "";
        switch (frequency) {
            case 1:
                color = "#FFF7ED";
                break;
            case 2:
                color = "#FFEDD5";
                break;
            case 3:
                color = "#FED7AA";
                break;
            case 4:
                color = "#FDBA74";
                break;
            default:
                color = "#F97316";
        }
        return (
            <>
                <div className={`flex flex-1 w-6 h-6 rounded-md bg-[${color}]`}>
                    <h1 className="invisible">{1}</h1>
                </div>
            </>
        );
    };
    return (
        <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-gray-200">
            <h1 className="text-xl font-semibold text-[#171717]">
                Thống kê hoạt động
            </h1>
            <div name="statistics" className="flex items-center gap-6">
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-base font-medium text-[#A3A3A3]">
                        Thời gian hoạt động
                    </h1>
                    <div className="flex items-center gap-2 self-stretch">
                        <div className="flex items-center gap-0.5">
                            <span className="text-2xl font-semibold">250</span>
                            <span className="text-2xl font-semibold">Giờ</span>
                        </div>
                        <div className="flex items-center justify-center gap-2.5 border border-b-[#BBF7D0] bg-[#F0FDF4] rounded-full">
                            <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                                <img
                                    src="/icons/arrow-trend-up.svg"
                                    alt="arrow-trend-up"
                                />
                                <h1 className="text-[#16A34A] font-medium text-sm">
                                    100 %
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-base font-medium text-[#A3A3A3]">
                        Chi tiêu trung bình
                    </h1>
                    <div className="flex items-center gap-2 self-stretch">
                        <div className="flex items-center gap-0.5">
                            <span className="text-2xl font-semibold">250</span>
                            <span className="text-2xl font-semibold">
                                Triệu
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-2.5 border border-b-[#BBF7D0] bg-[#F0FDF4] rounded-full">
                            <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                                <img
                                    src="/icons/arrow-trend-up.svg"
                                    alt="arrow-trend-up"
                                />
                                <h1 className="text-[#16A34A] font-medium text-sm">
                                    100 %
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                name="sta_chart"
                className="flex items-start gap-2 self-stretch"
            >
                <div name="time" className="flex flex-col items-start gap-2">
                    {times.map((time, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-center items-start self-stretch"
                        >
                            <h1 className="text-sm font-medium text-[#A3A3A3]">
                                {time}
                            </h1>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-start gap-2 flex-1">
                    <div
                        name="chart"
                        className="flex items-center gap-2  self-stretch"
                    >
                        {acctivities.activity_frequency.map((acc, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-center items-center gap-1 flex-1 self-stretch"
                            >
                                {getHeat(acc.time_slots._200h)}
                                {getHeat(acc.time_slots._1620h)}
                                {getHeat(acc.time_slots._1216h)}
                                {getHeat(acc.time_slots._812h)}
                                {getHeat(acc.time_slots._48h)}
                                {getHeat(acc.time_slots._04h)}
                                {/* <h1 className="text-xs">
                                    {acc.time_slots._1620h}
                                </h1>
                                <h1 className="text-xs">
                                    {acc.time_slots._1620h}
                                </h1>
                                <h1 className="text-xs">
                                    {acc.time_slots._1216h}
                                </h1>
                                <h1 className="text-xs">
                                    {acc.time_slots._812h}
                                </h1>
                                <h1 className="text-xs">
                                    {acc.time_slots._48h}
                                </h1> */}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 self-stretch">
                        {acctivities.activity_frequency.map((acc, index) => (
                            <div
                                key={"date" + index}
                                className="flex flex-col justify-center items-center flex-1"
                            >
                                <h1 className="text-sm font-medium text-[#A3A3A3]">
                                    {acc.date}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-2 self-stretch">
                <h1 className="text-base font-medium text-[#171717]">Thấp</h1>
                <div className="flex gap-1 items-center">
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-[#FFF7ED]`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-[#FFEDD5]`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-[#FED7AA]`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>                    
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-[#FDBA74]`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-[#F97316]`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                </div>

                <h1 className="text-base font-medium text-[#171717]">Cao</h1>
            </div>
        </div>
    );
}
