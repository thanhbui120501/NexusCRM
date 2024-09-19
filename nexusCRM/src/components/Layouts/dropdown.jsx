import { FaUser } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";

export default function DropDownProfile(){
    //eslint-disable-next-line no-unused-vars
    const {user, token, setUser, setToken} = useStateContext();

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.get('/account/logout').then(() => {          
            setUser(null)
            setToken(null)
        });       
    }
    return(
        <div className="flex flex-col gap-4 dropDownProfile bg-gray-50">
            <div className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer">
                <FaUser />
                <h1 className="text-base font-medium">Thông tin</h1>
            </div>
            <div className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer" onClick={onLogout}>
                <RiLogoutBoxRFill />
                <h1 className="text-base font-medium">Đăng xuất</h1>
            </div>            
        </div>                    
    );
}