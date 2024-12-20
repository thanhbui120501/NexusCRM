import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { toast, ToastContainer } from "react-toastify";
import SidePanel from "./sidepanel";

export default function Role() {
    //set loading
    const [loading, setLoading] = useState(false);
    //set list role
    const [listRoles, setListRoles] = useState([]);
    //set role item
    const [roleItem, setRoleItem] = useState({});
    //call update in seidpanel
    const [hasUpdated, setHasUpdated] = useState(false);
    //set open/close side panel
    const [isOpen, setIsOpen] = useState(false);
    //set aniimated
    const toggleSidePanel = (value) => {
        setIsOpen(value);
    };
    //call api get-all-role
    useEffect(() => {
        getListRole();
    }, []);
    useEffect(() => {
        if (hasUpdated) {
            getListRole();
            setHasUpdated(false);
        }
    }, [hasUpdated]);
    //get all roles
    const getListRole = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/role/get-all-role");
            if (response.status === 200) {
                setListRoles(response.data.data);
            }
        } catch (err) {
            console.log(err);
            toast.error("Lỗi hệ thống!", {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };
    const renderAvatars = (listMember) => {
        if (listMember.length === 0) {
            return (
                <div
                    key={0}
                    className={`flex w-8 h-8 justify-center items-center bg-background-brand-subtle border border-border-white rounded-full`}
                >
                    <h1 className="text-xs font-medium text-text-brand">0</h1>
                </div>
            );
        }

        const avatars = listMember.slice(0, 5).map((avatar, index) => (
            <img
                key={avatar.account_id}
                src={`http://127.0.0.1:8000/uploads/${avatar.image_name}`}
                alt={`avatar-${avatar.id}`}
                className={`w-[32px] h-[32px] rounded-full absolute border-2 border-border-white`}
                style={{
                    left: `${index * 24}px`,
                    zIndex: 6 - index,
                }}
                onError={(e) => {
                    e.target.onerror = null; // Ngăn lặp vô hạn khi ảnh thay thế cũng lỗi
                    e.target.src =
                        "https://dummyimage.com/150x150/cccccc/000000&text=N/A"; // Đường dẫn đến ảnh mặc định
                }}
            />
        ));

        if (listMember.length > 5) {
            avatars.push(
                <div
                    key={0}
                    className={`flex w-8 h-8 justify-center items-center bg-background-brand-subtle border border-border-white rounded-full absolute left-[130px] z-0`}
                >
                    <h1 className="text-xs font-medium text-text-brand">
                        +{listMember.length - 5}
                    </h1>
                </div>
            );
        }

        return avatars;
    };
    return (
        <>
            <div className="flex py-6 justify-between items-end self-stretch gap-2">
                <div className="flex flex-col items-start gap-2 flex-1">
                    <h1 className="font-semibold text-3xl text-text-primary dark:text-text-white">
                        Chức vụ
                    </h1>
                    <h1 className="font-medium text-base text-text-secondary">
                        Quản lí tất cả chức vụ tại đây
                    </h1>
                </div>
                <ToastContainer />
            </div>
            {loading ? (
                <div className="fixed flex flex-col inset-0 bg-black bg-opacity-50 z-[100] items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-border-brand-default border-solid"></div>
                    <h1 className="text-sm font-medium text-text-white">
                        Đang tải danh sách chức vụ
                    </h1>
                </div>
            ) : listRoles?.listMember?.length == 0 ? (
                <div className="flex flex-col items-center justify-center w-full mt-4">
                    <h1 className="text-base font-medium text-text-negative">
                        Không có chức vụ nào
                    </h1>
                    <h1 className=" text-text-info text-sm font-medium">
                        Thêm chức vụ để có thể quản lý nhân viên tốt hơn!
                    </h1>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6">
                    {listRoles.map((role) => (
                        <div
                            key={role.role_id}
                            name="card"
                            className="flex p-4 flex-col items-start gap-4 flex-1 rounded-xl border border-b-border-neutral-default bg-background-surface_default dark:bg-background-neutral-hover"
                        >
                            <div className="flex justify-between items-center self-stretch">
                                <h1 className="font-semibold text-xl text-text-primary dark:text-text-white">
                                    {role.role_name}
                                </h1>

                                {role.status ? (
                                    <div className="flex justify-center items-center gap-2.5 border border-border-positive-default bg-background-positive-subtle rounded-[4px] px-3 py-1">
                                        <h1 className="font-medium text-sm text-text-positive">
                                            Đang hoạt động
                                        </h1>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center gap-2.5 border border-border-negative-default bg-background-negative-subtle rounded-[4px] px-3 py-1">
                                        <h1 className="font-medium text-sm text-text-negative">
                                            Ngưng hoạt động
                                        </h1>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center items-start gap-2.5 self-stretch h-[120px] max-h-[120px] w-full">
                                <h1 className="flex-1 text-base font-medium text-text-secondary overflow-hidden text-ellipsis whitespace-normal line-clamp-5">
                                    {role.description}
                                </h1>
                            </div>
                            <div className="flex justify-between items-center self-stretch">
                                <div className="flex items-center gap-5">
                                    <h1 className="font-medium text-base text-text-primary dark:text-text-white">
                                        Nhân viên:
                                    </h1>
                                    <div className="relative w-[182px] h-[32px]">
                                        {renderAvatars(role.list_member)}
                                    </div>
                                </div>
                                <div
                                    onClick={() => {
                                        setRoleItem(role);
                                        toggleSidePanel(true);
                                    }}
                                    className="flex flex-col items-start gap-2.5 cursor-pointer"
                                >
                                    <div className="flex px-0.5 justify-center items-center gap-2 self-stretch">
                                        <h1 className="font-semibold text-base text-text-brand">
                                            Chi tiết
                                        </h1>
                                        <img
                                            src="/icons/detail.svg"
                                            alt="detail_icon"
                                            className="w-6 h-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 bg-background-black bg-opacity-50 z-10"
                    onClick={() => {
                        toggleSidePanel(false);
                    }}
                ></div>
            )}

            <SidePanel
                isOpen={isOpen}
                onData={toggleSidePanel}
                role={roleItem}
                onUpdated={setHasUpdated}
            />
        </>
    );
}
