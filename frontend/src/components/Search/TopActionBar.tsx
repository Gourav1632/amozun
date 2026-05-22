'use client'

import { useRouter, useSearchParams } from "next/navigation";

interface TopActionBarProps {
    totalResults: number;
    searchQuery?: string;
}

export default function TopActionBar({ totalResults, searchQuery }: TopActionBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        
        if (val === 'featured') {
            params.delete('sortBy');
            params.delete('sortOrder');
        } else if (val === 'price_asc') {
            params.set('sortBy', 'price');
            params.set('sortOrder', 'asc');
        } else if (val === 'price_desc') {
            params.set('sortBy', 'price');
            params.set('sortOrder', 'desc');
        } else if (val === 'discount') {
            params.set('sortBy', 'discount');
            params.set('sortOrder', 'desc');
        }

        router.push(`/search?${params.toString()}`);
    };

    // Determine current sort value from URL
    const currentSortBy = searchParams.get('sortBy');
    const currentSortOrder = searchParams.get('sortOrder');
    let selectValue = 'featured';
    if (currentSortBy === 'price' && currentSortOrder === 'asc') selectValue = 'price_asc';
    if (currentSortBy === 'price' && currentSortOrder === 'desc') selectValue = 'price_desc';
    if (currentSortBy === 'discount') selectValue = 'discount';

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border-b border-gray-200 px-4 py-2 mb-4 shadow-sm">
            <div className="text-sm text-[#0F1111] mb-2 sm:mb-0">
                1-{Math.min(12, totalResults)} of {totalResults > 1000 ? 'over 1,000' : totalResults} results
                {searchQuery && (
                    <span> for <span className="text-[#c45500] font-bold">"{searchQuery}"</span></span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-[#0F1111]">Sort by:</label>
                <select 
                    id="sort" 
                    value={selectValue}
                    onChange={handleSortChange}
                    className="bg-[#F0F2F2] border border-[#D5D9D9] text-sm rounded-md py-1 px-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007185] cursor-pointer"
                >
                    <option value="featured">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                </select>
            </div>
        </div>
    );
}
