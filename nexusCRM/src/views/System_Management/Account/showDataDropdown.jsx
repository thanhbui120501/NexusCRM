// eslint-disable-next-line react/prop-types
export default function ShowDataDropDown({ onData, onCloseDropdow }) {
    const seclectRowNumber = (val) => {
        onData(val);
    };

    const handleCloseDropdow = () => {
        onCloseDropdow();
    };
    return (
        <div className="absolute flex flex-col  gap-4 items-center max-h-20 overflow-y-auto overflow-x-hidden p-2 bg-gray-50 rounded-lg shadow-lg dropDownData">
            {[5, 10, 15, 20].map((number) => (
                <div
                    key={number}
                    className="flex justify-start items-center gap-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
                    onClick={() => {
                        seclectRowNumber(number);
                        handleCloseDropdow();
                    }}
                >
                    <h1 className="text-base font-medium">{number}</h1>
                </div>
            ))}
        </div>
    );
}
