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
export default CustomerInfo;
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
                    onCloseUpdate(false);
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
                className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-x-gray-200"
                autoComplete="off"
                onSubmit={onSubmit}
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
                        <div
                            className={`flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] ${
                                openUpdateButton ? "bg-[#fff]" : "bg-[#F5F5F5]"
                            }`}
                        >
                            <input
                                readOnly={openUpdateButton ? false : true}
                                type="text"
                                value={fullName}
                                className={`${
                                    openUpdateButton
                                        ? "bg-[#fff]"
                                        : "bg-[#F5F5F5]"
                                } flex flex-1 gap-0.5`}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <div name="prefix"></div>
                        </div>
                        {errors.fullname && (
                            <h1
                                className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                            >
                                {errors.fullname}
                            </h1>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                        <h1 className="text-sm font-medium text-[#171717]">
                            Giới tính
                        </h1>
                        <div
                            className={`flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] ${
                                openUpdateButton ? "bg-[#fff]" : "bg-[#F5F5F5]"
                            }`}
                        >
                            <input
                                readOnly
                                type="text"
                                value={handleGender(gender)}
                                className={`${
                                    openUpdateButton
                                        ? "bg-[#fff]"
                                        : "bg-[#F5F5F5]"
                                } flex flex-1 gap-0.5`}
                                onChange={() => {}}
                            />
                            <div name="prefix" className="cursor-pointer">
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="gender"
                                    onClick={() => {
                                        openUpdateButton &&
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
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                        <h1 className="text-sm font-medium text-[#171717]">
                            Ngày sinh
                        </h1>
                        <div
                            className={`flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] ${
                                openUpdateButton ? "bg-[#fff]" : "bg-[#F5F5F5]"
                            }`}
                        >
                            <input
                                readOnly
                                type="text"
                                value={birthDay}
                                className={`${
                                    openUpdateButton
                                        ? "bg-[#fff]"
                                        : "bg-[#F5F5F5]"
                                } flex flex-1 gap-0.5`}
                                onChange={() => {}}
                            />
                            <div name="prefix" className="cursor-pointer">
                                <img
                                    src="/icons/calendar.svg"
                                    alt="calendar"
                                    onClick={() => {
                                        openUpdateButton &&
                                            setOpenCalendar(!openCalendar);
                                    }}
                                />
                            </div>
                        </div>
                        {errors.birthDay && (
                            <h1
                                className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
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
                        <h1 className="text-sm font-medium text-[#171717] flex flex-1 gap-0.5">
                            Email
                        </h1>
                        <div
                            className={`flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] ${
                                openUpdateButton ? "bg-[#fff]" : "bg-[#F5F5F5]"
                            }`}
                        >
                            <input
                                readOnly={openUpdateButton ? false : true}
                                type="text"
                                value={email}
                                className={`${
                                    openUpdateButton
                                        ? "bg-[#fff]"
                                        : "bg-[#F5F5F5]"
                                } flex flex-1 gap-0.5`}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div name="prefix"></div>
                        </div>
                        {errors.email && (
                            <h1
                                className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                            >
                                {errors.email}
                            </h1>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1">
                        <h1 className="text-sm font-medium text-[#171717]">
                            Số điện thoại
                        </h1>
                        <div
                            className={`flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] ${
                                openUpdateButton ? "bg-[#fff]" : "bg-[#F5F5F5]"
                            }`}
                        >
                            <input
                                readOnly={openUpdateButton ? false : true}
                                type="text"
                                value={phone}
                                className={`${
                                    openUpdateButton
                                        ? "bg-[#fff]"
                                        : "bg-[#F5F5F5]"
                                } flex flex-1 gap-0.5`}
                                onChange={(e) => handleChange(e)}
                                onKeyDown={handleKeyDown}
                            />
                            <div name="prefix"></div>
                        </div>
                        {errors.phone && (
                            <h1
                                className={`font-medium text-sm text-[#DC2626] text-ellipsis whitespace-nowrap overflow-hidden`}
                            >
                                {errors.phone}
                            </h1>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-start gap-2.5 flex-1 relative">
                        <h1 className="text-sm font-medium text-[#171717]">
                            Trạng thái
                        </h1>
                        <div
                            className={`flex py-2 px-3 items-center gap-2 self-stretch border rounded-lg border-[#E5E5E5] ${
                                openUpdateButton ? "bg-[#fff]" : "bg-[#F5F5F5]"
                            }`}
                        >
                            <input
                                type="text"
                                value={handleStatus(status)}
                                className={`${
                                    openUpdateButton
                                        ? "bg-[#fff]"
                                        : "bg-[#F5F5F5]"
                                } flex flex-1 gap-0.5`}
                                readOnly
                            />
                            <div name="prefix" className="cursor-pointer">
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    onClick={() => {
                                        openUpdateButton &&
                                            setOpenStatusDrop(!openStatusDrop);
                                    }}
                                />
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
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-[900] flex flex-col items-center justify-center ">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                        <h1 className="text-sm font-medium text-white">
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
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [openCreateAddress, setOpenCreateAddress] = useState(false);
    const [openSelectProvince, setOpenSelectProvince] = useState(false);
    const [openSelectDistrict, setOpenSelectDistrict] = useState(false);
    const [openSelectWard, setOpenSelectWard] = useState(false);
    //set province
    const [listProvince, getListProvince] = useState([]);
    const [province, setProvince] = useState({});
    //set district
    const [listDistrict, getListDistrict] = useState([]);
    const [district, setDistrict] = useState({});
    //set ward
    const [listWard, getListWard] = useState([]);
    const [ward, setWard] = useState({});
    //address line
    const [addressLine, setAddressLine] = useState("");
    //het list province
    useEffect(() => {
        getAddress();
        getListProvinces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //get list district
    useEffect(() => {
        if (province && Object.keys(province).length > 0) {
            getListDistricts(province.id);
        }
    }, [province]);

    //get list ward
    useEffect(() => {
        if (district && Object.keys(district).length > 0) {
            getListWards(district.id);
        }
    }, [district]);
    const getListDistricts = async (id) => {
        try {
            const response = await axiosClient.get(
                `/province/get-list-district/${id}`
            );
            if (response.status === 200) {
                getListDistrict(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getListWards = async (id) => {
        try {
            const response = await axiosClient.get(
                `/province/get-list-ward/${id}`
            );
            if (response.status === 200) {
                getListWard(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
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
    const getListProvinces = async () => {
        try {
            const response = await axiosClient.get(
                "/province/get-list-province"
            );

            if (response.status === 200) {
                getListProvince(response.data.data);
            }
        } catch (error) {
            console.log(error);
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
            add.ward +
            ", " +
            add.town +
            ", " +
            add.province
        );
    };
    const handleChange = (e) => {
        const maxWords = 100;
        const value = e.target.value;
        const words = value.trim().split(/\s+/);

        // Kiểm tra số từ và ký tự đặc biệt
        if (words.length <= maxWords) {
            setAddressLine(value);
        }
    };
    const onCreateAddress = async () => {
        try {
            setLoadingCreate(true);
            const data = new FormData();
            data.append("address_line", addressLine);
            data.append("province", province.full_name);
            data.append("town", ward.full_name);
            data.append("ward", district.full_name);
            data.append("country", "Việt Nam");
            const response = await axiosClient.post(
                "/address/create-customer-address",
                data,
                {
                    params: {
                        customer_id: customer_id,
                    },
                }
            );

            if (response.status === 201) {
                toast.success("Thêm địa chỉ thành công!", {
                    position: "top-right",
                    autoClose: 4000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getAddress();
                setOpenCreateAddress(false);
                setProvince({});
                setDistrict({});
                setWard({});
                setAddressLine("");
            }
        } catch (error) {
            console.error("Lỗi khi tạo địa chỉ:", error);
        } finally {
            setLoadingCreate(false);
        }
    };
    return (
        <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-gray-200">
            <h1 className="text-xl font-semibold text-[#171717]">Địa chỉ</h1>
            {loading ? (
                <div className="flex flex-col items-start gap-4 self-stretch">
                    <Skeleton className="h-6 w-60" />
                    <Skeleton className="h-6 w-60" />
                    <Skeleton className="h-6 w-60" />
                    <Skeleton className="h-6 w-20" />
                </div>
            ) : (
                <div className="flex flex-col items-start gap-4 self-stretch">
                    {address.map((add) => (
                        <div
                            key={add.address_id}
                            className="flex pb-3 justify-between items-center self-stretch border-b-[1px]"
                        >
                            <div className="flex gap-3 items-center">
                                <h1 className="text-base font-medium text-[#171717]">
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
                            <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-[#E5E5E5] bg-[#fff] cursor-pointer">
                                <img src="/icons/ellipsis.svg" alt="" />
                            </div>
                        </div>
                    ))}
                    {openCreateAddress && (
                        <div className="flex gap-3 items-start justify-start self-stretch">
                            <input
                                type="text"
                                placeholder="Nhập địa chỉ"
                                className="border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                onChange={handleChange}
                                value={addressLine}
                            />
                            <div className="flex border border-gray-200 rounded-lg gap-2 p-2 cursor-pointer relative">
                                <div className="flex flex-1">
                                    <h1 className="text-sm font-medium text-[#171717]">
                                        {ward && Object.keys(ward).length > 0
                                            ? ward.full_name
                                            : "Xã/Phường/Thị trấn"}
                                    </h1>
                                </div>
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    onClick={() => {
                                        district &&
                                            Object.keys(district).length > 0 &&
                                            setOpenSelectWard(!openSelectWard);
                                    }}
                                />
                                {openSelectWard && (
                                    <SelectWardDropdown
                                        listWard={listWard}
                                        onClose={setOpenSelectWard}
                                        onData={setWard}
                                    />
                                )}
                            </div>
                            <div className="flex border border-gray-200 rounded-lg gap-2 p-2 cursor-pointer relative">
                                <div className="flex flex-1">
                                    <h1 className="text-sm font-medium text-[#171717]">
                                        {district &&
                                        Object.keys(district).length > 0
                                            ? district.full_name
                                            : "Quận/Huyện"}
                                    </h1>
                                </div>
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    onClick={() => {
                                        province &&
                                            Object.keys(province).length > 0 &&
                                            setOpenSelectDistrict(
                                                !openSelectDistrict
                                            );
                                    }}
                                />
                                {openSelectDistrict && (
                                    <SelectDistrictDropdown
                                        listDistrict={listDistrict}
                                        onClose={setOpenSelectDistrict}
                                        onData={setDistrict}
                                    />
                                )}
                            </div>
                            <div className="flex border border-gray-200 rounded-lg gap-2 p-2 cursor-pointer relative">
                                <div className="flex flex-1">
                                    <h1 className="text-sm font-medium text-[#171717]">
                                        {province &&
                                        Object.keys(province).length > 0
                                            ? province.full_name
                                            : "Tỉnh/Thành"}
                                    </h1>
                                </div>
                                <img
                                    src="/icons/angle-down.svg"
                                    alt="angle-down"
                                    onClick={() =>
                                        setOpenSelectProvince(
                                            !openSelectProvince
                                        )
                                    }
                                />
                                {openSelectProvince && (
                                    <SelectProvinceDropdown
                                        listProvince={listProvince}
                                        onClose={setOpenSelectProvince}
                                        onData={setProvince}
                                    />
                                )}
                            </div>
                            {addressLine != "" &&
                                province &&
                                Object.keys(province).length > 0 &&
                                district &&
                                Object.keys(district).length > 0 &&
                                ward &&
                                Object.keys(ward).length > 0 && (
                                    <div
                                        onClick={() => {
                                            listDistrict.some(
                                                (item) =>
                                                    item.id === district.id
                                            ) &&
                                                listWard.some(
                                                    (item) =>
                                                        item.id === ward.id
                                                ) &&
                                                onCreateAddress();
                                        }}
                                        className="flex p-2 cursor-pointer  items-center justify-center gap-2 self-stretch bg-orange-600 rounded-lg  hover:bg-orange-400"
                                    >
                                        <h1 className="text-xs font-semibold text-[#ffff]">
                                            Cập nhật
                                        </h1>
                                    </div>
                                )}
                        </div>
                    )}

                    <div className="flex gap-3 items-center justify-center">
                        <div
                            onClick={() =>
                                address.length < 10 &&
                                setOpenCreateAddress(!openCreateAddress)
                            }
                            className={`flex py-2 cursor-pointer px-3 items-center justify-center gap-2 self-stretch ${
                                address.length < 10 && "hover:bg-gray-600"
                            }  rounded-lg w-[123px] h-8  ${
                                address.length >= 10
                                    ? "bg-gray-400"
                                    : "bg-[#171717]"
                            } `}
                        >
                            <img src="/icons/plus.svg" alt="plus" />
                            <h1 className="text-xs font-semibold text-[#ffff]">
                                Thêm địa chỉ
                            </h1>
                        </div>
                        {address.length >= 10 && (
                            <h1 className="text-sm font-medium text-red-600">
                                Số lượng địa chỉ đã đạt giới hạn
                            </h1>
                        )}
                        {openCreateAddress &&
                            (listDistrict.some(
                                (item) => item.id === district.id
                            ) === false ||
                                addressLine === "" ||
                                listWard.some((item) => item.id === ward.id) ===
                                    false) && (
                                <h1 className="text-sm font-medium text-red-600">
                                    Địa chỉ không hợp lệ
                                </h1>
                            )}
                    </div>
                </div>
            )}
            {loadingCreate && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                    <h1 className="text-sm font-medium text-white">
                        Đang thêm mới địa chỉ
                    </h1>
                </div>
            )}
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

export function CustomerSocialMedia() {
    return (
        <div className="flex p-6 flex-col items-start gap-6 self-stretch border rounded-xl border-gray-200">
            <h1 className="text-xl font-semibold text-[#171717]">
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
                            <h1 className="text-base font-medium text-[#171717]">
                                Facebook
                            </h1>
                            <div className="w-2 h-2 bg-[#D4D4D4] rounded-full"></div>
                            <h1 className="text-base font-medium text-[#171717]">
                                @thanhbui_1205
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-[#E5E5E5] bg-[#fff] cursor-pointer">
                        <img src="/icons/ellipsis.svg" alt="" />
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
                            <h1 className="text-base font-medium text-[#171717]">
                                Google
                            </h1>
                            <div className="w-2 h-2 bg-[#D4D4D4] rounded-full"></div>
                            <h1 className="text-base font-medium text-[#171717]">
                                thanhbui120501@gmail.com
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2.5 p-2 border rounded-lg border-[#E5E5E5] bg-[#fff] cursor-pointer">
                        <img src="/icons/ellipsis.svg" alt="" />
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
                        <h1 className="text-sm font-medium text-[#171717]">
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
                        <h1 className="text-sm font-medium text-[#171717]">
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
                        <h1 className="text-sm font-medium text-[#171717]">
                            {war.full_name}
                        </h1>
                    </div>
                ))
            }
        </div>
    );
}
