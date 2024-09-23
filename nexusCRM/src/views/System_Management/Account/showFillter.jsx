// eslint-disable-next-line react/prop-types
export default function ShowFillter({ onData, onCloseFillter }) {
    const getData = (val) => {
        onData(val);
    };

    const handleCloseFillter = (val) => {
        onCloseFillter(val);
    };
    return (
        <div className="absolute fillter flex flex-col p-3 items-start gap-2 border rounded-xl bg-[#FFF] shadow-[0px 4px 8px 0px] ">
            <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-neutral-100">
                            <div className="flex flex-col items-start gap-1.5 self-stretch">
                                <div className="flex px-3 py-2 items-center gap-2 self-stretch">
                                    {/* <input
                                        type="text"
                                        className="flex items-center gap-0.5 flex-1 font-normal text-base text-gray-900"
                                    /> */}
                                    <div className="w-[180px] min-w-0 flex items-center">
                                        <h1 className="font-normal text-base text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            Tạo vào
                                        </h1>
                                    </div>

                                    <div className="flex w-4 h-5 flex-col justify-center items-center gap-2.5">
                                        <img
                                            src="/icons/statis_more_icon.svg"
                                            alt="icon-selected"
                                            className={`flex flec-col justify-center w-5 h-5 rotate-90 cursor-pointer`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-40 h-auto flex-col justify-center items-start gap-[10px] border rounded-lg border-neutral-100">
                            <div className="flex flex-col items-start gap-1.5 self-stretch">
                                <div className="flex px-3 py-2 items-center gap-2 self-stretch min-w-[0]">
                                    {/* <input
                                        type="text"
                                        className="flex items-center gap-0.5 flex-1 font-normal text-base text-gray-900"
                                    /> */}
                                    <h1 className="font-normal text-base text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                        Khoảng
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
                                            12/05/2001
                                        </h1>
                                    </div>

                                    <div className="flex w-5 h-5 flex-col justify-center items-center gap-2.5 ">
                                        <img
                                            src="/icons/calendar.svg"
                                            alt="icon-selected"
                                            className={`flex flec-col justify-center w-5 h-5 rotate-90 cursor-pointer `}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2.5 w-4 h-4 cursor-pointer">
                        <img
                            src="/icons/xmark.svg"
                            alt="delete-x"
                            className={`flex flec-col justify-center`}
                        />
                    </div>
                </div>
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
                        onClick={() => {}}
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
