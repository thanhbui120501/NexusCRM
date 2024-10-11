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
        try{
            ev.preventDefault();
            
            setLoading(true);
            const response = await axiosClient.post("/account/logout");
            if(response.status === 204){
                setUser(null);
                setToken(null);
            }
        }catch(err){
            const response = err.response;
            console.log(response.message);
        }finally{
            setLoading(false);
        }
        
    };
    const handleLogout = () => {
        toast.dismiss();
        // Hiển thị thông báo xác nhận
        toast(
            <div className="flex flex-col items-center p-2  bg-white rounded-lg ">
                <span className="text-gray-800 font-medium">Bạn có chắc muốn đăng xuất?</span>
                <div className="flex gap-4 mt-4 justify-between items-center">
                    <button 
                        onClick={onLogout} 
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Đăng xuất
                    </button>
                    <button 
                        onClick={() => toast.dismiss()} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
        <div className="flex flex-col gap-4 dropDownProfile bg-gray-50">
            <div className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer">
                <FaUser />
                <h1 className="text-base font-medium">Thông tin</h1>
            </div>
            <div
                className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer text-red-600"
                onClick={handleLogout}
            >
                <MdOutlineLogout />
                <h1 className="text-base font-medium">Đăng xuất</h1>
            </div>
            {loading && (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-10 items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-solid"></div>
                    <h1 className="text-sm font-medium text-white">Đang đăng xuất</h1>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
