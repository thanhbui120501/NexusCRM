import { useStateContext } from "../../contexts/contextprovider";
import SideBar from "../Sidebar/sidebar";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function DefaultLayout() {
    // eslint-disable-next-line no-unused-vars
    const { user, token, setUser, setToken } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <main className="flex h-screen overflow-hidden font-sans">
            <SideBar />
            <div className="flex flex-col items-start gap-[10px] flex-1">
                <Header />
                <hr className="border-t border-border-neutral-default w-full" />
                <div className="flex flex-col h-full items-start gap-3 justify-start self-stretch pl-6 pr-6 overflow-y-auto overflow-x-hidden max-w-[1200px] w-[1200px] mx-auto">
                    <Outlet />
                </div>
                <hr className="border-t border-border-neutral-default w-full" />
                <Footer />
            </div>
        </main>
    );
}
