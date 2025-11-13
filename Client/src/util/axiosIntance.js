import axios from "axios";
import { BASE_URL } from './api'


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },

});

// Request interceptor to add the token to headers

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},
    (error) => { return Promise.reject(error) }
)

// Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/";
            }
            else if (error.response.status === 500) {
                console.error("Server error:");
            }
        }
        else if (error.code === 'ECONNABORTED') {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;