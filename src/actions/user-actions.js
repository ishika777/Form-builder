import { setForms } from "@/store/formSlice";
import { setLoading, setUser, setIsCheckingAuth, setIsAuthenticated } from "@/store/userSlice";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

const USER_API_END_POINT = import.meta.env.VITE_BACKEND_URL + "/api/user"


export const signup = async (dispatch, input) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.post(
            `${USER_API_END_POINT}/signup`,
            input,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.data.success) {
            toast.success(response.data.message);
            dispatch(setUser(response.data.user))
            dispatch(setForms(response.data.user.forms))



            return true;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message || error.message);
    } finally {
        dispatch(setLoading(false))
    }
    return false;
}

export const login = async (dispatch, input) => {
    try {
        dispatch(setLoading(true))

        const response = await axios.post(
            `${USER_API_END_POINT}/login`,
            input,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.data.success) {
            toast.success(response.data.message);
            dispatch(setUser(response.data.user))
            dispatch(setForms(response.data.user.forms))
            dispatch(setIsAuthenticated(true))



            return true;
        }
    } catch (error) {
        console.log(error);
        console.log(error.response?.data.message);

        toast.error(error.response?.data.message || error.message);
    } finally {
        dispatch(setLoading(false))
    }
    return false;
}

export const verifyEmail = async (dispatch, verificationCode) => {
    try {
        dispatch(setLoading(true))

        const response = await axios.post(
            `${USER_API_END_POINT}/verify-email`,
            { verificationCode },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.data.success) {
            toast.success(response.data.message);
            dispatch(setUser(response.data.user))
            dispatch(setIsAuthenticated(true))
            dispatch(setForms(response.data.user.forms))
            return true;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message || error.message);
    } finally {
        dispatch(setLoading(false))
    }
    return false;
}

export const checkAuthentication = async (dispatch) => {
    try {
        dispatch(setIsCheckingAuth(true))

        const response = await axios.get(`${USER_API_END_POINT}/check-auth`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.data.success) {
            dispatch(setUser(response.data.user))
            dispatch(setIsAuthenticated(true))
            dispatch(setIsCheckingAuth(false))
            dispatch(setForms(response.data.user.forms))
            return { user: response.data.user, isAuthenticated: true };
        }
    } catch (error) {
        console.log(error);
    } finally {
        dispatch(setIsCheckingAuth(false))
    }
    return { user: null, isAuthenticated: false };
}

export const logout = async (dispatch) => {
    try {
        dispatch(setLoading(true))

        const response = await axios.post(`${USER_API_END_POINT}/logout`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.data.success) {
            toast.success(response.data.message);

            dispatch(setUser(null))


            return true;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message || error.message);
    } finally {
        dispatch(setLoading(false))
    }
    return false;
}
