import React from 'react';
import Axios from 'axios';

export default function LoginHook() {
    const [Loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const login = async(email, password) => {
        setLoading(true);
        setError(null);

        try {
            const respon = await Axios.post("http://localhost:3000/api/auth/login", {
                email,
                password,
            });

            const {token, user} = respon.data;
            
            
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            const savedUser = localStorage.getItem("user");
            const savedToken = localStorage.getItem("token");
            
            console.log("Data tersimpan:", {
                user: savedUser,
                token: savedToken ? "Token exists" : "No token"
            });

            return {success: true, user};
        } catch (err) {
            // Fix: Perbaiki typo dari 'respon' menjadi 'response'
            console.error("Login error:", err);
            const errorMessage = err.response?.data?.message || "Anda gagal login!";
            setError(errorMessage);
            return {success: false, error: errorMessage};
        } finally {
            setLoading(false);
        }
    };

    // Tambah fungsi untuk cek status login
    const checkLoginStatus = () => {
        try {
            const user = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            
            if (user && user !== "undefined" && token) {
                return {
                    isLoggedIn: true,
                    user: JSON.parse(user),
                    token
                };
            }
            return { isLoggedIn: false };
        } catch (error) {
            console.error("Error checking login status:", error);
            return { isLoggedIn: false };
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return {
        login, 
        Loading, 
        error, 
        checkLoginStatus,
        logout
    };
}