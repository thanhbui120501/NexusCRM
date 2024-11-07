import { useEffect, useState, useRef } from "react";
import { vi } from "date-fns/locale";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import axiosClient from "../../../../axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Validation } from "../../../../validation";

export default function AccountCreate() {
    //set loading
    const [loading, setLoading] = useState(false);
    //set navigate
    const navigate = useNavigate();
    //set form ref
    const formRef = useRef(null);
    //set avartar display
    const [avatar, setAvatar] = useState("/icons/avatar_empty.svg");
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
    //get list username, phone number and email to validate
    const [listUsername, getListUsername] = useState([]);
    const [listEmail, getListEmail] = useState([]);
    const [listPhoneNumber, getListPhoneNumber] = useState([]);
    // Error states for validation
    const [errors, setErrors] = useState({});
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
                setAvatar("/icons/avatar_empty.svg");
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
        getRoles();
        getListUsernameEmailPhoneNumber();
    }, []);
    const getRoles = async () => {
        try {
            const response = await axiosClient.get("/role/get-all-role");
            setRole(response.data.data);
            setRoleItem(response.data.data ? response.data.data[0] : "");
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    const getListUsernameEmailPhoneNumber = async () => {
        try {
            const response = await axiosClient.get(
                "/account/get-username-email-phone"
            );
            getListEmail(response.data.emails);
            getListUsername(response.data.usernames);
            getListPhoneNumber(response.data.phone_numbers);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    //Submit form
    const onSubmit = async (ev) => {
        ev.preventDefault();
        try {
            
            const validationErrors = Validation({
                image: image,
                username: username,
                password: password,
                fullname: fullname,
                birthDay: birthDay,
                email: email,
                phone: phoneNumber,
                listEmail: listEmail,
                listPhoneNumber: listPhoneNumber,
                listUsername: listUsername,
                type: "create",
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
            setLoading(true);
            const data = new FormData();
            data.append("username", username);
            data.append("password", password);
            data.append("password_confirm", password);
            data.append("role_id", roleItem.role_id);
            data.append("full_name", fullname);
            data.append("images", image);
            data.append("email", email);
            data.append("date_of_birth", format(birthDay, "yyyy-MM-dd"));
            data.append("phone_number", phoneNumber);

            const response = await axiosClient.post(
                "account/create-new-account",
                data
            );
            if (response.status === 201) {
                toast.success("Tạo mới tài khoản thành công!", {
                    position: "top-right",
                    autoClose: 5000, // thời gian tự động đóng (mili giây)
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                });
                setTimeout(() => {
                    navigate("/account");
                }, 5000);
            }
        
        } catch (err) {
            console.log(err);
            toast.error("Đã có lỗi xảy ra khi tạo tài khoản", {
                position: "top-right",
                autoClose: 5000, // thời gian tự động đóng (mili giây)
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
            });
        }finally{
            setLoading(false);
        }
    };
    //HandleExternalSubmit
    const handleExternalSubmit = () => {
        formRef.current.dispatchEvent(new Event("submit", { bubbles: true }));
    };
    return (
        <div className="flex flex-col h-full items-start gap-3 justify-start self-stretch overflow-y-auto overflow-x-hidden">
            <ToastContainer />
            <div className="flex pl-6 pr-6 pb-6 pt-3 flex-col items-start gap-3 self-stretch">
                <div className="flex justify-between items-end self-stretch">
                    <div className="flex flex-col items-start gap-2 flex-1">
                        <h1 className="font-semibold text-3xl text-[#171717]">
                            Thêm mới tài khoản
                        </h1>
                        <h1 className="font-medium text-base text-[#A3A3A3]">
                            Thêm mới tài khoản để sẵn sàng sử dụng website
                        </h1>
                    </div>
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={handleExternalSubmit}
                    >
                        <div className="flex py-2 px-4 h-10 justify-center items-center gap-2 self-stretch bg-[#EA580C] rounded-lg hover:bg-[#C2410C]">
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
                </div>
            </div>
            <div className="flex px-6 pb-6 flex-col items-start gap-6 self-stretch">
                <form
                    ref={formRef}
                    className="flex p-6 flex-col items-start gap-3 self-stretch border rounded-xl border-gray-200"
                    encType="multipart/form-data"
                    onSubmit={onSubmit}
                    autoComplete="off"
                >
                    <h1 className="text-xl font-semibold text-[#171717]">
                        Thông tin tài khoản
                    </h1>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex w-[250px] flex-col items-start gap-2 ">
                            <div className="flex flex-col items-start gap-2.5 self-stretch">
                                <h1 className="font-medium text-sm text-[#171717]">
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
                                            ? "border-[#DC2626]"
                                            : "border-gray-200"
                                    }  border-dashed h-[68px] w-[68px]`}
                                >
                                    <div className="flex flex-col justify-center items-center gap-2.5 w-full h-full">
                                        {avatar ===
                                        "/icons/avatar_empty.svg" ? (
                                            <img
                                                src={avatar}
                                                alt="avatar_empty"
                                                className="w-5 h-5"
                                            />
                                        ) : (
                                            <img
                                                src={avatar}
                                                alt="avatar_empty"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="flex flex-col items-start gap-2.5 rounded-lg cursor-pointer bg-[#171717] px-3 py-2 justify-center hover:bg-[#262626]"
                                        onClick={() =>
                                            document
                                                .getElementById("avatarInput")
                                                .click()
                                        }
                                    >
                                        <h1 className="font-semibold text-xs text-[#fff]">
                                            Tải ảnh
                                        </h1>
                                    </div>
                                    <input
                                        id="avatarInput"
                                        type="file"
                                        accept="image/jpeg, image/png, image/jpg, image/svg+xml"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }} // Ẩn input
                                    />
                                    <div
                                        className="flex flex-col items-start gap-2.5 rounded-lg cursor-pointer bg-[#fff] px-3 py-2 justify-center border border-[#E5E5E5]"
                                        onClick={() => {
                                            setAvatar(
                                                "/icons/avatar_empty.svg"
                                            );
                                            setImage(null);
                                        }}
                                    >
                                        <h1 className="font-semibold text-xs text-[#171717]">
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
                                <h1 className="font-medium text-sm text-[#DC2626]">
                                    {errorMessage && errorMessage}
                                    {errors.image && errors.image}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-[#171717]">
                                Tên tài khoản
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.username
                                        ? "border-[#DC2626]"
                                        : "border-[#E5E5E5]"
                                }`}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
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
                                    className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.username
                                        ? errors.username
                                        : "username"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-[#171717]">
                                Mật khẩu
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.password
                                        ? "border-[#DC2626]"
                                        : "border-[#E5E5E5]"
                                } `}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
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
                                        className="w-full"
                                        autoComplete="new-password"
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
                                    className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
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
                            <h1 className="font-medium text-sm text-[#171717]">
                                Tên nhân viên
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.fullname
                                        ? "border-[#DC2626]"
                                        : "border-[#E5E5E5]"
                                } `}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
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
                                    className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.fullname
                                        ? errors.fullname
                                        : "fullname"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-[#171717]">
                                Ngày sinh
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.birthDay
                                        ? "border-[#DC2626]"
                                        : "border-[#E5E5E5]"
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
                                    className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
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
                            <h1 className="font-medium text-sm text-[#171717]">
                                Chức vụ
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5]">
                                <div className="flex items-center gap-0.5 flex-1">
                                    <select
                                        className="w-full font-medium text-sm text-[#171717]"
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
                                    className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    Mã chức vụ: {roleItem.role_id}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-[#171717]">
                                Email
                            </h1>
                            <div
                                className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg ${
                                    errors.email
                                        ? "border-[#DC2626]"
                                        : "border-[#E5E5E5]"
                                } `}
                            >
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
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
                                    className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.email ? errors.email : "username"}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-stretch">
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                            <h1 className="font-medium text-sm text-[#171717]">
                                Số điện thoại
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5]">
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
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
                                    className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.phone ? errors.phone : "phone"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-2.5 flex-1 invisible">
                            <h1 className="font-medium text-sm text-[#171717]">
                                Email
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5]">
                                <div className="flex items-center gap-0.5 flex-1">
                                    <input
                                        type="email"
                                        placeholder="Nhập email"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        {loading && (
                            <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-10 items-center justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                                <h1 className="text-sm font-medium text-white">
                                    Đang thêm nhân viên
                                </h1>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
