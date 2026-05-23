'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for custom price inputs
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Sync state if URL changes (e.g. new search clears params)
    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    const currentCategory = searchParams.get('category');
    const currentMinDiscount = searchParams.get('minDiscount');

    const handleFilterChange = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // When changing category or other major filters, reset page to 1
        params.delete('page');
        router.push(`/search?${params.toString()}`);
    };

    const handleFiltersChange = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        params.delete('page');
        router.push(`/search?${params.toString()}`);
    };

    const handlePriceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set('minPrice', minPrice);
        else params.delete('minPrice');
        
        if (maxPrice) params.set('maxPrice', maxPrice);
        else params.delete('maxPrice');

        params.delete('page');
        router.push(`/search?${params.toString()}`);
    };

    // Categories mock list - ideally fetched from /api/categories
    const categories = [
        { name: 'Any Category', slug: null },
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Smartphones', slug: 'smartphones' },
        { name: 'Computers & Accessories', slug: 'computers-and-accessories' },
        { name: 'Home & Kitchen', slug: 'home-and-kitchen' },
        { name: 'Fashion & Clothing', slug: 'clothing' },
        { name: 'Sports & Outdoors', slug: 'sports-and-outdoors' },
        { name: 'Books', slug: 'books' },
    ];

    const discounts = [
        { label: '10% Off or more', value: '10' },
        { label: '25% Off or more', value: '25' },
        { label: '50% Off or more', value: '50' },
        { label: '70% Off or more', value: '70' },
    ];

    return (
        <div className="w-full md:w-[240px] flex-shrink-0 pr-4 hidden md:block">
            {/* Category Filter */}
            <div className="mb-6">
                <h3 className="font-bold text-[#0F1111] text-sm mb-2">Category</h3>
                <ul className="text-sm space-y-1">
                    {categories.map((cat) => (
                        <li key={cat.name}>
                            <button
                                onClick={() => handleFilterChange('category', cat.slug)}
                                className={`hover:text-[#c45500] text-left ${
                                    (currentCategory === cat.slug || (!currentCategory && !cat.slug))
                                        ? 'font-bold text-[#0F1111]'
                                        : 'text-[#0F1111]'
                                }`}
                            >
                                {currentCategory === cat.slug ? '‹ ' : ''}{cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
                <h3 className="font-bold text-[#0F1111] text-sm mb-2">Price</h3>
                <ul className="text-sm space-y-1 text-[#0F1111] mb-2">
                    <li><button onClick={() => { setMinPrice(''); setMaxPrice('500'); handleFiltersChange({ minPrice: null, maxPrice: '500' }); }} className="hover:text-[#c45500]">Under ₹500</button></li>
                    <li><button onClick={() => { setMinPrice('500'); setMaxPrice('1000'); handleFiltersChange({ minPrice: '500', maxPrice: '1000' }); }} className="hover:text-[#c45500]">₹500 - ₹1,000</button></li>
                    <li><button onClick={() => { setMinPrice('1000'); setMaxPrice('5000'); handleFiltersChange({ minPrice: '1000', maxPrice: '5000' }); }} className="hover:text-[#c45500]">₹1,000 - ₹5,000</button></li>
                    <li><button onClick={() => { setMinPrice('5000'); setMaxPrice(''); handleFiltersChange({ minPrice: '5000', maxPrice: null }); }} className="hover:text-[#c45500]">Over ₹5,000</button></li>
                </ul>
                <form onSubmit={handlePriceSubmit} className="flex items-center gap-2 mt-2">
                    <input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-16 border border-[#a6a6a6] rounded-md px-2 py-1 text-sm shadow-inner"
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-16 border border-[#a6a6a6] rounded-md px-2 py-1 text-sm shadow-inner"
                    />
                    <button type="submit" className="bg-white border border-[#a6a6a6] rounded-md px-2 py-1 text-sm hover:bg-gray-50 shadow-sm">
                        Go
                    </button>
                </form>
            </div>

            {/* Discount Filter */}
            <div className="mb-6">
                <h3 className="font-bold text-[#0F1111] text-sm mb-2">Discount</h3>
                <ul className="text-sm space-y-1">
                    {discounts.map((disc) => (
                        <li key={disc.value}>
                            <button
                                onClick={() => handleFilterChange('minDiscount', currentMinDiscount === disc.value ? null : disc.value)}
                                className={`hover:text-[#c45500] ${
                                    currentMinDiscount === disc.value ? 'font-bold text-[#c45500]' : 'text-[#0F1111]'
                                }`}
                            >
                                {disc.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
