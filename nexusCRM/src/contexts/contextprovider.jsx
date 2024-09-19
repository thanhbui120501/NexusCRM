import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    role: null,
    setUser: () => {},
    setToken: () => {},
});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({children}) => {
    const [user, _setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    
    const setToken = (token) => {
        _setToken(token)
        if(token){
            localStorage.setItem('ACCESS_TOKEN', token);
        }else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }
    const setUser = (user) => {
        _setUser(user)
        if(user){
            localStorage.setItem("USER", JSON.stringify(user));
        }else{
            localStorage.removeItem('USER')
        }
    }
    return (
        <StateContext.Provider value = {{
            user, token, setUser, setToken
        }}>
            {children}
        </StateContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);