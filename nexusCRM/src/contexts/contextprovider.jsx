import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    role: null,
    setUser: () => {},
    setToken: () => {},
});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
    const [user, _setUser] = useState(() => {
        const savedUser =
            localStorage.getItem("USER") || sessionStorage.getItem("USER");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, _setToken] = useState(() => {
        return (
            localStorage.getItem("ACCESS_TOKEN") ||
            sessionStorage.getItem("ACCESS_TOKEN")
        );
    });

    const setToken = (token, remember = false) => {
        _setToken(token);
        if (token) {
            if (remember) {
                localStorage.setItem("ACCESS_TOKEN", token);
            } else {
                sessionStorage.setItem("ACCESS_TOKEN", token);
            }
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
            sessionStorage.removeItem("ACCESS_TOKEN");
        }
    };
    const setUser = (user, remember = false) => {
        _setUser(user);
        if (user) {
            const userData = JSON.stringify(user);
            if (remember) {
                localStorage.setItem("USER", userData);
            } else {
                sessionStorage.setItem("USER", userData);
            }
        } else {
            localStorage.removeItem("USER");
            sessionStorage.removeItem("USER");
        }
    };
    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);
