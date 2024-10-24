// eslint-disable-next-line react/prop-types
export default function GenderDropdown({ onData, onClose }) {
    const genders = ["Male", "Female"];
    const handldeGender = (gender) =>{
        switch(gender){
            case "Male": return 'Nam';
            default: return "Nữ";
        }
    }
    return (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-16">
            {genders.map((gender) => (
                <li
                    key={gender}
                    onClick={() => {
                        onData(gender);
                        onClose(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                    {handldeGender(gender)}
                </li>
            ))}
        </ul>
    );
}
