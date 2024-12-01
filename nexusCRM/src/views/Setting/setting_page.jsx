import { useState  } from 'react';
export default function Setting(){
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
          const newMode = !prevMode;
          localStorage.setItem('darkMode', newMode);
          if (newMode) {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
          return newMode;
        });
      };
    return (
        <div className="App min-h-screen p-5 bg-white dark:bg-gray-900 text-black dark:text-white">
          <h1 className="text-3xl">Dark Mode Example</h1>
          <button
            onClick={toggleDarkMode}
            className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      );
}