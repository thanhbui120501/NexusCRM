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
            setPhoneNumber(e.target.value);
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
                        <h1 className="font-semibold text-3xl text-text-primary dark:text-text-white">
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
                    className="flex p-6 flex-col items-start gap-3 self-stretch border rounded-xl border-border-neutral-default bg-background-surface_default dark:bg-background-neutral-hover"
                    encType="multipart/form-data"
                    onSubmit={onSubmit}
                    autoComplete="off"
                >
                    <h1 className="text-xl font-semibold text-text-primary dark:text-text-white">
                        Thông tin tài khoản
                    </h1>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex w-[250px] flex-col items-start gap-2 ">
                            <div className="flex flex-col items-start gap-2.5 self-stretch">
                                <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
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
                                                    e.target.src =
                                                        "https://dummyimage.com/150x150/cccccc/000000&text=N/A"; // Đường dẫn đến ảnh mặc định
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex flex-col items-start gap-2.5 rounded-lg ${
                                            allowUpdate
                                                ? "bg-background-neutral-default hover:bg-background-neutral-hover dark:hover:bg-background-neutral-press cursor-pointer "
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
                                    {image != null && (
                                        <div
                                            className="flex flex-col items-start gap-2.5 rounded-lg cursor-pointer bg-background-surface_default px-3 py-2 justify-center border border-border-neutral-default"
                                            onClick={() => {
                                                setAvatar(imgFirst);
                                                setImage(null);
                                            }}
                                        >
                                            <h1 className="font-semibold text-xs text-text-primary ">
                                                Xóa ảnh
                                            </h1>
                                        </div>
                                    )}
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Tên tài khoản
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default ${
                                    errors.username
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                }`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        readOnly
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Nhập tên tài khoản"
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Mật khẩu
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default ${
                                    errors.password
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                }`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        name="password_input"
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
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
                                    />
                                    <svg
                                        onClick={() => {
                                            setHidenPassword(!isHidenPassword);
                                        }}
                                        viewBox="0 0 24 19"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className="h-5 w-5 cursor-pointer text-text-primary dark:text-text-white"
                                    >
                                        <path
                                            d={
                                                isHidenPassword
                                                    ? "M6.35938 4.13281C8.11719 2.80469 10.3047 1.75 13 1.75C16.125 1.75 18.6641 3.19531 20.5 4.91406C22.3359 6.59375 23.5469 8.625 24.1328 10.0312C24.25 10.3438 24.25 10.6953 24.1328 11.0078C23.625 12.2578 22.5703 14.0547 21.0078 15.6172L25.1094 18.8594C25.5391 19.1719 25.6172 19.7578 25.2656 20.1484C24.9531 20.5781 24.3672 20.6562 23.9766 20.3047L0.851562 2.17969C0.421875 1.86719 0.34375 1.28125 0.695312 0.890625C1.00781 0.460938 1.59375 0.382812 1.98438 0.734375L6.35938 4.13281ZM7.88281 5.34375L9.67969 6.75C10.5781 5.96875 11.7109 5.5 13 5.5C15.7344 5.5 18 7.76562 18 10.5C18 11.3594 17.7656 12.1406 17.4141 12.8047L19.5234 14.4453C20.8516 13.1172 21.7891 11.5938 22.2969 10.5C21.75 9.32812 20.7344 7.6875 19.2109 6.28125C17.6094 4.79688 15.5391 3.625 13 3.625C11.0078 3.625 9.28906 4.32812 7.88281 5.34375ZM15.8906 11.6328C16.0469 11.2812 16.125 10.8906 16.125 10.5C16.125 8.78125 14.7188 7.375 13 7.375C12.9609 7.375 12.9219 7.375 12.8828 7.375C12.9609 7.60938 13 7.80469 13 8C13 8.42969 12.8828 8.78125 12.7266 9.13281L15.8906 11.6328ZM16.2812 16.7109L17.9219 18C16.4766 18.7812 14.8359 19.25 13 19.25C9.83594 19.25 7.29688 17.8438 5.46094 16.125C3.625 14.4062 2.41406 12.375 1.82812 11.0078C1.71094 10.6953 1.71094 10.3438 1.82812 10.0312C2.21875 9.13281 2.84375 8 3.74219 6.82812L5.1875 8C4.48438 8.89844 3.97656 9.79688 3.66406 10.5C4.21094 11.6719 5.22656 13.3516 6.75 14.7578C8.35156 16.2422 10.4219 17.375 13 17.375C14.1719 17.375 15.2656 17.1406 16.2812 16.7109ZM8 10.5C8 10.4219 8 10.3047 8 10.1875L10.1875 11.9062C10.5781 12.7266 11.3594 13.3516 12.2969 13.5469L14.4844 15.3047C14.0156 15.4219 13.5078 15.5 12.9609 15.5C10.2266 15.5 7.96094 13.2734 7.96094 10.5H8Z"
                                                    : "M7 9.5C7 6.76562 9.22656 4.5 12 4.5C14.7344 4.5 17 6.76562 17 9.5C17 12.2734 14.7344 14.5 12 14.5C9.22656 14.5 7 12.2734 7 9.5ZM12 12.625C13.7188 12.625 15.125 11.2578 15.125 9.5C15.125 7.78125 13.7188 6.375 12 6.375C11.9609 6.375 11.9219 6.375 11.8828 6.375C11.9609 6.60938 12 6.80469 12 7C12 8.40625 10.8672 9.5 9.5 9.5C9.26562 9.5 9.07031 9.5 8.875 9.42188C8.875 9.46094 8.875 9.5 8.875 9.5C8.875 11.2578 10.2422 12.625 12 12.625ZM4.46094 3.91406C6.29688 2.19531 8.83594 0.75 12 0.75C15.125 0.75 17.6641 2.19531 19.5 3.91406C21.3359 5.59375 22.5469 7.625 23.1328 9.03125C23.25 9.34375 23.25 9.69531 23.1328 10.0078C22.5469 11.375 21.3359 13.4062 19.5 15.125C17.6641 16.8438 15.125 18.25 12 18.25C8.83594 18.25 6.29688 16.8438 4.46094 15.125C2.625 13.4062 1.41406 11.375 0.828125 10.0078C0.710938 9.69531 0.710938 9.34375 0.828125 9.03125C1.41406 7.625 2.625 5.59375 4.46094 3.91406ZM12 2.625C9.42188 2.625 7.35156 3.79688 5.75 5.28125C4.22656 6.6875 3.21094 8.32812 2.66406 9.5C3.21094 10.6719 4.22656 12.3516 5.75 13.7578C7.35156 15.2422 9.42188 16.375 12 16.375C14.5391 16.375 16.6094 15.2422 18.2109 13.7578C19.7344 12.3516 20.75 10.6719 21.2969 9.5C20.75 8.32812 19.7344 6.6875 18.2109 5.28125C16.6094 3.79688 14.5391 2.625 12 2.625Z"
                                            }
                                        />
                                        {}
                                    </svg>
                                </div>
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Tên nhân viên
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default ${
                                    errors.fullname
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                }`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        type="text"
                                        value={fullname}
                                        onChange={(e) =>
                                            setFullname(e.target.value)
                                        }
                                        placeholder="Nhập tên nhân viên"
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Ngày sinh
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default ${
                                    errors.birthDay
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                } relative`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="text"
                                        value={
                                            birthDay
                                                ? format(birthDay, "dd/MM/yyyy")
                                                : ""
                                        }
                                        readOnly
                                        placeholder="Chọn ngày sinh"
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
                                    />
                                    <svg
                                        onClick={() => {
                                            allowUpdate &&
                                                setOpenCalendar(!openCalendar);
                                        }}
                                        viewBox="0 0 24 19"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className="h-5 w-5 cursor-pointer text-text-primary dark:text-text-white"
                                    >
                                        <path d="M7.1875 3H12.8125V1.4375C12.8125 0.929688 13.2031 0.5 13.75 0.5C14.2578 0.5 14.6875 0.929688 14.6875 1.4375V3H16.25C17.6172 3 18.75 4.13281 18.75 5.5V18C18.75 19.4062 17.6172 20.5 16.25 20.5H3.75C2.34375 20.5 1.25 19.4062 1.25 18V5.5C1.25 4.13281 2.34375 3 3.75 3H5.3125V1.4375C5.3125 0.929688 5.70312 0.5 6.25 0.5C6.75781 0.5 7.1875 0.929688 7.1875 1.4375V3ZM3.125 18C3.125 18.3516 3.39844 18.625 3.75 18.625H16.25C16.5625 18.625 16.875 18.3516 16.875 18V8H3.125V18Z" />
                                    </svg>
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Chức vụ
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-border-neutral-default bg-background-surface_default dark:bg-background-neutral-default">
                                <div className="flex items-center gap-2 flex-1">
                                    <select
                                        disabled={!allowUpdate}
                                        value={roleItem.role_id}
                                        className="w-full pl-1 py-1 rounded-lg font-medium text-sm text-text-primary dark:text-text-white bg-background-surface_default dark:bg-background-neutral-hover"
                                        onChange={(e) => {
                                            const selectedRole = role.find(
                                                (r) =>
                                                    r.role_id === e.target.value
                                            );
                                            setRoleItem(selectedRole);
                                        }}
                                    >
                                        {role.map(
                                            (option, index) =>
                                                option.status && (
                                                    <option
                                                        key={index}
                                                        value={option.role_id}
                                                    >
                                                        {option.role_name}
                                                    </option>
                                                )
                                        )}
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Email
                            </h1>

                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default ${
                                    errors.email
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                }`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        type="text"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Nhập email"
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Số điện thoại
                            </h1>

                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg bg-background-surface_default dark:bg-background-neutral-default ${
                                    errors.phone
                                        ? "border-border-negative-default"
                                        : "border-border-neutral-default"
                                }`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        readOnly={!allowUpdate}
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => handleChange(e)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg bg-background-surface_default dark:bg-background-neutral-hover text-text-primary dark:text-text-white focus:ring-border-brand-default "
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
                            <h1 className="font-medium text-sm text-text-primary dark:text-text-white">
                                Trạng thái
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-border-neutral-default bg-background-surface_default dark:bg-background-neutral-default">
                                <div className="flex items-center gap-0.5 flex-1">
                                    <select
                                        disabled={!allowUpdate}
                                        className="w-full pl-1 py-1 rounded-lg font-medium text-sm text-text-primary dark:text-text-white bg-background-surface_default dark:bg-background-neutral-hover"
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
