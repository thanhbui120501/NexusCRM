import { FaUser } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import { MdOutlineLogout } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

export default function DropDownProfile() {
    //eslint-disable-next-line no-unused-vars
    const { user, token, setUser, setToken } = useStateContext();
    //set loading
    const [loading, setLoading] = useState(false);
    const onLogout = async (ev) => {
        toast.dismiss();
        try {
            ev.preventDefault();

            setLoading(true);
            const response = await axiosClient.post("/account/logout");
            if (response.status === 204) {
                setUser(null);
                setToken(null);
            }
        } catch (err) {
            const response = err.response;
            console.log(response.message);
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        toast.dismiss();
        // Hiển thị thông báo xác nhận
        toast(
            <div className="flex flex-col items-center p-2  bg-background-surface_default rounded-lg">
                <span className="text-text-primary font-medium">
                    Bạn có chắc muốn đăng xuất?
                </span>
                <div className="flex gap-4 mt-4 justify-between items-center">
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-background-negative-default text-text-white rounded-md hover:bg-background-negative-hover transition duration-200 focus:outline-none focus:ring-2"
                    >
                        Đăng xuất
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-4 py-2 bg-background-neutral-default text-text-white rounded-md hover:bg-background-neutral-hover transition duration-200 focus:outline-none focus:ring-2"
                    >
                        Hủy
                    </button>
                </div>
            </div>,
            {
                position: "top-center", // Vị trí hiển thị
                autoClose: 3000,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        );
    };
    return (
        <div className="flex flex-col gap-4 dropDownProfile bg-background-surface_default dark:bg-background-neutral-hover">
            <div className="flex p-1 justify-start items-center gap-2 hover:bg-background-surface_default dark:hover:bg-background-neutral-press rounded-md cursor-pointer">
                <FaUser className="text-text-primary dark:text-text-white" />
                <h1 className="text-base font-medium text-text-primary dark:text-text-white">
                    Thông tin cá nhân
                </h1>
            </div>
            <div
                className="flex p-1 justify-start items-center gap-2 hover:bg-background-surface_default dark:hover:bg-background-neutral-press rounded-md cursor-pointer text-text-negative"
                onClick={handleLogout}
            >
                <MdOutlineLogout />
                <h1 className="text-base font-medium">Đăng xuất</h1>
            </div>
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-background-neutral-default bg-opacity-50 z-[100] items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-background-brand-default border-solid"></div>
                    <h1 className="text-lg font-medium text-text-white">
                        Đang đăng xuất
                    </h1>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
