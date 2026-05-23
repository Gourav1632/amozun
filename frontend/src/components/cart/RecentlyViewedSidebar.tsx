'use client'

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";

export default function RecentlyViewedSidebar() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await apiFetch('/recently-viewed');
                if (res && res.data) {
                    setProducts(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch recently viewed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentlyViewed();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-white  p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c45500]"></div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-4">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Your Recently Viewed Items</h3>
            <ul className="flex flex-col space-y-4">
                {products.slice(0, 5).map((product: any) => (
                    <li key={product.id} className="flex space-x-3">
                        <Link href={`/product/${product.id}`} className="flex-shrink-0 relative w-[100px] h-[100px]">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name || ""}
                                    fill
                                    sizes="100px"
                                    className="object-contain p-1"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">No Image</div>
                            )}
                        </Link>
                        <div className="flex flex-col flex-grow">
                            <Link href={`/product/${product.id}`} className="text-sm font-semibold text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2">
                                {product.name}
                            </Link>
                            {/* Stars placeholder */}
                            <div className="flex items-center mt-1">
                                <div className="flex text-[#ffa41c] text-xs">
                                    {'★★★★☆'}
                                </div>
                                <span className="text-xs text-[#007185] ml-1 hover:underline cursor-pointer">123</span>
                            </div>
                            <div className="flex items-center mt-1">
                                <span className="text-[#cc0c39] font-semibold text-xs mr-1">-40%</span>
                                <span className="text-[#0f1111] font-medium">₹{product.price.toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => addToCart(product.id, 1)}
                                className="mt-2 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full text-xs font-semibold py-1 px-3 w-fit shadow-sm transition-colors"
                            >
                                Add to cart
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
