'use client'

import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function RecentlyViewedTracker({ productId }: { productId: string }) {
    const { user } = useAuth();
    const hasTracked = useRef(false);

    useEffect(() => {
        if (user && !hasTracked.current) {
            hasTracked.current = true;
            apiFetch('/recently-viewed', {
                method: 'POST',
                body: JSON.stringify({ productId })
            }).catch(() => { });
        }
    }, [productId, user]);

    return null;
}
