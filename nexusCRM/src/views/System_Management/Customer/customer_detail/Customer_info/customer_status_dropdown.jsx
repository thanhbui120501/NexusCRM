// eslint-disable-next-line react/prop-types
export default function CustomerStatusDropdown({ onData, onClose }) {
    const status = ["Active", "Locked", "Expired", "Closed"];
    const handleStatus = (status) => {
        switch (status) {
            case "Active":
                return "Đang hoạt động";
            case "Locked":
                return "Ngưng hoạt động";
            case "Expired":
                return "Đã hết hạn";
            default:
                return "Đã đóng";
        }
    };
    return (
        <ul className="absolute z-10 p-1 w-full mt-2 bg-background-surface_default border dark:bg-background-neutral-default border-border-neutral-subtle rounded-md shadow-lg top-16">
            {status.map((status) => (
                <li
                    key={status}
                    onClick={() => {
                        onData(status);
                        onClose(false);
                    }}
                    className="px-4 py-2 rounded-md hover:bg-background-neutral-subtle_hover dark:hover:bg-background-neutral-press cursor-pointer text-text-primary dark:text-text-white"
                >
                    {handleStatus(status)}
                </li>
            ))}
        </ul>
    );
}
