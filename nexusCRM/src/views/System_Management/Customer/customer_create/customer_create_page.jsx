import { useState, useRef, useEffect } from "react";
import { format, parse, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import GenderDropdown from "../customer_detail/Customer_info/gender_dropdown";
import axiosClient from "../../../../axiosClient";
import { CustomerValidation } from "../../../../validation";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddressDialog from "../customer_detail/Customer_info/addressdialog";
export default function CustomerCreate() {
    //set navigate
    const navigate = useNavigate();
    //set avartar display
    const [avatar, setAvatar] = useState("/icons/avatar_empty.svg");
    //image error
    const [errorMessage, setErrorMessage] = useState("");
    // Error states for validation
    const [errors, setErrors] = useState({});
    //set image file
    const [image, setImage] = useState(null);
    //full name
    const [fullname, setFullName] = useState("");
    //gender
    const [gender, setGender] = useState("");
    //set date of birth
    const [birthDay, setBirthDay] = useState("");
    const [openCalendar, setOpenCalendar] = useState(false);
    //open gender dropdown
    const [openGenderDrop, setOpenGenderDrop] = useState(false);
    //phone number
    const [phoneNumber, setPhoneNumber] = useState("");
    const [listPhoneNumber, setListPhoneNumber] = useState([]);
    //email
    const [email, setEmail] = useState("");
    const [listEmail, setListEmail] = useState([]);
    //set form ref
    const formRef = useRef(null);
    //loading
    const [loading, setLoading] = useState(false);
    //list address
    const [listAddress, setListAddress] = useState([]);

    // Hàm để thêm một địa chỉ mới
    const addAddress = (
        newProvince,
        newDistrict,
        newWard,
        newAddressLine,
        isDefault
    ) => {
        // Sử dụng setAddresses để thêm địa chỉ mới vào mảng
        setListAddress((prevAddresses) => {
            const isFirstAddress = prevAddresses.length === 0;

            const newAddress = {
                province: newProvince,
                district: newDistrict,
                ward: newWard,
                is_default_address: isFirstAddress ? true : isDefault,
                address_line: newAddressLine,
            };
            // Nếu địa chỉ mới có isDefault là true, cập nhật tất cả các địa chỉ hiện tại có is_default_address thành false
            const updatedAddresses = isDefault
                ? prevAddresses.map((address) =>
                      address.is_default_address
                          ? { ...address, is_default_address: false }
                          : address
                  )
                : prevAddresses;

            // Thêm địa chỉ mới vào mảng
            return [...updatedAddresses, newAddress];
        });
    };
    //get list email, phone number
    useEffect(() => {
        getListEmailPhoneNumber();
        const todayISO = new Date().toISOString();
        const formattedDate = convertDate(todayISO);
        setBirthDay(formattedDate);
    }, []);
    //handlde date change
    //handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setBirthDay(date ? format(date, "dd/MM/yyyy") : null);
        setOpenCalendar(false);
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
    //handle gender
    const handleGender = (gender) => {
        switch (gender) {
            case "Female":
                return "Nữ";
            default:
                return "Nam";
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
    //Submit form
    const onSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const validationErrors = CustomerValidation({
                image: image,
                fullname: fullname,
                birthDay:
                    birthDay == ""
                        ? ""
                        : parse(birthDay, "dd/MM/yyyy", new Date()),
                email: email,
                phone: phoneNumber,
                listEmail: listEmail,
                listPhoneNumber: listPhoneNumber,
            });
            setErrors(validationErrors);
            if (!validationErrors.status) {
                toast.error("Vui lòng nhập đúng và đầy đủ thông tin", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            setLoading(true);
            const data = new FormData();
            data.append("full_name", fullname);
            data.append("images", image);
            data.append("email", email);
            data.append("gender", gender === "Male" ? 0 : 1);
            data.append("date_of_birth", format(birthDay, "yyyy-MM-dd"));
            data.append("phone_number", phoneNumber);
            data.append("customer_group", "Personal");
            data.append("customer_source", "Self_contact");
            //handle address array
            if (listAddress.length > 0) {
                listAddress.forEach((address, index) => {
                    data.append(`addresses[${index}][country]`, "Việt Nam");
                    data.append(
                        `addresses[${index}][province]`,
                        address.province
                    );
                    data.append(`addresses[${index}][ward]`, address.district);
                    data.append(`addresses[${index}][town]`, address.ward);
                    data.append(
                        `addresses[${index}][is_default_address]`,
                        address.is_default_address ? 1 : 0
                    );
                    data.append(
                        `addresses[${index}][address_line]`,
                        address.address_line
                    );
                });
            }

            const response = await axiosClient.post(
                "/customer/create-new-customer",
                data
            );
            console.log(response);
            if (response.status == 201) {
                toast.success("Tạo mới khách haàng thành công!", {
                    position: "top-right",
                    autoClose: 3000, // thời gian tự động đóng (mili giây)
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                });
                setTimeout(() => {
                    navigate("/customer");
                }, 3000);
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
        } finally {
            setLoading(false);
        }
    };
    //get all email and phone number
    const getListEmailPhoneNumber = async () => {
        try {
            const response = await axiosClient.get(
                `/customer/get-all-email-phone`
            );
            setListEmail(response.data.emails);
            setListPhoneNumber(response.data.phone_numbers);
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        }
    };
    //HandleExternalSubmit
    const handleExternalSubmit = () => {
        formRef.current.dispatchEvent(new Event("submit", { bubbles: true }));
    };
    //Hàm chuyển chuỗi "dd/MM/yyyy" thành object Date
    const convertStringToDate = (dateString) => {
        return dateString ? parse(dateString, "dd/MM/yyyy", new Date()) : null;
    };
    // Chuyển birthDay (chuỗi) thành object Date để dùng trong DatePicker
    const [selectedDate, setSelectedDate] = useState(() =>
        convertStringToDate(birthDay)
    );
    //convert date
    const convertDate = (dateString) => {
        const date = parseISO(dateString); // Chuyển đổi chuỗi thành đối tượng Date
        return format(date, "dd/MM/yyyy"); // Định dạng lại thành d-m-Y
    };
    return (
        <>
            <div
                name="tittle"
                className="flex py-6 justify-between items-end self-stretch"
            >
                <div className="flex flex-col items-start gap-2 flex-1">
                    <h1 className="font-semibold text-3xl text-text-primary">
                        Thêm mới khách hàng
                    </h1>
                    <h1 className="font-medium text-base text-text-secondary">
                        Thêm mới khách hàng vào hệ thống
                    </h1>
                </div>
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleExternalSubmit}
                >
                    <div className="flex py-2 px-4 h-10 justify-center items-center gap-2 self-stretch bg-background-brand-default rounded-lg hover:bg-background-brand-hover">
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
            <div
                name="infomation"
                className="flex pb-6 flex-col items-start gap-2.5 self-stretch"
            >
                <form
                    encType="multipart/form-data"
                    className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-border-neutral-default"
                    ref={formRef}
                    autoComplete="off"
                    onSubmit={onSubmit}
                >
                    <h1 className="text-xl font-semibold text-text-primary">
                        Thông tin khách hàng
                    </h1>
                    <div
                        name="avatar-select"
                        className="flex items-center gap-4 self-stretch"
                    >
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
                                        className="flex flex-col items-start gap-2.5 rounded-lg cursor-pointer bg-background-neutral-default px-3 py-2 justify-center hover:bg-[#262626]"
                                        onClick={() =>
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
                                        style={{ display: "none" }} // Ẩn input
                                    />
                                    <div
                                        className="flex flex-col items-start gap-2.5 rounded-lg cursor-pointer bg-background-surface_default px-3 py-2 justify-center border border-border-neutral-default"
                                        onClick={() => {
                                            setAvatar(
                                                "/icons/avatar_empty.svg"
                                            );
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
                                    {errors.image && (
                                        <>
                                            {errors.image}
                                            <br />
                                        </>
                                    )}
                                    {errorMessage && errorMessage}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-start content-start gap-4 self-stretch flex-wrap">
                        <div className="flex flex-col items-start gap-1.5 self-stretch flex-1">
                            <h1 className="text-sm font-medium text-text-primary">
                                Tên khách hàng
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-border-neutral-default rounded-lg">
                                <input
                                    placeholder="Nhập tên khách hàng"
                                    type="text"
                                    className="flex flex-1 items-center gap-0.5 font-normal text-base"
                                    value={fullname}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />
                            </div>
                            {errors.fullname && (
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.fullname}
                                </h1>
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-1.5 self-stretch flex-1">
                            <h1 className="text-sm font-medium text-text-primary">
                                Ngày sinh
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-border-neutral-default rounded-lg relative">
                                <input
                                    readOnly
                                    placeholder="Chọn ngày sinh"
                                    type="text"
                                    className="flex flex-1 items-center gap-0.5 font-normal text-base"
                                    value={birthDay}
                                />
                                <img
                                    src="/icons/calendar.svg"
                                    alt="hide_password"
                                    className="h-5 w-5 cursor-pointer"
                                    onClick={() =>
                                        setOpenCalendar(!openCalendar)
                                    }
                                />

                                {openCalendar && (
                                    <div className="absolute z-[100] top-10 right-0">
                                        <DatePicker
                                            selected={selectedDate}
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
                            {errors.birthDay && (
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.birthDay}
                                </h1>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center items-start content-start gap-4 self-stretch flex-wrap">
                        <div className="flex flex-col items-start gap-1.5 self-stretch flex-1 relative">
                            <h1 className="text-sm font-medium text-text-primary">
                                Giới tính
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-border-neutral-default rounded-lg">
                                <input
                                    readOnly
                                    placeholder="Chọn giới tính"
                                    type="text"
                                    className="flex flex-1 items-center gap-0.5 font-normal text-base"
                                    value={handleGender(gender)}
                                />
                                <div name="prefix" className="cursor-pointer">
                                    <img
                                        src="/icons/angle-down.svg"
                                        alt="gender"
                                        onClick={() => {
                                            setOpenGenderDrop(!openGenderDrop);
                                        }}
                                    />
                                </div>
                            </div>
                            {openGenderDrop && (
                                <GenderDropdown
                                    onData={setGender}
                                    onClose={setOpenGenderDrop}
                                />
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-1.5 self-stretch flex-1">
                            <h1 className="text-sm font-medium text-text-primary">
                                Email
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-border-neutral-default rounded-lg">
                                <input
                                    placeholder="Nhập email"
                                    type="text"
                                    className="flex flex-1 items-center gap-0.5 font-normal text-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {errors.email && (
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.email}
                                </h1>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center items-start content-start gap-4 self-stretch flex-wrap">
                        <div className="flex flex-col items-start gap-1.5 self-stretch flex-1">
                            <h1 className="text-sm font-medium text-text-primary">
                                Số điện thoại
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-border-neutral-default rounded-lg">
                                <input
                                    placeholder="Nhập số điện thoại"
                                    type="text"
                                    className="flex flex-1 items-center gap-0.5 font-normal text-base"
                                    value={phoneNumber}
                                    onKeyDown={handleKeyDown}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.phone && (
                                <h1
                                    className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                                >
                                    {errors.phone}
                                </h1>
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-1.5 self-stretch flex-1 invisible">
                            <h1 className="text-sm font-medium text-text-primary">
                                Ngày sinh
                            </h1>
                            <div className="flex px-3 py-2 items-center gap-2 self-stretch border border-border-neutral-default rounded-lg">
                                <input
                                    readOnly
                                    placeholder="Chọn ngày sinh"
                                    type="text"
                                    className="flex flex-1 items-center gap-0.5 font-normal text-base"
                                />
                                <img
                                    src="/icons/calendar.svg"
                                    alt="hide_password"
                                    className="h-5 w-5 cursor-pointer"
                                    // onClick={() =>
                                    //     setOpenCalendar(!openCalendar)
                                    // }
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Address addAddress={addAddress} listAddress={listAddress} />
            {loading && (
                <div className="absolute inset-0 bg-background-black bg-opacity-50 z-[900] flex flex-col items-center justify-center ">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                    <h1 className="text-sm font-medium text-text-white">
                        Đang cập nhật
                    </h1>
                </div>
            )}
            <ToastContainer />
        </>
    );
}

// eslint-disable-next-line react/prop-types
export function Address({ addAddress, listAddress }) {
    //handle Address
    const handleAddress = (add) => {
        // let add_line = add.address_line,
        //     add_province = add.province,
        //     add_town = add.town,
        //     add_ward = add.ward;

        return (
            add.address_line +
            ", " +
            add.ward +
            ", " +
            add.district +
            ", " +
            add.province
        );
    };
    const type = "created";
    //open address dialog
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    return (
        <div className="felx pb-6 flex-col items-start gap-2.5 self-stretch">
            <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-border-neutral-default">
                <div className="flex justify-between items-center self-stretch">
                    <h1 className="text-xl font-semibold text-text-primary">
                        Địa chỉ
                    </h1>
                    <div
                        onClick={() =>
                            // eslint-disable-next-line react/prop-types
                            listAddress.length < 10 &&
                            setOpenAddressDialog(!openAddressDialog)
                        }
                        className={`flex py-2 cursor-pointer px-3 items-center justify-center gap-2 self-stretch ${
                            // eslint-disable-next-line react/prop-types
                            listAddress.length < 10 && "hover:bg-gray-600"
                        }  rounded-lg w-[123px] h-8  ${
                            // eslint-disable-next-line react/prop-types
                            listAddress.length >= 10
                                ? "bg-gray-400"
                                : "bg-background-neutral-default"
                        } `}
                    >
                        <img src="/icons/plus.svg" alt="plus" />
                        <h1 className="text-xs font-semibold text-[#ffff]">
                            Thêm địa chỉ
                        </h1>
                    </div>
                </div>
                {
                    // eslint-disable-next-line react/prop-types
                    listAddress.map((add, index) => (
                        <div
                            key={index}
                            className="flex items-center pb-3 justify-between self-stretch"
                        >
                            <div className="flex items-center gap-3">
                                <h1 className="text-base font-medium text-text-primary">
                                    {handleAddress(add)}
                                </h1>
                                {add.is_default_address && (
                                    <div className="flex px-2.5 py-0.5 justify-center items-center gap-2.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF]">
                                        <h1 className="text-sm font-medium text-[#2563EB]">
                                            Địa chỉ mặc định
                                        </h1>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-border-neutral-default bg-background-surface_default cursor-pointer">
                                <img src="/icons/ellipsis.svg" alt="" />
                            </div>
                        </div>
                    ))
                }
            </div>
            {openAddressDialog && (
                <AddressDialog
                    onClose={setOpenAddressDialog}
                    addAddress={addAddress}
                    listAddress={listAddress}
                    type={type}
                    //customer_id={customer_id}
                    //updateAddress={updateAddress}
                    //onUpdateAddress={onUpdateAddress}
                    //setStatusCode={setStatusCode}
                />
            )}
        </div>
    );
}
