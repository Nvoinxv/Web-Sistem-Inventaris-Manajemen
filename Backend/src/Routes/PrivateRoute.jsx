import React from 'react';
import { Navigate } from 'react-router-dom';

const getCurrentUser = () => {
    try {
        const user = localStorage.getItem("user");
        if (!user || user === "undefined") return null; // <-- tambahan check
        return JSON.parse(user);
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

export default function PrivateRoute({ children }) {
    const user = getCurrentUser();

    if (!user) {
        // Kalau belum login, redirect ke login //
        return <Navigate to="/login" replace />;
    }

    return children; 
}
