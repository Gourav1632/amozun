'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export interface CartItem {
    cart_item_id: string;
    product_id: string;
    name: string;
    quantity: number;
    stock: number;
    image_url: string;
    price: number; // Note: We need price to calculate subtotal. Wait, cartController doesn't select price!
}

interface CartContextType {
    items: CartItem[];
    isLoading: boolean;
    totalItems: number;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { user } = useAuth();

    const fetchCart = async () => {
        if (!user) {
            setItems([]);
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            const res = await apiFetch('/cart');
            setItems(res.data.items || []);
        } catch (error) {
            console.error('Failed to fetch cart', error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId: string, quantity: number) => {
        if (!user) return;
        try {
            await apiFetch('/cart', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity })
            });
            await fetchCart();
        } catch (error: any) {
            console.error(error.message || "Failed to add to cart");
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            await apiFetch(`/cart/${itemId}`, {
                method: 'PATCH',
                body: JSON.stringify({ quantity })
            });
            await fetchCart();
        } catch (error: any) {
            console.error(error.message || "Failed to update quantity");
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await apiFetch(`/cart/${itemId}`, {
                method: 'DELETE'
            });
            await fetchCart();
        } catch (error: any) {
             console.error(error.message || "Failed to remove item");
        }
    };

    const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    return (
        <CartContext.Provider value={{ items, isLoading, totalItems, fetchCart, addToCart, updateQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
