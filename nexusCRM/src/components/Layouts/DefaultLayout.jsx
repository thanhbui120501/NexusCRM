//import { useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/contextprovider";
import { Navigate, Outlet } from "react-router-dom";

export default function DefaultLayout(){
    // eslint-disable-next-line no-unused-vars
    const {user, token, setUser, setToken} = useStateContext();
    if(!token){
        return <Navigate to='/login' />
    }

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.get('/account/logout').then(() => {
            setUser(null)
            setToken(null)
        });       
    }
    // useEffect(() => {

    // })
    return(
        <div>
            <h1 className="text-3xl font-bold underline"> User name: {token}</h1>                   
            <Outlet />
            <a href="#" onClick={onLogout}>Logout</a>
        </div>
    );
}