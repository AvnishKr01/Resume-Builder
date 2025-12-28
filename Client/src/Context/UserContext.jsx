import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../util/axiosIntance";
import { AUTH_PATHS } from "../util/api";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) return;

        const accessToken = localStorage.getItem('token');
        if(!accessToken) {
            setLoading(false);
            return;
        }
        
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(AUTH_PATHS.AUTH.GETUSER);
                setUser(response.data);
                // setLoading(false);
            } catch (error) {
                console.log("user not authenticated", error);
                clearUser();
                
            }
            finally{
                setLoading(false);
            }
        };
        fetchUser();
    },[]);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
        setLoading(false);
    }
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
        setLoading(false);
    }
return(
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
        {children}
    </UserContext.Provider>
)

}

export default UserProvider;