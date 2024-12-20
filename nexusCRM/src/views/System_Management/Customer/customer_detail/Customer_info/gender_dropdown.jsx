// eslint-disable-next-line react/prop-types
export default function GenderDropdown({ onData, onClose }) {
    const genders = ["Male", "Female"];
    const handldeGender = (gender) => {
        switch (gender) {
            case "Male":
                return "Nam";
            default:
                return "Nữ";
        }
    };
    return (
        <ul className="absolute z-10 w-full rounded-lg px-1 py-1 mt-2 bg-background-surface_default dark:bg-background-neutral-hover border border-border-neutral-subtle shadow-lg top-[4.5rem]">
            {genders.map((gender) => (
                <li
                    key={gender}
                    onClick={() => {
                        onData(gender);
                        onClose(false);
                    }}
                    className="px-4 py-2 hover:bg-background-neutral-subtle_hover rounded-lg dark:hover:bg-background-neutral-press cursor-pointer text-text-primary dark:text-text-white"
                >
                    {handldeGender(gender)}
                </li>
            ))}
        </ul>
    );
}
