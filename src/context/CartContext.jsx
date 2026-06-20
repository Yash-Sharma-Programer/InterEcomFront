import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("cart")) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    function addToCart(product, qty = 1) {
        const stock = product.stock ?? Infinity;
        if (stock <= 0) {
            toast.error("This product is out of stock");
            return;
        }
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                const nextQty = Math.min(existing.qty + qty, stock);
                if (nextQty === existing.qty) {
                    toast.info("You've reached the available stock for this item");
                    return prev;
                }
                return prev.map(item =>
                    item._id === product._id ? { ...item, qty: nextQty } : item
                );
            }
            return [...prev, { ...product, qty: Math.min(qty, stock) }];
        });
    }

    function removeFromCart(id) {
        setCart(prev => prev.filter(item => item._id !== id));
    }

    function updateQty(id, qty) {
        if (qty < 1) return removeFromCart(id);
        setCart(prev => prev.map(item => {
            if (item._id !== id) return item;
            const stock = item.stock ?? Infinity;
            return { ...item, qty: Math.min(qty, stock) };
        }));
    }

    function clearCart() {
        setCart([]);
    }

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.Product_Price * item.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
