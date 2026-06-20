import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userApi } from "../api/user.api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(() => {
        if (!user) {
            setWishlist([]);
            return;
        }
        setLoading(true);
        userApi.getWishlist()
            .then(res => {
                if (res.data.success) setWishlist(res.data.wishlist);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    async function toggleWishlist(productId) {
        if (!user) {
            toast.info("Log in to save items to your wishlist");
            return;
        }
        try {
            const res = await userApi.toggleWishlist(productId);
            if (res.data.success) {
                toast.success(res.data.inWishlist ? "Added to wishlist" : "Removed from wishlist");
                refresh();
            }
        } catch {
            toast.error("Could not update wishlist");
        }
    }

    function isInWishlist(productId) {
        return wishlist.some(p => p._id === productId);
    }

    return (
        <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist, refresh }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
