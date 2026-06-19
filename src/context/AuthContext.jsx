import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(Cookies.get("user")) || null;
        } catch {
            return null;
        }
    });

    function login(userData) {
        // setUser(userData);
        // localStorage.setItem("user", JSON.stringify(userData));
        Cookies.set("user", JSON.stringify(userData), {
            expires: 7,
            secure: true,
            sameSite: "none",
        });
    }

    function logout() {
        fetch("https://ecom-backend-ovxs.vercel.app/logout", { method: "POST", credentials: "include" }).catch(() => { });
        setUser(null);
        Cookies.set("user", JSON.stringify(userData), {
            expires: 7,
            secure: true,
            sameSite: "none",
        });
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
