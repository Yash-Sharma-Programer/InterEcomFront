import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    });
    const [authLoading, setAuthLoading] = useState(true);

    // Re-validate the session against the server on first load so a stale/expired
    // token doesn't silently leave the UI in a "logged in" state.
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setAuthLoading(false);
            return;
        }
        authApi.getProfile()
            .then(res => {
                if (res.data.success) {
                    setUser(res.data.user);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }
            })
            .catch(() => {
                setUser(null);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            })
            .finally(() => setAuthLoading(false));
    }, []);

    function login(userData, token) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (token) localStorage.setItem("token", token);
    }

    function logout() {
        authApi.logout().catch(() => {});
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, login, logout, authLoading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
