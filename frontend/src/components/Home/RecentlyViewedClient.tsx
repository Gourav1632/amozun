'use client'

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import HomeProductRow from "./HomeProductRow";
import HomeProductSwiper from "./HomeProductSwiper";

interface RecentlyViewedClientProps {
    variant?: 'row' | 'swiper';
    excludeId?: string;
}

export default function RecentlyViewedClient({ variant = 'row', excludeId }: RecentlyViewedClientProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            try {
                // apiFetch automatically includes credentials (cookies)
                const res = await apiFetch('/recently-viewed');
                if (res.status === 'success' && res.data) {
                    let fetchedProducts = res.data;
                    if (excludeId) {
                        fetchedProducts = fetchedProducts.filter((p: any) => p.id !== excludeId);
                    }
                    setProducts(fetchedProducts);
                }
            } catch (error) {
                console.error("Failed to fetch recently viewed", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentlyViewed();
    }, [excludeId]);

    // Don't render anything while loading or if empty to match Server Component behavior
    if (isLoading || products.length === 0) return null;

    if (variant === 'swiper') {
        return <HomeProductSwiper title="Recently viewed products" products={products} />;
    }

    return <HomeProductRow title="Recently viewed items" products={products} maxItems={6} viewAllLink="/recently-viewed" />;
}
