export default function ShowDataDropDown() {
    return (
        <div className="flex flex-col gap-4 dropDownData items-center max-h-20 overflow-y-auto overflow-x-hidden">
            <div className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer">
                <h1 className="text-base font-medium">5</h1>
            </div>
            <div
                className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer"
                onClick
            >
                <h1 className="text-base font-medium">10</h1>
            </div>
            <div
                className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer"
                onClick
            >
                <h1 className="text-base font-medium">15</h1>
            </div>
            <div
                className="flex justify-start items-center gap-2 hover:bg-white cursor-pointer"
                onClick
            >
                <h1 className="text-base font-medium">20</h1>
            </div>
        </div>
    );
}
