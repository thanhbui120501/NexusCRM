import { useEffect, useState, useRef } from "react";
import { vi } from "date-fns/locale";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import axiosClient from "../../../../axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { Validation } from "../../../../validation";
import AccountActivity from "./account_activity";

export default function AccountDetail() {
    //get local user
    const localUser = JSON.parse(localStorage.getItem("USER"));
    //set loading
    const [loading, setLoading] = useState(false);
    //account record
    const [accountRecord, setAccounRecord] = useState({});
    //get account_id
    const { id } = useParams();
    //set navigate
    const navigate = useNavigate();
    //set form ref
    const formRef = useRef(null);
    //set avartar display
    const [avatar, setAvatar] = useState("");
    const [imgFirst, setImgFirst] = useState("");
    //set image file
    const [image, setImage] = useState(null);
    //image error
    const [errorMessage, setErrorMessage] = useState("");
    //set user name
    const [username, setUsername] = useState("");
    //set password and hiden pasword
    const [password, setPassword] = useState("");
    const [isHidenPassword, setHidenPassword] = useState(true);
    //set fullname
    const [fullname, setFullname] = useState("");
    //set date of birth
    const [birthDay, setBirthDay] = useState("");
    const [openCalendar, setOpenCalendar] = useState(false);
    //set Role
    const [role, setRole] = useState([]);
    const [roleItem, setRoleItem] = useState({});
    //set email
    const [email, setEmail] = useState("");
    //set phone number
    const [phoneNumber, setPhoneNumber] = useState("");
    //account status
    const [status, setStatus] = useState({});
    const accountStatus = [
        {
            code: 1,
            sta: "Đang hoạt động",
            value: "true",
        },
        {
            code: 0,
            sta: "Ngưng hoạt động",
            value: "false",
        },
    ];
    //get list username, phone number and email to validate
    const [listEmail, getListEmail] = useState([]);
    const [listPhoneNumber, getListPhoneNumber] = useState([]);
    // Error states for validation
    const [errors, setErrors] = useState({});
    //Allow update
    const [allowUpdate, setAllowUpdate] = useState(true);
    //handlde date change
    const handleDateChange = (date) => {
        setBirthDay(date); // Cập nhật ngày sinh
        setOpenCalendar(false); // Đóng lịch sau khi chọn ngày
    };
    //handle when image was change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            if (file.size > 24 * 1024 * 1024) {
                setErrorMessage("Ảnh không quá 24MB");
                setAvatar(imgFirst);
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Hiển thị ảnh
                    setAvatar(reader.result);
                    setErrorMessage("");
                };
                reader.readAsDataURL(file);
            }
        }
    };

    //phone number input only number
    const handleKeyDown = (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
            e.preventDefault();
        }
    };
    //handle change
    const handleChange = (e) => {
        // Chỉ cho phép nhập tối đa 10 ký tự
        if (e.target.value.length <= 10) {
            setPhoneNumber(e.target.value)
        }
    };
    //get role
    useEffect(() => {
        getAccountById();
        getRoles();
        getListUsernameEmailPhoneNumber();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getRoles = async () => {
        try {
            const response = await axiosClient.get("/role/get-all-role");
            setRole(response.data.data);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    const getListUsernameEmailPhoneNumber = async () => {
        try {
            const response = await axiosClient.get(
                `/account/get-username-email-phone-except/${id}`
            );
            getListEmail(response.data.emails);
            getListPhoneNumber(response.data.phone_numbers);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    const getAccountById = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(
                `account/get-detail-account/${id}`
            );
            if (response.data.status_code === 200) {
                const account = response.data.data;
                setAccounRecord(account);
                setAvatar(account.image_name);
                setImgFirst(account.image_name);
                setUsername(account.username);
                setFullname(account.full_name);
                const dateParts = account.date_of_birth.split("-");
                setBirthDay(
                    new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                );
                setEmail(account.email);
                setPhoneNumber(account.phone_number);
                setRoleItem(account.role[0]);

                setStatus(account.status ? accountStatus[0] : accountStatus[1]);
                if (
                    localUser.role[0].role_level >= account.role[0].role_level
                ) {
                    setAllowUpdate(false);
                } else {
                    setAllowUpdate(true);
                }
            }
        } catch (err) {
            const response = err.response;
            console.log(response);
        } finally {
            setLoading(false);
        }
    };
    //set allow update

    //Submit form
    const onSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const validationErrors = Validation({
                username: username,
                password: password,
                fullname: fullname,
                birthDay: birthDay,
                email: email,
                phone: phoneNumber,
                listEmail: listEmail,
                listPhoneNumber: listPhoneNumber,
                type: "edit",
            });
            setErrors(validationErrors);
            if (!validationErrors.status) {
                toast.error("Vui lòng nhập đúng và đầy đủ thông tin", {
                    position: "top-right",
                    autoClose: 5000, // thời gian tự động đóng (mili giây)
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                });
                return;
            }
            const data = new FormData();
            //check password change?
            if (password != "" && password !== accountRecord.password) {
                data.append("password", password);
                data.append("password_confirm", password);
            }
            //check role change?
            roleItem.role_id !== accountRecord.role[0].role_id &&
                data.append("role_id", roleItem.role_id);
            //check fullname change?
            fullname !== accountRecord.full_name &&
                data.append("full_name", fullname);
            //image
            image != null && data.append("images", image);
            //check email change?
            email !== accountRecord.email && data.append("email", email);
            //check birthday change?
            let birtDayFormat = format(birthDay, "yyyy-MM-dd");
            birtDayFormat !== accountRecord.date_of_birth &&
                data.append("date_of_birth", format(birthDay, "yyyy-MM-dd"));
            //check phone number change?
            phoneNumber !== accountRecord.phone_number &&
                data.append("phone_number", phoneNumber);
            //check status change?
            (status.value.toLowerCase() === "true") !== accountRecord.status &&
                data.append("status", status.value);            

            const response = await axiosClient.post(
                `account/update-account/${id}`,
                data
            );

            if (response.status === 200) {
                toast.success("Cập nhật tài khoản thành công!", {
                    position: "top-right",
                    autoClose: 4000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    navigate("/account");
                }, 4000);
            }
            if (response.status === 204) {
                toast.info("Không có thây đổi nào!", {
                    position: "top-right",
                    autoClose: 4000, // thời gian tự động đóng (mili giây)
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                });
            }
            if (response.status === 400) {
                toast.error("Cập nhật thất bại!", {
                    position: "top-right",
                    autoClose: 4000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                });
            }
            //eslint-disable-next-line no-unused-vars
        } catch (err) {
            toast.error("Đã có lỗi xảy ra khi cập nhật tài khoản", {
                position: "top-right",
                autoClose: 4000, // thời gian tự động đóng (mili giây)
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
            });
        }
    };
    //HandleExternalSubmit
    const handleExternalSubmit = () => {
        formRef.current.dispatchEvent(new Event("submit", { bubbles: true }));
    };
    return (
        <>
            <ToastContainer />
            <div className="flex pl-6 pr-6 pb-6 pt-3 flex-col items-start gap-3 self-stretch">
                <div className="flex justify-between items-end self-stretch">
                    <div className="flex flex-col items-start gap-2 flex-1">
                        <h1 className="font-semibold text-3xl text-text-primary">
                            Chi tiết tài khoản
                        </h1>
                        <h1 className="font-medium text-base text-text-secondary">
                            Thông tin chi tiết tài khoản
                        </h1>
                        {!allowUpdate && (
                            <h1 className="font-medium text-base text-text-negative">
                                Bạn không thể thay đổi thông tin cho tài khoản
                                này
                            </h1>
                        )}
                    </div>
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={allowUpdate && handleExternalSubmit}
                    >
                        <div
                            className={`flex py-2 px-4 h-10 justify-center items-center gap-2 self-stretch ${
                                allowUpdate
                                    ? "bg-background-brand-default hover:bg-background-brand-hover"
                                    : "bg-background-brand-disable"
                            }   rounded-lg `}
                        >
                            <img
                                src="/icons/save.svg"
                                alt="save"
                                className="flex w-5 h-5 flex-col justify-center"
                            />
                            <h1 className="text-sm font-semibold text-text-white">
                                Lưu
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex px-6 pb-6 flex-col items-start gap-6 self-stretch">
                <form
                    ref={formRef}
                    className="flex p-6 flex-col items-start gap-3 self-stretch border rounded-xl border-border-neutral-default"
                    encType="multipart/form-data"
                    onSubmit={onSubmit}
                    autoComplete="off"
                >
                    <h1 className="text-xl font-semibold text-text-primary">
                        Thông tin tài khoản
                    </h1>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex w-[250px] flex-col items-start gap-2 ">
                            <div className="flex flex-col items-start gap-2.5 self-stretch">
                                <h1 className="font-medium text-sm text-text-primary">
                                    Ảnh đại diện
                                </h1>
                            </div>
                            <div className="flex items-center gap-4 self-stretch">
                                <div
                                    className={`flex ${
                                        avatar === "/icons/avatar_empty.svg" &&
                                        "p-6"
                                    } items-center gap-2.5 rounded-lg border ${
                                        errorMessage || errors.image
                                            ? "border-border-negative-default"
                                            : "border-border-neutral-default"
                                    }  border-dashed h-[68px] w-[68px]`}
                                >
                                    <div className="flex flex-col justify-center items-center gap-2.5 w-full h-full">
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-border-brand-default border-solid"></div>
                                        ) : (
                                            <img
                                                src={
                                                    image
                                                        ? avatar
                                                        : `http://127.0.0.1:8000/uploads/${avatar}`
                                                }
                                                alt="avatar_empty"
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.onerror = null; // Ngăn lặp vô hạn khi ảnh thay thế cũng lỗi
                                                    e.target.src = "https://dummyimage.com/150x150/cccccc/000000&text=N/A"; // Đường dẫn đến ảnh mặc định
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex flex-col items-start gap-2.5 rounded-lg cursor-pointer ${
                                            allowUpdate
                                                ? "bg-background-neutral-default hover:bg-background-neutral-hover"
                                                : "bg-background-neutral-disable"
                                        }  px-3 py-2 justify-center `}
                                        onClick={() =>
                                            allowUpdate &&
                                            document
                                                .getElementById("avatarInput")
                                                .click()
                                        }
                                    >
                                        <h1 className="font-semibold text-xs text-text-white">
                                            Tải ảnh
                                        </h1>
                                    </div>
                                    <input
                                        id="avatarInput"
                                        type="file"
                                        accept="image/jpeg, image/png, image/jpg, image/svg+xml"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }} // Hide input
                                    />
                                    <div
                                        className="flex flex-col items-start gap-2.5 rounded-lg cursor-pointer bg-background-surface_default px-3 py-2 justify-center border border-border-neutral-default"
                                        onClick={() => {
                                            setAvatar(imgFirst);
                                            setImage(null);
                                        }}
                                    >
                                        <h1 className="font-semibold text-xs text-text-primary">
                                            Xóa ảnh
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`flex flex-col items-start gap-2.5 self-stretch ${
                                    errorMessage || errors.image
                                        ? "visible"
                                        : "invisible"
                                }`}
                            >
                                <h1 className="font-medium text-sm text-text-negative">
                                    {errorMessage && errorMessage}
                                    {errors.image && errors.image}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-text-primary">
                                Tên tài khoản
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.username
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                }`}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
                                        readOnly
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Nhập tên tài khoản"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] ${
                                    errors.username ? "visible" : "invisible"
                                }`}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.username
                                        ? errors.username
                                        : "username"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-text-primary">
                                Mật khẩu
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.password
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                } `}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        name="password_input"
                                        id="password_input_filed"
                                        type={
                                            isHidenPassword
                                                ? "password"
                                                : "text"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Nhập mật khẩu"
                                        autoComplete="new-password"
                                        className="w-full"
                                    />
                                </div>
                                <img
                                    src={
                                        isHidenPassword
                                            ? "/icons/show_password.svg"
                                            : "/icons/hide_password.svg"
                                    }
                                    alt="hide_password"
                                    className="h-5 w-5"
                                    onClick={() =>
                                        setHidenPassword(!isHidenPassword)
                                    }
                                />
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] ${
                                    errors.password ? "visible" : "invisible"
                                }`}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.password
                                        ? errors.password
                                        : "password"}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-text-primary">
                                Tên nhân viên
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.fullname
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                } `}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        type="text"
                                        value={fullname}
                                        onChange={(e) =>
                                            setFullname(e.target.value)
                                        }
                                        placeholder="Nhập tên nhân viên"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] ${
                                    errors.fullname ? "visible" : "invisible"
                                }`}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.fullname
                                        ? errors.fullname
                                        : "fullname"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-text-primary">
                                Ngày sinh
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.birthDay
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                } relative`}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
                                        type="text"
                                        value={
                                            birthDay
                                                ? format(birthDay, "dd/MM/yyyy")
                                                : ""
                                        }
                                        readOnly
                                        placeholder="Chọn ngày sinh"
                                        className="w-full"
                                    />
                                </div>
                                <img
                                    src="/icons/calendar.svg"
                                    alt="hide_password"
                                    className="h-5 w-5 cursor-pointer"
                                    onClick={() =>
                                        allowUpdate &&
                                        setOpenCalendar(!openCalendar)
                                    }
                                />
                                {openCalendar && (
                                    <div className="absolute z-[100] top-8 right-8">
                                        <DatePicker
                                            selected={birthDay}
                                            onChange={handleDateChange}
                                            inline
                                            locale={vi}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                        />
                                    </div>
                                )}
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] ${
                                    errors.birthDay ? "visible" : "invisible"
                                }`}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.birthDay
                                        ? errors.birthDay
                                        : "birthday"}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-text-primary">
                                Chức vụ
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-border-neutral-default">
                                <div className="flex items-center gap-0.5 flex-1">
                                    <select
                                        disabled={!allowUpdate}
                                        className="w-full font-medium text-sm text-text-primary"
                                        value={roleItem.role_id}
                                        onChange={(e) => {
                                            const selectedRole = role.find(
                                                (r) =>
                                                    r.role_id === e.target.value
                                            );
                                            setRoleItem(selectedRole);
                                        }}
                                    >
                                        {role.map((option, index) => (
                                            option.status &&
                                            <option
                                                key={index}
                                                value={option.role_id}
                                            >
                                                {option.role_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] `}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    Mã chức vụ: {roleItem.role_id}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-text-primary">
                                Email
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.email
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                } `}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        type="text"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Nhập email"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] ${
                                    errors.email ? "visible" : "invisible"
                                }`}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.email ? errors.email : "username"}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-text-primary">
                                Số điện thoại
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-border-neutral-default">
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            handleChange(e)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] ${
                                    errors.phone ? "visible" : "invisible"
                                }`}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.phone ? errors.phone : "phone"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1 ">
                            <h1 className="font-medium text-sm text-text-primary">
                                Trạng thái
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-border-neutral-default">
                                <div className="flex items-center gap-0.5 flex-1">
                                    <select
                                        disabled={!allowUpdate}
                                        className="w-full font-medium text-sm text-text-primary"
                                        value={status.code}
                                        onChange={(e) => {
                                            const selectedStatus =
                                                accountStatus.find(
                                                    (s) =>
                                                        s.code ===
                                                        Number(e.target.value)
                                                );
                                            setStatus(selectedStatus);
                                        }}
                                    >
                                        {accountStatus.map((option, index) => (
                                            <option
                                                key={index}
                                                value={option.code}
                                            >
                                                {option.sta}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div
                                className={`flex justify-center items-center gap-2.5 max-w-[500px] invisible`}
                            >
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    Trạng thái
                                </h1>
                            </div>
                        </div>
                    </div>
                </form>
                <AccountActivity id={id} />
            </div>
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-background-black bg-opacity-50 z-10 items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                    <h1 className="text-sm font-medium text-text-white">
                        Đang tải thông tin
                    </h1>
                </div>
            )}
        </>
    );
}
