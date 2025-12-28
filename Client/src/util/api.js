// export const BASE_URL = "http://localhost:5000/api";
export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AUTH_PATHS = {
    AUTH:{
        LOGIN:"/api/user/login",
        REGISTER:"/api/user/register",
        GETUSER:"/api/user/getprofile"
    },
    RESUME:{
        CREATE_RESUME:"/api/resume/",
        GET_ALL_RESUMES:"/api/resume/",
        GET_BY_ID:(id) => `/api/resume/${id}`,

        DELETE:(id) => `/api/resume/${id}`,
        UPDATE:(id) => `/api/resume/${id}`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-image`,

    },
    IMAGE:{
        UPLOAD_IMAGE:`/api/auth/upload-images`,
    }
}