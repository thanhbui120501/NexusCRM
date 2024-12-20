/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function AccountActivity({ id }) {
    const [listActivity, setListActivity] = useState([]);
    useEffect(() => {
        getListActivity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getListActivity = async () => {
        try {
            const response = await axiosClient.get(
                `/activity/get-all-activity/${id}`
            );

            if (response.status === 200) {
                const activity = response.data.data;
                setListActivity(activity);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const getTimeAgo = (val) => {
        const date = new Date(val);
        const timeAgo = formatDistanceToNow(date, {
            addSuffix: true,
            locale: vi,
        });
        return timeAgo;
    };
    return (
        <div className="flex flex-col p-6 items-start gap-6 self-stretch border rounded-xl border-border-neutral-default">
            <h1 className="font-semibold text-xl text-text-primary dark:text-text-white">
                Hoạt động
            </h1>

            {listActivity && listActivity.length == 0 && (
                <div className="">
                    <h1 className="text-base font-normal text-text-negative">
                        Chưa có hoạt động nào trên tài khoản này.
                    </h1>
                </div>
            )}

            <div className="flex flex-col items-start gap-3 self-stretch h-48 overflow-y-auto overflow-x-hidden">
                {listActivity &&
                    listActivity.length > 0 &&
                    listActivity.map((acc) => (
                        <div
                            key={acc.activity_id}
                            className="flex flex-col items-start self-stretch"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        `http://127.0.0.1:8000/uploads/` +
                                        acc.account[0].image_name
                                    }
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <h1 className="font-medium text-base text-text-primary dark:text-text-white">
                                    {acc.username}
                                </h1>
                                <h1 className="font-medium text-base text-text-secondary">
                                    {getTimeAgo(acc.created_at)}
                                </h1>
                            </div>
                            <div className="flex items-center gap-3 self-stretch">
                                <div className="flex w-8 h-8 justify-center items-start gap-2.5">
                                    <div className="h-full w-0.5 bg-background-neutral-disable" />
                                </div>
                                <h1 className="font-normal text-base text-text-primary dark:text-text-white">
                                    {acc.activity_content}
                                </h1>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
