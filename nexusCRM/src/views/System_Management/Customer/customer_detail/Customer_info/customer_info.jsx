import {
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import { format, parse, parseISO } from "date-fns";
import GenderDropdown from "./gender_dropdown";
import CustomerStatusDropdown from "./customer_status_dropdown";
import axiosClient from "../../../../../axiosClient";
import { CustomerValidation } from "../../../../../validation";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "../../../../../components/skeleton";
import AddressDialog from "./addressdialog";
import { FaStar } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
// eslint-disable-next-line react/display-name,
const CustomerInfo = forwardRef(
    // eslint-disable-next-line react/prop-types
    ({ customer, openUpdateButton, onCloseUpdate }, ref) => {
        const [customers] = useState(customer);

        return (
            <div className="flex py-6 flex-col items-start gap-6 self-stretch">
                <PersonalInfo
                    customer={customers}
                    openUpdateButton={openUpdateButton}
                    onCloseUpdate={onCloseUpdate}
                    ref={ref} // Truyền ref đến PersonalInfo
                />
                <Address customer_id={customers.customer_id} />
                <CustomerSocialMedia />
                <StatisticsActivity customer={customers} />
                <ToastContainer />
            </div>
        );
    }
);

// eslint-disable-next-line  react/display-name
export const PersonalInfo = forwardRef(
    // eslint-disable-next-line react/prop-types
    ({ customer, openUpdateButton, onCloseUpdate }, ref) => {
        //set record
        const [customerRecord, setRecord] = useState({});
        //set loading
        const [loading, setLoading] = useState(false);
        //set form ref
        const inputRef = useRef();
        //get fullname
        const [fullName, setFullName] = useState("");
        //get email
        const [email, setEmail] = useState("");
        //get gender
        const [gender, setGender] = useState("");
        //get phone number
        const [phone, setPhone] = useState("");
        //get birthday
        const [birthDay, setBirthDay] = useState("");
        //get status
        const [status, setStatus] = useState("");
        //open calendar
        const [openCalendar, setOpenCalendar] = useState(false);
        //open gender dropdown
        const [openGenderDrop, setOpenGenderDrop] = useState(false);
        //open status dropdown
        const [openStatusDrop, setOpenStatusDrop] = useState(false);
        //set Open Update Button
        //const [openUpdateButton, setOpenUpdateButton] = useState(false);
        //get list username, phone number and email to validate
        const [listEmail, getListEmail] = useState([]);
        const [listPhoneNumber, getListPhoneNumber] = useState([]);
        // Error states for validation
        const [errors, setErrors] = useState({});
        //Hàm chuyển chuỗi "dd/MM/yyyy" thành object Date
        const convertStringToDate = (dateString) => {
            return dateString
                ? parse(dateString, "dd/MM/yyyy", new Date())
                : null;
        };
        const convertDate = (dateString) => {
            const date = parseISO(dateString); // Chuyển đổi chuỗi thành đối tượng Date
            return format(date, "dd/MM/yyyy"); // Định dạng lại thành d-m-Y
        };
        const convertDateUpdate = (dateString) => {
            const date = parse(dateString, "dd/MM/yyyy", new Date()); // Chuyển đổi chuỗi thành đối tượng Date
            return format(date, "yyyy-MM-dd"); // Định dạng lại thành Y-m-d
        };

        // Chuyển birthDay (chuỗi) thành object Date để dùng trong DatePicker
        const [selectedDate, setSelectedDate] = useState(() =>
            convertStringToDate(birthDay)
        );
        //handle date change
        const handleDateChange = (date) => {
            setSelectedDate(date);
            setBirthDay(date ? format(date, "dd/MM/yyyy") : null);
            setOpenCalendar(false);
        };
        const handleStatus = (status) => {
            switch (status) {
                case "Active":
                    return "Đang hoạt động";
                case "Locked":
                    return "Ngưng hoạt động";
                case "Expired":
                    return "Đã hết hạn";
                default:
                    return "Đã đóng";
            }
        };
        const handleGender = (gender) => {
            switch (gender) {
                case "Male":
                    return "Nam";
                default:
                    return "Nữ";
            }
        };
        //phone number input only number
        const handleKeyDown = (e) => {
            if (
                !/[0-9]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
            ) {
                e.preventDefault();
            }
        };
        //handle change
        const handleChange = (e) => {
            // Chỉ cho phép nhập tối đa 10 ký tự
            if (e.target.value.length <= 10) {
                setPhone(e.target.value);
            }
        };
        useEffect(() => {
            // eslint-disable-next-line react/prop-types
            setFullName(customer.full_name);
            // eslint-disable-next-line react/prop-types
            setEmail(customer.email);
            // eslint-disable-next-line react/prop-types
            setGender(customer.gender);
            // eslint-disable-next-line react/prop-types
            setPhone(customer.phone_number);
            setBirthDay(
                // eslint-disable-next-line react/prop-types
                customer.date_of_birth === null
                    ? ""
                    : // eslint-disable-next-line react/prop-types
                      convertDate(customer.date_of_birth)
            );
            // eslint-disable-next-line react/prop-types
            setStatus(customer.status);
            //setOpenUpdateButton(openUpdateButton);
            getListEmailPhoneNumber();
            //set customer record
            setRecord(customer);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        const getListEmailPhoneNumber = async () => {
            try {
                const response = await axiosClient.get(
                    // eslint-disable-next-line react/prop-types
                    `/customer/get-email-phone-except/${customer.customer_id}`
                );
                getListEmail(response.data.emails);
                getListPhoneNumber(response.data.phone_numbers);
            } catch (err) {
                const response = err.response;
                console.log(response.message);
            }
        };
        //HandleExternalSubmit
        // Expose the submit function to the parent component using useImperativeHandle
        useImperativeHandle(ref, () => ({
            focusInput: () => {
                if (inputRef.current) {
                    inputRef.current.focus(); // Đặt focus vào input
                }
            },
            submitForm: async () => {
                try {
                    const validationErrors = CustomerValidation({
                        fullname: fullName,
                        birthDay:
                            birthDay === ""
                                ? ""
                                : parse(birthDay, "dd/MM/yyyy", new Date()),
                        email: email,
                        phone: phone,
                        listEmail: listEmail,
                        listPhoneNumber: listPhoneNumber,
                    });
                    setErrors(validationErrors);
                    if (!validationErrors.status) {
                        toast.error("Vui lòng nhập đúng và đầy đủ thông tin", {
                            position: "top-right",
                            autoClose: 3000, // thời gian tự động đóng (mili giây)
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                        });
                        return;
                    }
                    setLoading(true);
                    //create payload when data was change
                    const payload = {};
                    if (fullName !== customerRecord.full_name)
                        payload.full_name = fullName;
                    if (gender !== customerRecord.gender)
                        payload.gender = gender === "Male" ? 0 : 1;
                    if (
                        birthDay !==
                        (customerRecord.date_of_birth === null
                            ? ""
                            : convertDate(customerRecord.date_of_birth))
                    )
                        payload.date_of_birth = convertDateUpdate(birthDay);
                    if (email !== customerRecord.email) payload.email = email;
                    if (phone !== customerRecord.phone_number)
                        payload.phone_number = phone;
                    if (status !== customerRecord.status)
                        payload.status = status;

                    const response = await axiosClient.patch(
                        // eslint-disable-next-line react/prop-types
                        `/customer/update-customer/${customer.customer_id}`,
                        payload
                    );

                    if (response.status === 200) {
                        toast.success("Cập nhật thông tin thành công!", {
                            position: "top-right",
                            autoClose: 4000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        onCloseUpdate(false);
                    }
                    if (response.status === 400) {
                        toast.error("Cập nhật thất bại!", {
                            position: "top-right",
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                        });
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Đã có lỗi xảy ra khi cập nhật tài khoản", {
                        position: "top-right",
                        autoClose: 3000, // thời gian tự động đóng (mili giây)
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined, // bạn có thể bỏ qua hoặc chỉnh sửa theo nhu cầu
                    });
                } finally {
                    setLoading(false);
                }
            },
        }));
        //Submit form
        const onSubmit = (ev) => {
            ev.preventDefault();
        };
        return (
            <form
                ref={inputRef}
                name="personal-info"
                className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-x-border-neutral-focus bg-background-surface_default dark:bg-background-neutral-hover"
                autoComplete="off"
                onSubmit={onSubmit}
            >
                <h1 className="text-xl font-semibold dark:text-text-primary dark:dark:text-text-white">
                    Thông tin cá nhân
                </h1>
                <div
                    name="col-1"
                    className="flex justify-center items-start gap-4 self-stretch"
                >
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white flex flex-1 gap-0.5">
                            Tên khách hàng
                        </h1>
                        <div
                            className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg  ${
                                openUpdateButton
                                    ? "bg-background-surface_default dark:bg-background-neutral-default"
                                    : "bg-background-neutral-subtle_hover dark:bg-background-black"
                            } ${
                                errors.fullname
                                    ? "border-border-negative-default"
                                    : "border-border-neutral-default"
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    id="fullName"
                                    placeholder="Nhập tên khách hàng"
                                    className={`${
                                        openUpdateButton
                                            ? "bg-background-surface_default dark:bg-background-neutral-hover"
                                            : "bg-background-neutral-subtle_hover dark:bg-background-black"
                                    } w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg text-text-primary dark:text-text-white focus:ring-border-brand-default`}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    readOnly={openUpdateButton ? false : true}
                                    type="text"
                                    value={fullName}
                                />
                            </div>
                        </div>
                        {errors.fullname && (
                            <h1
                                className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                            >
                                {errors.fullname}
                            </h1>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white">
                            Giới tính
                        </h1>
                        <div
                            className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg  ${
                                openUpdateButton
                                    ? "bg-background-surface_default dark:bg-background-neutral-default"
                                    : "bg-background-neutral-subtle_hover dark:bg-background-black"
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    id="gender"
                                    className={`${
                                        openUpdateButton
                                            ? "bg-background-surface_default dark:bg-background-neutral-hover"
                                            : "bg-background-neutral-subtle_hover dark:bg-background-black"
                                    } w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg text-text-primary dark:text-text-white focus:ring-border-brand-default`}
                                    readOnly
                                    type="text"
                                    value={handleGender(gender)}
                                />
                                <div
                                    onClick={() => {
                                        openUpdateButton &&
                                            setOpenGenderDrop(!openGenderDrop);
                                    }}
                                    name="prefix"
                                    className="cursor-pointer"
                                >
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-5 h-5 text-text-primary dark:text-text-white ${
                                            openGenderDrop
                                                ? "rotate-0"
                                                : "-rotate-90"
                                        }`}
                                    >
                                        <path d="M16.5625 9.01562L10.625 14.6016C10.4297 14.7969 10.1953 14.875 10 14.875C9.76562 14.875 9.53125 14.7969 9.33594 14.6406L3.39844 9.01562C3.00781 8.66406 3.00781 8.07812 3.35938 7.6875C3.71094 7.29688 4.29688 7.29688 4.6875 7.64844L10 12.6484L15.2734 7.64844C15.6641 7.29688 16.25 7.29688 16.6016 7.6875C16.9531 8.07812 16.9531 8.66406 16.5625 9.01562Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {openGenderDrop && (
                            <GenderDropdown
                                onData={setGender}
                                onClose={setOpenGenderDrop}
                            />
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white">
                            Ngày sinh
                        </h1>
                        <div
                            className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg  ${
                                openUpdateButton
                                    ? "bg-background-surface_default dark:bg-background-neutral-default"
                                    : "bg-background-neutral-subtle_hover dark:bg-background-black"
                            } ${
                                errors.birthDay
                                    ? "border-border-negative-default"
                                    : "border-border-neutral-default"
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    id="birthday"
                                    className={`${
                                        openUpdateButton
                                            ? "bg-background-surface_default dark:bg-background-neutral-hover"
                                            : "bg-background-neutral-subtle_hover dark:bg-background-black"
                                    } w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg text-text-primary dark:text-text-white focus:ring-border-brand-default`}
                                    readOnly
                                    type="text"
                                    value={birthDay}
                                />
                                <div
                                    onClick={() => {
                                        openUpdateButton &&
                                            setOpenCalendar(!openCalendar);
                                    }}
                                    name="prefix"
                                    className="cursor-pointer"
                                >
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-5 h-5 text-text-primary dark:text-text-white rotate-0`}
                                    >
                                        <path d="M7.1875 3H12.8125V1.4375C12.8125 0.929688 13.2031 0.5 13.75 0.5C14.2578 0.5 14.6875 0.929688 14.6875 1.4375V3H16.25C17.6172 3 18.75 4.13281 18.75 5.5V18C18.75 19.4062 17.6172 20.5 16.25 20.5H3.75C2.34375 20.5 1.25 19.4062 1.25 18V5.5C1.25 4.13281 2.34375 3 3.75 3H5.3125V1.4375C5.3125 0.929688 5.70312 0.5 6.25 0.5C6.75781 0.5 7.1875 0.929688 7.1875 1.4375V3ZM3.125 18C3.125 18.3516 3.39844 18.625 3.75 18.625H16.25C16.5625 18.625 16.875 18.3516 16.875 18V8H3.125V18Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {errors.birthDay && (
                            <h1
                                className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                            >
                                {errors.birthDay}
                            </h1>
                        )}
                        {openCalendar && (
                            <div className="absolute z-[100] top-16 right-0">
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
                </div>
                <div
                    name="col-2"
                    className="flex justify-center items-start gap-4 self-stretch"
                >
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white flex flex-1 gap-0.5">
                            Email
                        </h1>
                        <div
                            className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg  ${
                                openUpdateButton
                                    ? "bg-background-surface_default dark:bg-background-neutral-default"
                                    : "bg-background-neutral-subtle_hover dark:bg-background-black"
                            } ${
                                errors.email
                                    ? "border-border-negative-default"
                                    : "border-border-neutral-default"
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    id="email"
                                    placeholder="Nhập email"
                                    className={`${
                                        openUpdateButton
                                            ? "bg-background-surface_default dark:bg-background-neutral-hover"
                                            : "bg-background-neutral-subtle_hover dark:bg-background-black"
                                    } w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg text-text-primary dark:text-text-white focus:ring-border-brand-default`}
                                    onChange={(e) => setEmail(e.target.value)}
                                    readOnly={openUpdateButton ? false : true}
                                    type="text"
                                    value={email}
                                />
                            </div>
                        </div>
                        {errors.email && (
                            <h1
                                className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                            >
                                {errors.email}
                            </h1>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white">
                            Số điện thoại
                        </h1>
                        <div
                            className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg  ${
                                openUpdateButton
                                    ? "bg-background-surface_default dark:bg-background-neutral-default"
                                    : "bg-background-neutral-subtle_hover dark:bg-background-black"
                            } ${
                                errors.phone
                                    ? "border-border-negative-default"
                                    : "border-border-neutral-default"
                            }`}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    id="phone"
                                    placeholder="Nhập số điện thoại"
                                    className={`${
                                        openUpdateButton
                                            ? "bg-background-surface_default dark:bg-background-neutral-hover"
                                            : "bg-background-neutral-subtle_hover dark:bg-background-black"
                                    } w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg text-text-primary dark:text-text-white focus:ring-border-brand-default`}
                                    readOnly={openUpdateButton ? false : true}
                                    type="text"
                                    value={phone}
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>

                        {errors.phone && (
                            <h1
                                className={`font-medium text-sm text-text-negative text-ellipsis whitespace-nowrap overflow-hidden`}
                            >
                                {errors.phone}
                            </h1>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white">
                            Trạng thái
                        </h1>
                        <div
                            className={`flex px-3 py-2 items-center gap-2 self-stretch border rounded-lg  ${
                                openUpdateButton
                                    ? "bg-background-surface_default dark:bg-background-neutral-default"
                                    : "bg-background-neutral-subtle_hover dark:bg-background-black"
                            } `}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    id="status"
                                    className={`${
                                        openUpdateButton
                                            ? "bg-background-surface_default dark:bg-background-neutral-hover"
                                            : "bg-background-neutral-subtle_hover dark:bg-background-black"
                                    } w-full pl-1 py-1 text-base font-normal dark:placeholder:text-text-secondary rounded-lg text-text-primary dark:text-text-white focus:ring-border-brand-default`}
                                    type="text"
                                    value={handleStatus(status)}
                                    readOnly
                                />
                                <div name="prefix" className="cursor-pointer">
                                    <svg
                                        onClick={() => {
                                            openUpdateButton &&
                                                setOpenStatusDrop(
                                                    !openStatusDrop
                                                );
                                        }}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-5 h-5 text-text-primary dark:text-text-white ${
                                            openStatusDrop
                                                ? "rotate-0"
                                                : "-rotate-90"
                                        }`}
                                    >
                                        <path d="M16.5625 9.01562L10.625 14.6016C10.4297 14.7969 10.1953 14.875 10 14.875C9.76562 14.875 9.53125 14.7969 9.33594 14.6406L3.39844 9.01562C3.00781 8.66406 3.00781 8.07812 3.35938 7.6875C3.71094 7.29688 4.29688 7.29688 4.6875 7.64844L10 12.6484L15.2734 7.64844C15.6641 7.29688 16.25 7.29688 16.6016 7.6875C16.9531 8.07812 16.9531 8.66406 16.5625 9.01562Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {openStatusDrop && (
                            <CustomerStatusDropdown
                                onData={setStatus}
                                onClose={setOpenStatusDrop}
                            />
                        )}
                    </div>
                </div>
                {loading && (
                    <div className="absolute inset-0 bg-background-black bg-opacity-50 z-[900] flex flex-col items-center justify-center ">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                        <h1 className="text-sm font-medium text-text-white">
                            Đang cập nhật
                        </h1>
                    </div>
                )}
            </form>
        );
    }
);
// eslint-disable-next-line , react/prop-types
export function Address({ customer_id }) {
    const [address, setAddress] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateLoding, setUpdateLoading] = useState(false);
    const [updateAddress, onUpdateAddress] = useState(false);

    //status update
    const [statusCode, setStatusCode] = useState("");
    //open address dialog
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    //address index
    const [addressKey, setKey] = useState("");
    //type to open address dialog
    const type = "updated";
    //open address options
    const [openAddressOptions, setOpenAddressOptions] = useState(false);
    //het list address
    useEffect(() => {
        if (statusCode != "") {
            if (statusCode === 200) {
                toast.success("Thêm địa chỉ thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error("Thêm địa chỉ thất bại!", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        getAddress();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateAddress]);

    const getAddress = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(
                "/address/get-address-by-customer",
                {
                    params: {
                        customer_id: customer_id,
                    },
                }
            );
            if (response.status === 200) {
                setAddress(response.data.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleAddress = (add) => {
        // let add_line = add.address_line,
        //     add_province = add.province,
        //     add_town = add.town,
        //     add_ward = add.ward;

        return (
            add.address_line +
            ", " +
            add.town +
            ", " +
            add.ward +
            ", " +
            add.province
        );
    };
    const handleAddressOption = (key) => {
        if (key === addressKey) {
            setOpenAddressOptions(!openAddressOptions);
        } else {
            setOpenAddressOptions(true);
        }

        setKey(key);
    };
    const setDefaultAddress = async () => {
        try {
            setUpdateLoading(true);

            const response = await axiosClient.patch(
                `/address/set-default-address/${addressKey}`
            );
            if (response.status === 200) {
                toast.success("Thiết lập thành công!", {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getAddress();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdateLoading(false);
            setOpenAddressOptions(false);
        }
    };
    const deleteAddress = async () => {
        try {
            setUpdateLoading(true);
            const response = await axiosClient.delete(
                `/address/delete-address/${addressKey}`
            );
            if (response.status === 204) {
                toast.success("Xóa địa chỉ thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getAddress();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdateLoading(false);
            setOpenAddressOptions(false);
        }
    };
    return (
        <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-border-neutral-subtle bg-background-surface_default dark:bg-background-neutral-hover">
            <div className="flex justify-between items-center self-stretch">
                <h1 className="text-xl font-semibold dark:text-text-primary dark:dark:text-text-white">
                    Địa chỉ
                </h1>
                <div
                    onClick={() =>
                        address.length < 10 &&
                        setOpenAddressDialog(!openAddressDialog)
                    }
                    className={`flex py-2 cursor-pointer px-3 items-center justify-center gap-2 self-stretch rounded-lg  ${
                        address.length >= 10
                            ? "bg-background-neutral-disable"
                            : "bg-background-neutral-default hover:bg-background-neutral-press"
                    } `}
                >
                    <img src="/icons/plus.svg" alt="plus" />
                    <h1 className="text-xs font-semibold text-text-white">
                        Thêm địa chỉ
                    </h1>
                </div>
            </div>

            {updateLoding && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[120] items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                    <h1 className="text-sm font-medium text-text-white">
                        Đang cập nhật
                    </h1>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex pb-3 justify-between items-center self-stretch border-b-[1px] relative">
                        <Skeleton className="rounded-md h-6 w-96" />{" "}
                        <Skeleton className="rounded-md h-8 w-8" />
                    </div>
                    <div className="flex pb-3 justify-between items-center self-stretch border-b-[1px] relative">
                        <Skeleton className="rounded-md  h-6 w-96" />{" "}
                        <Skeleton className="rounded-md h-8 w-8" />
                    </div>
                    <div className="flex pb-3 justify-between items-center self-stretch border-b-[1px] relative">
                        <Skeleton className="rounded-md  h-6 w-96" />{" "}
                        <Skeleton className="rounded-md h-8 w-8" />
                    </div>
                    <div className="flex pb-3 justify-between items-center self-stretch border-b-[1px] relative">
                        <Skeleton className="rounded-md  h-6 w-96" />{" "}
                        <Skeleton className="rounded-md h-8 w-8" />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-start gap-4 self-stretch">
                    {address.map((add) => (
                        <div
                            key={add.address_id}
                            className="flex pb-3 justify-between items-center self-stretch border-b-[1px] relative"
                        >
                            <div className="flex gap-3 items-center">
                                <h1 className="text-base font-medium dark:text-text-primary dark:dark:text-text-white">
                                    {handleAddress(add)}
                                </h1>
                                {add.is_default_address && (
                                    <div className="flex px-2.5 py-0.5 justify-center items-center gap-2.5 rounded-full border border-border-info-focus bg-background-info-subtle">
                                        <h1 className="text-sm font-medium text-text-info">
                                            Địa chỉ mặc định
                                        </h1>
                                    </div>
                                )}
                            </div>
                            <div
                                onClick={() =>
                                    handleAddressOption(add.address_id)
                                }
                                className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-border-neutral-default bg-background-surface_default dark:bg-background-black cursor-pointer"
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-text-primary dark:text-text-white h-4 w-4"
                                >
                                    <path d="M11.5 8C11.5 7.1875 12.1562 6.5 13 6.5C13.8125 6.5 14.5 7.1875 14.5 8C14.5 8.84375 13.8125 9.5 13 9.5C12.1562 9.5 11.5 8.84375 11.5 8ZM6.5 8C6.5 7.1875 7.15625 6.5 8 6.5C8.8125 6.5 9.5 7.1875 9.5 8C9.5 8.84375 8.8125 9.5 8 9.5C7.15625 9.5 6.5 8.84375 6.5 8ZM4.5 8C4.5 8.84375 3.8125 9.5 3 9.5C2.15625 9.5 1.5 8.84375 1.5 8C1.5 7.1875 2.15625 6.5 3 6.5C3.8125 6.5 4.5 7.1875 4.5 8Z" />
                                </svg>
                            </div>
                            {openAddressOptions &&
                                addressKey === add.address_id && (
                                    <AddressOption
                                        setDefaultAddress={setDefaultAddress}
                                        deleteAddress={deleteAddress}
                                    />
                                )}
                        </div>
                    ))}
                </div>
            )}

            {openAddressDialog && (
                <AddressDialog
                    onClose={setOpenAddressDialog}
                    customer_id={customer_id}
                    updateAddress={updateAddress}
                    onUpdateAddress={onUpdateAddress}
                    setStatusCode={setStatusCode}
                    type={type}
                />
            )}
        </div>
    );
}
// eslint-disable-next-line react/prop-types
export function AddressOption({ setDefaultAddress, deleteAddress }) {
    return (
        <div className="flex flex-col p-2 items-start bg-background-surface_default dark:bg-background-neutral-hover absolute right-0 top-10 z-[100] border border-border-neutral-default rounded-lg gap-3 w-auto">
            <div
                onClick={() => {
                    setDefaultAddress();
                }}
                className="flex flex-row p-1 w-full rounded-md  gap-1 items-start justify-start hover:bg-background-info-subtle_hover cursor-pointer text-text-info"
            >
                <FaStar size={20} />
                <h1 className="text-sm font-normal">Thiết lập mặc định</h1>
            </div>
            <div
                onClick={() => {
                    deleteAddress();
                }}
                className="flex flex-row p-1 w-full rounded-md gap-1 items-start justify-start hover:bg-background-negative-subtle_hover cursor-pointer text-text-negative"
            >
                <IoMdCloseCircle size={20} />
                <h1 className="text-sm font-normal">Xóa</h1>
            </div>
        </div>
    );
}
// eslint-disable-next-line no-unused-vars, react/prop-types
export function StatisticsActivity({ customer }) {
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
                color = "bg-background-brand-subtle";
                break;
            case 2:
                color = "bg-background-brand-subtle_press";
                break;
            case 3:
                color = "bg-background-brand-focus";
                break;
            case 4:
                color = "bg-background-brand-subtle_disabled";
                break;
            default:
                color = "bg-background-brand-medium";
        }
        return (
            <>
                <div className={`flex flex-1 w-6 h-6 rounded-md ${color}`}>
                    <h1 className="invisible">{1}</h1>
                </div>
            </>
        );
    };
    return (
        <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-border-neutral-subtle bg-background-surface_default dark:bg-background-neutral-hover">
            <h1 className="text-xl font-semibold dark:text-text-primary dark:dark:text-text-white">
                Thống kê hoạt động
            </h1>
            <div name="statistics" className="flex items-center gap-6">
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-base font-medium text-text-secondary">
                        Thời gian hoạt động
                    </h1>
                    <div className="flex items-center gap-2 self-stretch">
                        <div className="flex items-center gap-0.5 text-text-primary dark:text-text-white">
                            <span className="text-2xl font-semibold ">250</span>
                            <span className="text-2xl font-semibold">Giờ</span>
                        </div>
                        <div className="flex items-center justify-center gap-2.5 border border-b-border-positive-focus bg-background-positive-subtle rounded-full">
                            <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                                <img
                                    src="/icons/arrow-trend-up.svg"
                                    alt="arrow-trend-up"
                                />
                                <h1 className="text-text-positive font-medium text-sm">
                                    100 %
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-base font-medium text-text-secondary">
                        Chi tiêu trung bình
                    </h1>
                    <div className="flex items-center gap-2 self-stretch">
                        <div className="flex items-center gap-0.5 text-text-primary dark:text-text-white">
                            <span className="text-2xl font-semibold">250</span>
                            <span className="text-2xl font-semibold">
                                Triệu
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-2.5 border border-b-border-positive-focus bg-background-positive-subtle rounded-full">
                            <div className="flex px-1.5 py-0.5 justify-center items-center gap-1.5">
                                <img
                                    src="/icons/arrow-trend-up.svg"
                                    alt="arrow-trend-up"
                                />
                                <h1 className="text-text-positive font-medium text-sm">
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
                            <h1 className="text-sm font-medium text-text-secondary">
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
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 self-stretch">
                        {acctivities.activity_frequency.map((acc, index) => (
                            <div
                                key={"date" + index}
                                className="flex flex-col justify-center items-center flex-1"
                            >
                                <h1 className="text-sm font-medium text-text-secondary">
                                    {acc.date}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center gap-2 self-stretch">
                <h1 className="text-base font-medium dark:text-text-primary dark:dark:text-text-white">
                    Thấp
                </h1>
                <div className="flex gap-1 items-center">
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-background-brand-subtle`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-background-brand-subtle_press`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-background-brand-focus`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-background-brand-subtle_disabled`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                    <div
                        className={`flex flex-1 w-6 h-6 rounded-md bg-background-brand-medium`}
                    >
                        <h1 className="invisible">{1}</h1>
                    </div>
                </div>

                <h1 className="text-base font-medium dark:text-text-primary dark:dark:text-text-white">
                    Cao
                </h1>
            </div>
        </div>
    );
}

export function CustomerSocialMedia() {
    return (
        <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-border-neutral-subtle bg-background-surface_default dark:bg-background-neutral-hover">
            <h1 className="text-xl font-semibold dark:text-text-primary dark:dark:text-text-white">
                Mạng xã hội
            </h1>
            <div className="flex flex-col self-stretch items-start gap-4">
                <div className="flex pb-3 justify-between items-center self-stretch border-b">
                    <div className="flex items-center gap-2">
                        <img
                            src="/icons/Facebook.svg"
                            alt="facebook"
                            className="w-6 h-6"
                        />
                        <div className="flex items-center gap-1.5">
                            <h1 className="text-base font-medium dark:text-text-primary dark:dark:text-text-white">
                                Facebook
                            </h1>
                            <div className="w-2 h-2 bg-background-neutral-subtle_disabled rounded-full"></div>
                            <h1 className="text-base font-medium dark:text-text-primary dark:dark:text-text-white">
                                @thanhbui_1205
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-border-neutral-default bg-background-surface_default dark:bg-background-black cursor-pointer">
                        <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-text-primary dark:text-text-white h-4 w-4"
                        >
                            <path d="M11.5 8C11.5 7.1875 12.1562 6.5 13 6.5C13.8125 6.5 14.5 7.1875 14.5 8C14.5 8.84375 13.8125 9.5 13 9.5C12.1562 9.5 11.5 8.84375 11.5 8ZM6.5 8C6.5 7.1875 7.15625 6.5 8 6.5C8.8125 6.5 9.5 7.1875 9.5 8C9.5 8.84375 8.8125 9.5 8 9.5C7.15625 9.5 6.5 8.84375 6.5 8ZM4.5 8C4.5 8.84375 3.8125 9.5 3 9.5C2.15625 9.5 1.5 8.84375 1.5 8C1.5 7.1875 2.15625 6.5 3 6.5C3.8125 6.5 4.5 7.1875 4.5 8Z" />
                        </svg>
                    </div>
                </div>
                <div className="flex pb-3 justify-between items-center self-stretch border-b">
                    <div className="flex items-center gap-2">
                        <img
                            src="/icons/Google.svg"
                            alt="google"
                            className="w-6 h-6"
                        />
                        <div className="flex items-center gap-1.5">
                            <h1 className="text-base font-medium dark:text-text-primary dark:dark:text-text-white">
                                Google
                            </h1>
                            <div className="w-2 h-2 bg-background-neutral-subtle_disabled rounded-full"></div>
                            <h1 className="text-base font-medium dark:text-text-primary dark:dark:text-text-white">
                                thanhbui120501@gmail.com
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-border-neutral-default bg-background-surface_default dark:bg-background-black cursor-pointer">
                        <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-text-primary dark:text-text-white h-4 w-4"
                        >
                            <path d="M11.5 8C11.5 7.1875 12.1562 6.5 13 6.5C13.8125 6.5 14.5 7.1875 14.5 8C14.5 8.84375 13.8125 9.5 13 9.5C12.1562 9.5 11.5 8.84375 11.5 8ZM6.5 8C6.5 7.1875 7.15625 6.5 8 6.5C8.8125 6.5 9.5 7.1875 9.5 8C9.5 8.84375 8.8125 9.5 8 9.5C7.15625 9.5 6.5 8.84375 6.5 8ZM4.5 8C4.5 8.84375 3.8125 9.5 3 9.5C2.15625 9.5 1.5 8.84375 1.5 8C1.5 7.1875 2.15625 6.5 3 6.5C3.8125 6.5 4.5 7.1875 4.5 8Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line react/prop-types
export function SelectProvinceDropdown({ listProvince, onClose, onData }) {
    return (
        <div className="flex flex-col absolute left-1 top-10 border bg-white p-2 w-52 h-40 overflow-y-auto overflow-x-hidden gap-2">
            {
                // eslint-disable-next-line react/prop-types
                listProvince.map((pro) => (
                    <div
                        key={pro.id}
                        className="flex hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                            onClose(false);
                            onData(pro);
                        }}
                    >
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white">
                            {pro.full_name}
                        </h1>
                    </div>
                ))
            }
        </div>
    );
}

// eslint-disable-next-line react/prop-types
export function SelectDistrictDropdown({ listDistrict, onClose, onData }) {
    return (
        <div className="flex flex-col absolute left-1 top-10 border bg-white p-2 w-40 h-28 overflow-y-auto overflow-x-hidden gap-2">
            {
                // eslint-disable-next-line react/prop-types
                listDistrict?.map((dis) => (
                    <div
                        key={dis.id}
                        className="flex hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                            onClose(false);
                            onData(dis);
                        }}
                    >
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white">
                            {dis.full_name}
                        </h1>
                    </div>
                ))
            }
        </div>
    );
}

// eslint-disable-next-line react/prop-types
export function SelectWardDropdown({ listWard, onClose, onData }) {
    return (
        <div className="flex flex-col absolute left-1 top-10 border bg-white p-2 w-40 h-28 overflow-y-auto overflow-x-hidden gap-2">
            {
                // eslint-disable-next-line react/prop-types
                listWard.map((war) => (
                    <div
                        key={war.id}
                        className="flex hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                            onClose(false);
                            onData(war);
                        }}
                    >
                        <h1 className="text-sm font-medium dark:text-text-primary dark:dark:text-text-white">
                            {war.full_name}
                        </h1>
                    </div>
                ))
            }
        </div>
    );
}

export default CustomerInfo;
