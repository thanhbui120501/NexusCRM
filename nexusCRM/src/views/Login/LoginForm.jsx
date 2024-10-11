import React, { useRef } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import DialogComponent from "../../components/dialog";
import LoginValidation from "../../validation";

//import { useState } from 'react'
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

function LoginForm() {
    //Handle show and hide password
    const [values, setValues] = React.useState({
        password: "",
        username: "thanhbui120501",
        showPassword: false,
        rememberPassword: false,
    });
    //set loading
    const [loading, setLoading] = React.useState(false);
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

    const handleClickToOpen = () => {
        setOpen(true);
    };

    const handleToClose = () => {
        setOpen(false);
    };
    //on login
    const Submit = async (ev) => {
        try {
            ev.preventDefault();
            setLoading(true);
            setError(LoginValidation(values));

            const data = new FormData();
            data.append("username", usernameRef.current.value);
            data.append("password", passwordRef.current.value);
            data.append(
                "remember_token",
                values.rememberPassword ? "true" : "false"
            );

            const response = await axiosClient.post("/account/login", data);
            console.log(response.status);
            if (response.status === 200) {
                setUser(response.data.data);
                setToken(response.data.Bearer_token);
            }
            if (response.status === 401) {
                setValuesDialog({
                    ...dialog,
                    title: "Đăng nhập thất bại",
                    description:
                        "Tài khoản hoặc mật khẩu không chính xác, vui lòng kiểm tra lại thông tin đăng nhập. Xin cảm ơn ❤️",
                    color: "text-red-600",
                    bgColor: "bg-red-600",
                    hoverColor: "hover:bg-red-500",
                });
                handleClickToOpen();
            }
            if (response.status === 403) {
                setValuesDialog({
                    ...dialog,
                    title: "Đăng nhập thất bại",
                    description:
                        "Tài khoản của bạn đã bị vô hiệu hóa nên bạn không thể đăng nhập vào hệ thống, vui lòng liên hệ với quản trị liên để có thêm thông tin chi tiết. Xin cảm ơn ❤️",
                    color: "text-orange-600",
                    bgColor: "bg-orange-600",
                    hoverColor: "hover:bg-orange-500",
                });
                handleClickToOpen();
            }
        } catch (err) {
            const response = err.response;
            if (response.status === 422) {
                console.log(response);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <form
            name="frm-login"
            className="flex flex-col self-center px-6 mt-12 max-w-full font-sans w-[416px] max-md:px-5 max-md:mt-10"
            onSubmit={Submit}
        >
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[10] items-center justify-center pb-40 rounded-xl">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                    <h1 className="text-sm font-medium text-white">Đang đăng nhập</h1>
                </div>
            )}
            <h2 className="text-3xl font-semibold leading-none text-neutral-900">
                Đăng nhập
            </h2>
            <div className="flex flex-col mt-8 w-full">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full text-neutral-900">
                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="username"
                                className="flex items-center self-start text-sm font-medium leading-none"
                            >
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="flex gap-2 items-center px-3 py-2 mt-1.5 w-full text-base whitespace-nowrap rounded-lg border border-solid border-neutral-200"
                                onChange={handleUsernameChange("username")}
                                placeholder="Nhập tên đăng nhập"
                                ref={usernameRef}
                            />
                            {errors.username && (
                                <p className="text-red-600 pt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col mt-6 w-full">
                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="password"
                                className="flex items-center self-start text-sm font-medium leading-none text-neutral-900"
                            >
                                Mật khẩu
                            </label>
                            <div className="flex gap-2 items-center px-3 py-2 mt-1.5 w-full rounded-lg border border-solid border-neutral-200">
                                <input
                                    type={
                                        values.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    onChange={handlePasswordChange("password")}
                                    value={values.password}
                                    className="flex-1 shrink gap-0.5 self-stretch my-auto min-w-[240px] border-neutral-200"
                                    placeholder="Nhập mật khẩu"
                                    ref={passwordRef}
                                />
                                <img
                                    alt="eye-image"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    src={
                                        values.showPassword
                                            ? "../src/assets/showpassword.png"
                                            : "../src/assets/hidepassword.png"
                                    }
                                    className="w-5 h-5"
                                ></img>
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
                            type="checkbox"
                            checked={values.rememberPassword}
                            onChange={handleClickRememberPassword}
                            id="remember"
                            className="h-4 w-4  bg-gray-100 border-gray-300 rounded-lg accent-[#EA580C]"
                        />
                        <label
                            htmlFor="remember"
                            className="self-stretch my-auto text-sm font-medium leading-none text-neutral-900"
                        >
                            Ghi nhớ tài khoản
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    //disabled={values.username!="" && values.password!="" ? true : false } //
                    className="flex overflow-hidden flex-col mt-8 w-full text-base font-semibold text-center text-white rounded-lg"
                >
                    <span
                        className={`flex-1 shrink gap-2 self-stretch px-4 py-3 w-full bg-neutral-900 hover:bg-neutral-800 `}
                    >
                        Đăng nhập
                    </span>
                </button>
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
