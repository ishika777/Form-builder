import { setForms, setCreating, setDeleting, setForm } from "@/store/formSlice";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

const FORM_API_END_POINT = import.meta.env.VITE_BACKEND_URL + "/api/form"


export const createForm = async (dispatch, formTitle) => {
    try {
        dispatch(setCreating(true))
        const response = await axios.post(
            `${FORM_API_END_POINT}`,
            { formTitle },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.data.success) {
            console.log("Form created successfully:", response.data.form);
            toast.success(response.data.message);
            dispatch(setForms(response.data.form))

            return true;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message || error.message);
    } finally {
        dispatch(setCreating(false))
    }
    return false;
}


export const deleteFormAction = async (dispatch, formId) => {
    try {
        dispatch(setDeleting(true))

        const response = await axios.delete(
            `${FORM_API_END_POINT}/${formId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.data.success) {
            console.log("Form deleted successfully:", response.data.form);
            toast.success(response.data.message);
            dispatch(setForms(response.data.form))
            return true;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message || error.message);
    } finally {
        dispatch(setDeleting(false))

    }
    return false;
}


export const updateFormAction = async (dispatch, formId, formTitle, questions) => {
    try {
        dispatch(setDeleting(true))

        const response = await axios.put(
            `${FORM_API_END_POINT}/${formId}`,
            { formTitle, questions },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.data.success) {
            console.log("Form updated successfully:", response.data.form);
            toast.success(response.data.message);
            dispatch(setForm(formId, response.data.form));
            return true;
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data.message || error.message);
    } finally {
        dispatch(setDeleting(false))

    }
    return false;
}



