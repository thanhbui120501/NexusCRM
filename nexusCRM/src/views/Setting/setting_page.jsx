import { useDarkMode } from "../../contexts/darkmodeprovider";
export default function Setting() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <>
            <div className="h-40 p-5 bg-background-surface_default dark:bg-background-neutral-hover  text-black flex flex-col items-center overflow-hidden">
                <h1 className="text-3xl mb-5 text-text-primary dark:text-text-white">
                    Dark Mode Example
                </h1>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-text-primary dark:text-text-white">
                        {isDarkMode ? "Dark Mode" : "Light Mode"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white border border-gray-300 rounded-full peer-checked:translate-x-5 dark:border-gray-600 transition-all"></div>
                    </label>
                </div>
            </div>
        </>
    );
}
