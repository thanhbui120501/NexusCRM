import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import App from './App.jsx'
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { ContextProvider } from "./contexts/contextprovider.jsx";
import { DarkModeProvider } from "./contexts/darkmodeprovider.jsx";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <DarkModeProvider>
            <ContextProvider>
                <RouterProvider router={router}> </RouterProvider>
            </ContextProvider>
        </DarkModeProvider>
    </StrictMode>
);
