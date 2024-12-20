// eslint-disable-next-line react/prop-types
export default function ShowDataDropDown({ onData, onCloseDropdow }) {
    const seclectRowNumber = (val) => {
        onData(val);
    };

    const handleCloseDropdow = () => {
        onCloseDropdow();
    };
    return (
        <div className="absolute flex flex-col gap-4 items-center max-h-20 w-16 overflow-y-auto overflow-x-hidden p-2 border bg-background-neutral-subtle dark:bg-background-neutral-hover dark:border-border-white rounded-lg shadow-lgz-[100] top-10 no-scrollbar">
            {[5, 10, 15, 20].map((number) => (
                <div
                    key={number}
                    className="flex justify-center rounded-lg items-center w-full gap-2 hover:bg-background-neutral-subtle_hover dark:hover:bg-background-neutral-press p-2 cursor-pointer "
                    onClick={() => {
                        seclectRowNumber(number);
                        handleCloseDropdow();
                    }}
                >
                    <h1 className="text-base font-medium text-text-primary dark:text-text-white">
                        {number}
                    </h1>
                </div>
            ))}
        </div>
    );
}
