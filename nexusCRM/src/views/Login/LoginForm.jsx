import React, { useRef, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import DialogComponent from "../../components/dialog";
import LoginValidation from "../../validation";

// eslint-disable-next-line react/prop-types
function LoginForm({ onLoading }) {
    //set dialog message
    const [dialogMessage, setDialogMessage] = React.useState(null);
    //Handle show and hide password
    const [values, setValues] = React.useState({
        password: "",
        username: "",
        showPassword: false,
        rememberPassword: false,
    });
    //errorMessage
    const [, setErrorMessage] = React.useState("");
    //check lock login
    const [isLocked, setIsLocked] = React.useState(false);
    //set locked time
    const [remainingTime, setRemainingTime] = React.useState(0);
    //set errors
    const [errors, setError] = React.useState({});

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleClickRememberPassword = () => {
        setValues({
            ...values,
            rememberPassword: !values.rememberPassword,
        });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
    };

    const handleUsernameChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
    };

    // eslint-disable-next-line no-unused-vars
    function handleInput(event) {
        const newObj = {
            ...values,
            [event.target.name]: event.target.value,
        };
        setValues(newObj);
    }

    //Login
    const usernameRef = useRef();
    const passwordRef = useRef();
    // eslint-disable-next-line no-unused-vars
    const rememberpasswordRef = useRef();
    //set user and token
    const { setUser, setToken } = useStateContext();
    //show dialog
    const [open, setOpen] = React.useState(false);
    //set value show dialog
    const [dialog, setValuesDialog] = React.useState({
        title: "",
        description: "",
        color: "",
        bgColor: "",
        hoverColor: "",
    });
    useEffect(() => {
        const lockTime = localStorage.getItem("lockTime");
        if (lockTime) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - lockTime;
            const initialRemainingTime = 60000 - elapsedTime;
            if (initialRemainingTime > 0) {
                setIsLocked(true);
                setRemainingTime(Math.ceil(initialRemainingTime / 1000));

                const countdownInterval = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        if (prevTime <= 1) {
                            clearInterval(countdownInterval);
                            setIsLocked(false);
                            localStorage.removeItem("lockTime");
                            return 0;
                        }
                        return prevTime - 1;
                    });
                }, 1000);

                return () => clearInterval(countdownInterval);
            } else {
                localStorage.removeItem("lockTime");
            }
        }
    }, []);
    const handleClickToOpen = () => {
        setOpen(true);
    };

    const handleToClose = () => {
        setOpen(false);
    };
    React.useEffect(() => {
        if (dialogMessage) {
            setValuesDialog(dialogMessage);
            handleClickToOpen();
        }
    }, [dialogMessage]);
    //on login
    const Submit = async (ev) => {
        try {
            ev.preventDefault();
            if (isLocked) {
                setErrorMessage(
                    `Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ${remainingTime} giây.`
                );
                return;
            }

            onLoading(true);
            setError(LoginValidation(values));

            const data = new FormData();
            data.append("username", usernameRef.current.value);
            data.append("password", passwordRef.current.value);

            const response = await axiosClient.post("/account/login", data);
            if (response.status === 200) {
                localStorage.removeItem("loginAttempts");
                localStorage.removeItem("lockTime");
                setUser(response.data.data, values.rememberPassword);
                setToken(response.data.Bearer_token, values.rememberPassword);
                setDialogMessage(null);
                setErrorMessage("");
            }
        } catch (err) {
            const response = err.response;
            const maxAttempts = 3;
            const storedAttempts =
                parseInt(localStorage.getItem("loginAttempts")) || 0;
            if (response.status === 422) {
                console.log(response);
            }
            if (response.status === 401) {
                const newAttempts = storedAttempts + 1;
                if (newAttempts >= maxAttempts) {
                    localStorage.setItem("lockTime", Date.now());
                    setIsLocked(true);
                    setRemainingTime(60);

                    const countdownInterval = setInterval(() => {
                        setRemainingTime((prevTime) => {
                            if (prevTime <= 1) {
                                clearInterval(countdownInterval);
                                setIsLocked(false);
                                localStorage.removeItem("lockTime");
                                return 0;
                            }
                            return prevTime - 1;
                        });
                    }, 1000);
                    localStorage.removeItem("loginAttempts");
                    setErrorMessage(
                        "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 60 giây."
                    );
                } else {
                    localStorage.setItem("loginAttempts", newAttempts);
                    setErrorMessage(
                        `Đăng nhập thất bại. Bạn còn ${
                            maxAttempts - newAttempts
                        } lần thử.`
                    );
                }

                setDialogMessage({
                    title: "Đăng nhập thất bại",
                    description:
                        "Tài khoản hoặc mật khẩu không chính xác, vui lòng kiểm tra lại thông tin đăng nhập. Xin cảm ơn ❤️",
                    color: "text-red-600",
                    bgColor: "bg-red-600",
                    hoverColor: "hover:bg-red-500",
                });
            }
            if (response.status === 403) {
                setDialogMessage({
                    title: "Đăng nhập thất bại",
                    description:
                        "Tài khoản của bạn đã bị vô hiệu hóa nên bạn không thể đăng nhập vào hệ thống, vui lòng liên hệ với quản trị liên để có thêm thông tin chi tiết. Xin cảm ơn ❤️",
                    color: "text-orange-600",
                    bgColor: "bg-orange-600",
                    hoverColor: "hover:bg-orange-500",
                });
            }
        } finally {
            onLoading(false);
        }
    };
    return (
        <form
            name="frm-login"
            className="flex flex-col self-center px-6 mt-12 max-w-full font-sans w-[416px] max-md:px-5 max-md:mt-10"
            onSubmit={Submit}
        >
            <h2 className="text-3xl font-semibold leading-none text-text-primary dark:text-text-white">
                Đăng nhập
            </h2>
            <div className="flex flex-col mt-8 w-full">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full text-text-primary dark:text-text-white">
                        <div className="flex flex-col w-full gap-2">
                            <label
                                htmlFor="username"
                                className="flex items-center self-start text-sm font-medium leading-none"
                            >
                                Tên đăng nhập
                            </label>
                            <div className="flex px-2 py-2 border border-solid rounded-lg border-border-neutral-subtle dark:border-border-white  bg-background-surface_default dark:bg-background-neutral-hover  text-text-primary dark:text-text-white">
                                <input
                                    type="text"
                                    id="username"
                                    className="flex pl-1 py-1 gap-2 items-center w-full focus:outline-none focus:ring-1 focus:ring-border-brand-default dark:focus:bg-background-neutral-press  whitespace-nowrap rounded-lg text-text-primary dark:text-text-white bg-background-surface_default dark:bg-background-neutral-hover"
                                    onChange={handleUsernameChange("username")}
                                    placeholder="Nhập tên đăng nhập"
                                    ref={usernameRef}
                                />
                            </div>

                            {errors.username && (
                                <p className="text-red-600 pt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col mt-6 w-full">
                        <div className="flex flex-col w-full gap-2">
                            <label
                                htmlFor="password"
                                className="flex items-center self-start text-sm font-medium leading-none text-text-primary dark:text-text-white"
                            >
                                Mật khẩu
                            </label>
                            <div className="flex justify-center items-center gap-2 px-2 py-2 border border-solid rounded-lg border-border-neutral-subtle dark:border-border-white  bg-background-surface_default dark:bg-background-neutral-hover  text-text-primary dark:text-text-white">
                                <input
                                    type={
                                        values.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    onChange={handlePasswordChange("password")}
                                    value={values.password}
                                    className="flex-1 shrink pl-1 py-1  rounded-lg self-stretch focus:outline-none focus:ring-1 focus:ring-border-brand-default text-base font-normal text-text-primary dark:text-text-white bg-background-surface_default dark:bg-background-neutral-hover dark:focus:bg-background-neutral-press "
                                    placeholder="Nhập mật khẩu"
                                    ref={passwordRef}
                                />
                                <svg
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    viewBox="0 0 24 19"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="h-5 w-5 cursor-pointer text-text-primary dark:text-text-white right-0 top-1/3"
                                >
                                    <path
                                        d={
                                            values.showPassword
                                                ? "M6.35938 4.13281C8.11719 2.80469 10.3047 1.75 13 1.75C16.125 1.75 18.6641 3.19531 20.5 4.91406C22.3359 6.59375 23.5469 8.625 24.1328 10.0312C24.25 10.3438 24.25 10.6953 24.1328 11.0078C23.625 12.2578 22.5703 14.0547 21.0078 15.6172L25.1094 18.8594C25.5391 19.1719 25.6172 19.7578 25.2656 20.1484C24.9531 20.5781 24.3672 20.6562 23.9766 20.3047L0.851562 2.17969C0.421875 1.86719 0.34375 1.28125 0.695312 0.890625C1.00781 0.460938 1.59375 0.382812 1.98438 0.734375L6.35938 4.13281ZM7.88281 5.34375L9.67969 6.75C10.5781 5.96875 11.7109 5.5 13 5.5C15.7344 5.5 18 7.76562 18 10.5C18 11.3594 17.7656 12.1406 17.4141 12.8047L19.5234 14.4453C20.8516 13.1172 21.7891 11.5938 22.2969 10.5C21.75 9.32812 20.7344 7.6875 19.2109 6.28125C17.6094 4.79688 15.5391 3.625 13 3.625C11.0078 3.625 9.28906 4.32812 7.88281 5.34375ZM15.8906 11.6328C16.0469 11.2812 16.125 10.8906 16.125 10.5C16.125 8.78125 14.7188 7.375 13 7.375C12.9609 7.375 12.9219 7.375 12.8828 7.375C12.9609 7.60938 13 7.80469 13 8C13 8.42969 12.8828 8.78125 12.7266 9.13281L15.8906 11.6328ZM16.2812 16.7109L17.9219 18C16.4766 18.7812 14.8359 19.25 13 19.25C9.83594 19.25 7.29688 17.8438 5.46094 16.125C3.625 14.4062 2.41406 12.375 1.82812 11.0078C1.71094 10.6953 1.71094 10.3438 1.82812 10.0312C2.21875 9.13281 2.84375 8 3.74219 6.82812L5.1875 8C4.48438 8.89844 3.97656 9.79688 3.66406 10.5C4.21094 11.6719 5.22656 13.3516 6.75 14.7578C8.35156 16.2422 10.4219 17.375 13 17.375C14.1719 17.375 15.2656 17.1406 16.2812 16.7109ZM8 10.5C8 10.4219 8 10.3047 8 10.1875L10.1875 11.9062C10.5781 12.7266 11.3594 13.3516 12.2969 13.5469L14.4844 15.3047C14.0156 15.4219 13.5078 15.5 12.9609 15.5C10.2266 15.5 7.96094 13.2734 7.96094 10.5H8Z"
                                                : "M7 9.5C7 6.76562 9.22656 4.5 12 4.5C14.7344 4.5 17 6.76562 17 9.5C17 12.2734 14.7344 14.5 12 14.5C9.22656 14.5 7 12.2734 7 9.5ZM12 12.625C13.7188 12.625 15.125 11.2578 15.125 9.5C15.125 7.78125 13.7188 6.375 12 6.375C11.9609 6.375 11.9219 6.375 11.8828 6.375C11.9609 6.60938 12 6.80469 12 7C12 8.40625 10.8672 9.5 9.5 9.5C9.26562 9.5 9.07031 9.5 8.875 9.42188C8.875 9.46094 8.875 9.5 8.875 9.5C8.875 11.2578 10.2422 12.625 12 12.625ZM4.46094 3.91406C6.29688 2.19531 8.83594 0.75 12 0.75C15.125 0.75 17.6641 2.19531 19.5 3.91406C21.3359 5.59375 22.5469 7.625 23.1328 9.03125C23.25 9.34375 23.25 9.69531 23.1328 10.0078C22.5469 11.375 21.3359 13.4062 19.5 15.125C17.6641 16.8438 15.125 18.25 12 18.25C8.83594 18.25 6.29688 16.8438 4.46094 15.125C2.625 13.4062 1.41406 11.375 0.828125 10.0078C0.710938 9.69531 0.710938 9.34375 0.828125 9.03125C1.41406 7.625 2.625 5.59375 4.46094 3.91406ZM12 2.625C9.42188 2.625 7.35156 3.79688 5.75 5.28125C4.22656 6.6875 3.21094 8.32812 2.66406 9.5C3.21094 10.6719 4.22656 12.3516 5.75 13.7578C7.35156 15.2422 9.42188 16.375 12 16.375C14.5391 16.375 16.6094 15.2422 18.2109 13.7578C19.7344 12.3516 20.75 10.6719 21.2969 9.5C20.75 8.32812 19.7344 6.6875 18.2109 5.28125C16.6094 3.79688 14.5391 2.625 12 2.625Z"
                                        }
                                    />
                                    {}
                                </svg>
                            </div>
                            {errors.password && (
                                <p className="text-red-600 pt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 items-center self-start mt-6">
                        <input
                            id="default-checkbox"
                            type="checkbox"
                            checked={values.rememberPassword}
                            onChange={handleClickRememberPassword}
                            className="w-4 h-4 text-text-brand ring-1 ring-background-neutral-default bg-background-neutral-subtle_hover rounded focus:ring-background-brand-default dark:focus:ring-background-brand-hover dark:ring-offset-gray-800 focus:ring-2"
                        />
                        <label
                            htmlFor="default-checkbox"
                            className="ms-2 text-sm font-medium text-text-primary dark:text-text-white"
                        >
                            Ghi nhớ đăng nhập
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="flex overflow-hidden flex-col mt-8 w-full text-base font-semibold text-center text-text-white dark:text-text-primary rounded-lg"
                >
                    <span
                        className={`flex-1 shrink gap-2 self-stretch px-4 py-3 w-full bg-background-neutral-default dark:bg-background-surface_default hover:bg-background-neutral-hover dark:hover:bg-background-neutral-subtle_hover`}
                    >
                        Đăng nhập
                    </span>
                </button>

                {/* {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>} */}
                {isLocked && (
                    <p className="mt-2 text-sm font-medium text-text-negative">
                        Đăng nhập sai quá nhiều lần, thử lại sau {remainingTime}{" "}
                        giây
                    </p>
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
        </form>
    );
}

export default LoginForm;
