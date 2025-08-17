import React from "react";
import Axios from "axios";

export default function useResetPassword() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);

    const resetPassword = async ({ newPassword, confirmPassword, email }) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await Axios.post("http://localhost:3000/api/auth/reset-password", {
                newPassword,
                confirmPassword,
                email
            });

            setSuccess(res.data.message);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("Terjadi kesalahan saat menghubungi server");
            }
        } finally {
            setLoading(false);
        }
    };

    return { 
        loading, 
        error, 
        success, 
        resetPassword };
}
