'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export interface WishlistItem {
    wishlist_item_id: string;
    product_id: string;
    name: string;
    price: number;
    stock: number;
    image_url: string;
    added_at: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    isLoading: boolean;
    totalItems: number;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (itemId: string) => Promise<void>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const fetchWishlist = async () => {
        if (!user) {
            setItems([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const res = await apiFetch('/wishlist');
            if (res.status === 'success') {
                setItems(res.data.items || []);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const addToWishlist = async (productId: string) => {
        if (!user) return;
        
        try {
            const res = await apiFetch('/wishlist', {
                method: 'POST',
                body: JSON.stringify({ productId }),
            });
            
            if (res.status === 'success') {
                await fetchWishlist();
            }
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
            throw error;
        }
    };

    const removeFromWishlist = async (itemId: string) => {
        if (!user) return;

        // Optimistic update
        setItems(currentItems => currentItems.filter(item => item.wishlist_item_id !== itemId));

        try {
            await apiFetch(`/wishlist/${itemId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            // Revert on failure
            await fetchWishlist();
            throw error;
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                items,
                isLoading,
                totalItems: items.length,
                addToWishlist,
                removeFromWishlist,
                refreshWishlist: fetchWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
