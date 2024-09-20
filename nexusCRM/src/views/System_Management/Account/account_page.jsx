import { useState, useEffect } from "react";
import ShowDataDropDown from "./showDataDropdown";
import axiosClient from "../../../axiosClient";
import DialogComponent from "../../../components/dialog";

export default function Account() {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [openDropDownData, setOpenDropDownData] = useState(false);
    const [showRowNumber, setShowRowNumber] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accecpt, setAccecpt] = useState(false);
    const [open, setOpen] = useState(false);
    //set value show dialog
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
    const handleCloseDropdow = () => {
        setOpenDropDownData(false);
    };
    const handleSeclectRowNumber = (row) => {
        setShowRowNumber(row);
    };

    const handldAccecptDeleted = (val) => {
        setAccecpt(val);
    };
    //fake user
    // const users = [
    //     {
    //         account_id: "AC150924031213",
    //         username: "thanh",
    //         email: "thanh@email.com",
    //         phone_number: null,
    //         full_name: "Bùi Kim Thanh",
    //         image_name: null,
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R150924031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: null,
    //         updated_at: null,
    //         status: true,
    //     },
    //     {
    //         account_id: "AC160924025305",
    //         username: "linh123",
    //         email: "linh@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Thị Linh",
    //         image_name: "Lwio9xcqYzGl5UjELcPrYnUb7nJqjhzB.png",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R150924031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-16 14:53:05",
    //         updated_at: "2024-09-16 14:53:05",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC190924015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R150924031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC190924015753",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R150924031052",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC193924015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R15092403105",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC130924015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R1509d4031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC19092d015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R1d0924031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC190s24015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R15s0924031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC190s24s015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R15092s031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC19092015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R150924031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC190924s15758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R15092403103s5",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC1909245015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R150924ss31055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    //     {
    //         account_id: "AC190929015758",
    //         username: "duy123",
    //         email: "duy123@gmail.com",
    //         phone_number: null,
    //         full_name: "Nguyễn Anh Duy",
    //         image_name: "DvUkSGZ1sAgtPbFt1q01yoqCdJg1OBZP.jpg",
    //         date_of_birth: null,
    //         role: [
    //             {
    //                 role_id: "R150124031055",
    //                 role_name: "Admin",
    //                 description: "abc",
    //                 create_at: null,
    //                 update_at: null,
    //                 status: true,
    //             },
    //         ],
    //         created_at: "2024-09-19 01:57:58",
    //         updated_at: "2024-09-19 01:57:58",
    //         status: true,
    //     },
    // ];

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
            const allUserIds = users.map((user) => user.account_id);
            setSelectedUsers(allUserIds); // Chọn tất cả
        }
        setIsAllSelected(!isAllSelected); // Đảo trạng thái isAllSelected
    };

    const getUsers = async () => {
        try {
            const data = new FormData();
            data.append("limit", showRowNumber);
            setLoading(true);
            const response = await axiosClient.post(
                "/account/get-all-account",
                data
            );

            setUsers(response.data.data);
            setLoading(false);
        } catch (err) {
            const response = err.response;
            setError(response.message);
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
            getUsers();
            setSelectedUsers([]);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    //get user by number row
    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showRowNumber]);
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;
    return (
        <div className="flex flex-col h-full items-start gap-3 justify-start self-stretch pl-6 pr-6">
            <div className="flex justify-between items-end self-stretch">
                <div className="flex flex-col flex-1 items-start gap-2">
                    <h1 className="self-stretch text-gray-900 font-semibold text-3xl">
                        Tài khoản
                    </h1>
                    <h1 className="self-stretch text-gray-400 font-medium text-base">
                        Quản lí tất cả tài khoản tại đây
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex pt-2 pb-2 pl-3 pr-3 items-center self-stretch border rounded-lg border-[#E5E5E5]">
                        <img
                            src="/icons/search.svg"
                            alt="icon-search"
                            className={`w-5 h-5 cursor-pointer`}
                            onClick={() => {}}
                        />
                        <div className="flex items-center gap-[2px] ml-2 flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài khoản"
                            />
                        </div>
                    </div>
                    <img src="/icons/line.svg" alt="icon-statistics" />
                    <div
                        className="flex p-[10px] justify-center items-center gap-2 border rounded-lg border-[#E5E5E5] cursor-pointer"
                        onClick={() => {}}
                    >
                        <img
                            src="/icons/sliders.svg"
                            alt="icon-sliders"
                            className="flex flex-col items-center w-5 h-5 "
                        />
                    </div>
                    {selectedUsers.length == 0 ? (
                        <div className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-orange-600 cursor-pointer onClick={()=>{}}">
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
                            className="flex h-10 pt-2 pb-2 pl-4 pr-4 justify-center items-center gap-2 self-stretch rounded-lg bg-[#DC2626] cursor-pointer onClick={()=>{}}"
                            onClick={() => {
                                // setValuesDialog({
                                //     ...dialog,
                                //     title: "Xóa tài khoản",
                                //     description:
                                //         "Bạn có chắc muốn xóa tài khoản này chứ?",
                                //     color: "text-red-600",
                                //     bgColor: "bg-red-600",
                                //     hoverColor: "hover:bg-red-500",
                                // });
                                // handleClickToOpen();
                                deletedUser();
                            }}
                        >
                            <h1 className="text-center font-semibold text-sm text-white">
                                Xóa ({selectedUsers.length})
                            </h1>
                        </div>
                    )}
                </div>
            </div>
            {loading ? (
                <div className="flex flex-1 justify-center items-center h-full w-full p-10">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex pb-6 pl-6 pr-6 flex-col items-start gap-3 self-stretch ">
                    <div className="flex items-start self-stretch  overflow-auto max-h-[400px]">
                        <table className="min-w-full bg-white ">
                            <thead className="rounded-t-lg sticky top-0 z-10">
                                <tr className="bg-gray-50 text-gray-500 text-sm font-medium">
                                    <th className="py-3 px-6 text-left rounded-tl-lg rounded-bl-lg">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            className="accent-[#EA580C] border-2 border-gray-500 w-6 h-5"
                                        />
                                    </th>
                                    <th className="py-3 px-6 text-left">#</th>
                                    <th className="py-3 px-6 text-left">
                                        Ảnh đại diện
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Tên tài khoản
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Tên nhân viên
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Số điện thoại
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Email
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Chức vụ
                                    </th>
                                    <th className="py-3 px-6 text-left rounded-tr-lg rounded-br-lg">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {users.map((user, index) => (
                                    <tr
                                        key={user.account_id}
                                        className={`border-b border-gray-200 hover:bg-orange-100 ${
                                            selectedUsers.includes(
                                                user.account_id
                                            )
                                                ? "bg-orange-100"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-3 px-6 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(
                                                    user.account_id
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        user.account_id
                                                    )
                                                }
                                                className="accent-[#EA580C] border-2 border-gray-500 w-6 h-5"
                                            />
                                        </td>
                                        <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-base text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {user.image_name ? (
                                                <img
                                                    src={`http://127.0.0.1:8000/uploads/${user.image_name}`}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-lg"
                                                />
                                            ) : (
                                                <img
                                                    src={`/images/avatar.png`}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-lg"
                                                />
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900">
                                            {user.username}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900">
                                            {user.full_name}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900">
                                            {user.phone_number}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium text-base text-gray-900">
                                            <ul>
                                                {user.role.map((r) => (
                                                    <li key={r.role_id}>
                                                        {r.role_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {user.status == 1 ? (
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
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>{" "}
                    </div>
                    <div className="flex justify-between items-center self-stretch">
                        <div className="flex items-start gap-3">
                            <div className="relative flex flex-col items-start gap-1">
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
                            {/* <div className="flex ">

                        </div> */}
                            <button className="flex px-3 py-2 justify-items-center gap-[10px] rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 active:text-white active:bg-gray-900 focus:text-white focus:bg-gray-900 disabled:pointer-events-none disabled:opacity-50">
                                Đầu tiên
                            </button>
                            <button
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
                            <button
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50"
                                type="button"
                            >
                                1
                            </button>
                            <button
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50"
                                type="button"
                            >
                                2
                            </button>
                            <button
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50"
                                type="button"
                            >
                                3
                            </button>
                            <button
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50"
                                type="button"
                            >
                                4
                            </button>
                            <div
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center text-center text-sm font-medium  text-gray-900"
                                type="text"
                            >
                                ...
                            </div>
                            <button
                                className="flex w-9 h-9 px-3 py-2 justify-items-center gap-[10px] items-center  rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 focus:text-white focus:bg-gray-900 active:text-white active:bg-gray-000 disabled:pointer-events-none disabled:opacity-50"
                                type="button"
                            >
                                5
                            </button>
                            <button
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
                            <button className="flex px-3 py-2 justify-items-center gap-[10px] rounded-lg text-center transition-all text-sm font-medium  text-gray-900 hover:text-white hover:bg-gray-900 active:text-white active:bg-gray-900 focus:text-white focus:bg-gray-900 disabled:pointer-events-none disabled:opacity-50">
                                Cuối cùng
                            </button>
                        </div>
                    </div>
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
