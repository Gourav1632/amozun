'use client'

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function RecentlyViewedPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            try {
                const res = await apiFetch('/recently-viewed');
                if (res.status === 'success' && res.data) {
                    setProducts(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch recently viewed products", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentlyViewed();
    }, []);

    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <main className="max-w-[1000px] mx-auto bg-white p-6 sm:p-10 shadow-sm mb-20">

                <div className="flex justify-between items-end mb-1 border-b border-slate-200 pb-2">
                    <h1 className="text-[28px] leading-8 font-medium text-[#0f1111]">
                        Recently Viewed Items
                    </h1>
                    {!isLoading && (
                        <span className="text-sm text-gray-500 text-nowrap">
                            {products.length} {products.length === 1 ? 'item' : 'items'}
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="py-10 text-center">
                        <p className="text-lg mb-4 text-[#565959]">Loading recently viewed items...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-lg mb-4 text-[#565959]">You have no recently viewed items.</p>
                        <Link href="/" className="text-[#007185] hover:text-[#c45500] hover:underline">
                            Continue shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {products.map((product) => (
                            <div key={product.id} className="mt-4 flex flex-row pb-6 last:border-none gap-4">
                                {/* Image Section */}
                                <div className="flex-shrink-0">
                                    <Link href={`/product/${product.id}`}>
                                        <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
                                            <Image
                                                src={product.image_url || "/placeholder.png"}
                                                fill
                                                sizes="(max-width: 768px) 100px, 120px"
                                                className="object-contain rounded-md"
                                                alt={product.name}
                                            />
                                        </div>
                                    </Link>
                                </div>

                                {/* Info Section */}
                                <div className="flex flex-col flex-grow justify-start overflow-hidden">
                                    <Link href={`/product/${product.id}`} className="text-lg font-medium text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 mb-1">
                                        {product.name}
                                    </Link>

                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-xl">
                                            <span className="text-sm align-top">₹</span>{product.price.toLocaleString()}
                                        </span>
                                    </div>

                                    <span className="text-sm font-bold text-green-700">
                                        {product.stock > 0 ? "In stock" : "Out of stock"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
