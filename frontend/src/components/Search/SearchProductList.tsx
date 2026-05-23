'use client'

import { useState, useEffect, useRef } from "react";
import SearchResultCard, { Product } from "./SearchResultCard";
import SearchResultSkeleton from "./SearchResultSkeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface Props {
    initialProducts: Product[];
    pagination: PaginationMeta;
}

export default function SearchProductList({ initialProducts, pagination }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState(pagination.page);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Sync state when server passes new initialProducts (e.g. new search or desktop pagination)
    useEffect(() => {
        setProducts(initialProducts);
        setPage(pagination.page);
    }, [initialProducts, pagination.page]);

    // IntersectionObserver for infinite scroll on mobile
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && page < pagination.totalPages && !isLoadingMore) {
                    // Only infinite scroll if mobile layout (window < 768px matches Tailwind 'md' breakpoint)
                    if (window.innerWidth < 768) {
                        loadMore();
                    }
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [page, pagination.totalPages, isLoadingMore, searchParams]);

    const loadMore = async () => {
        setIsLoadingMore(true);
        try {
            const next = page + 1;
            const currentParams = new URLSearchParams(searchParams?.toString() || "");
            currentParams.set('page', next.toString());
            currentParams.set('limit', '16');

            const res = await apiFetch(`/products?${currentParams.toString()}`);
            if (res.status === 'success' && res.data) {
                setProducts(prev => [...prev, ...res.data]);
                setPage(next);
            }
        } catch (error) {
            console.error("Failed to load more products", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleDesktopPagination = (newPage: number) => {
        const currentParams = new URLSearchParams(searchParams?.toString() || "");
        currentParams.set('page', newPage.toString());
        // router.push performs soft navigation; Next.js refetches the page async.
        router.push(`/search?${currentParams.toString()}`);
    };

    // Calculate window of pages to show
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let start = Math.max(1, pagination.page - 2);
        let end = Math.min(pagination.totalPages, start + maxPagesToShow - 1);
        
        if (end - start + 1 < maxPagesToShow) {
            start = Math.max(1, end - maxPagesToShow + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found.</h2>
                <p className="text-gray-600">Try adjusting your filters or searching for something else.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {products.map((product, idx) => (
                    <SearchResultCard key={`${product.id}-${idx}`} product={product} />
                ))}
                
                {isLoadingMore && (
                    <>
                        <SearchResultSkeleton />
                        <SearchResultSkeleton />
                    </>
                )}
            </div>
            
            {/* Mobile Loading Trigger */}
            <div ref={observerTarget} className="h-4 md:hidden mt-4" />

            {/* Desktop Pagination */}
            {pagination.totalPages > 1 && (
                <div className="hidden md:flex justify-center mt-10 mb-6 gap-2">
                    <button 
                        onClick={() => handleDesktopPagination(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-4 py-2 border border-gray-300 rounded shadow-sm bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f3a847]"
                    >
                        Previous
                    </button>
                    {getPageNumbers().map(p => (
                        <button
                            key={p}
                            onClick={() => handleDesktopPagination(p)}
                            className={`px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f3a847] transition-colors ${
                                p === pagination.page 
                                    ? 'bg-[#f3f3f3] border-gray-400 font-bold text-black' 
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button 
                        onClick={() => handleDesktopPagination(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded shadow-sm bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f3a847]"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
