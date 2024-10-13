import { toast, ToastContainer } from "react-toastify";

const  DisableFunction = () => {
    // eslint-disable-next-line no-unused-vars
    const showErrorToast = () => {
        toast.error("Chức năng này sẽ sớm có trên hệ thống!", {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    return (
        <> <ToastContainer /> </>
    );
}
export default DisableFunction;