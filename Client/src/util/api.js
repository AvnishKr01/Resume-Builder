// export const BASE_URL = "http://localhost:5000/api";
export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AUTH_PATHS = {
    AUTH:{
        LOGIN:"/user/login",
        REGISTER:"/user/register",
        GETUSER:"/user/getprofile"
    },
    RESUME:{
        CREATE_RESUME:"/resume/",
        GET_ALL_RESUMES:"/resume/",
        GET_BY_ID:(id) => `/resume/${id}`,

        DELETE:(id) => `/resume/${id}`,
        UPDATE:(id) => `/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/resume/${id}/upload-image`,

    },
    IMAGE:{
        UPLOAD_IMAGE:`/auth/upload-images`,
    }
}