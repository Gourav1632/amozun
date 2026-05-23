'use client'

import { useState, useEffect, useRef } from "react";
import { Search, Clock, ArrowUpLeft, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const wrapperRef = useRef<HTMLFormElement>(null);

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [isFocused, setIsFocused] = useState(false);

    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const categories = [
        { name: 'All Categories', slug: 'all' },
        { name: 'Amazon Devices', slug: 'amazon-devices' },
        { name: 'Amazon Fashion', slug: 'fashion' },
        { name: 'Appliances', slug: 'appliances' },
        { name: 'Apps & Games', slug: 'apps-games' },
        { name: 'Baby', slug: 'baby' },
        { name: 'Beauty', slug: 'beauty' },
        { name: 'Books', slug: 'books' },
        { name: 'Car & Motorbike', slug: 'automotive' },
        { name: 'Clothing & Accessories', slug: 'clothing' },
        { name: 'Computers & Accessories', slug: 'computers' },
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Furniture', slug: 'furniture' },
        { name: 'Grocery & Gourmet Foods', slug: 'grocery' },
        { name: 'Health & Personal Care', slug: 'health' },
        { name: 'Home & Kitchen', slug: 'home-kitchen' },
        { name: 'Jewellery', slug: 'jewelry' },
        { name: 'Luggage & Bags', slug: 'luggage' },
        { name: 'Movies & TV Shows', slug: 'movies' },
        { name: 'Music', slug: 'music' },
        { name: 'Office Products', slug: 'office' },
        { name: 'Pet Supplies', slug: 'pets' },
        { name: 'Shoes & Handbags', slug: 'shoes' },
        { name: 'Sports, Fitness & Outdoors', slug: 'sports' },
        { name: 'Toys & Games', slug: 'toys' },
        { name: 'Under ₹500', slug: 'under-500' },
        { name: 'Video Games', slug: 'video-games' },
        { name: 'Watches', slug: 'watches' },
    ];

    // Initialize from URL params
    useEffect(() => {
        if (searchParams) {
            const urlQuery = searchParams.get("search");
            setQuery(urlQuery || "");

            const urlCategory = searchParams.get("category");
            const isValid = categories.some(c => c.slug === urlCategory);
            setCategory(isValid && urlCategory ? urlCategory : "all");
        }
    }, [searchParams]);

    // Load recent searches from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('amozunRecentSearches');
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recent searches");
            }
        }
    }, []);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Fetch suggestions with debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query.trim()) {
                setSuggestions([]);
                return;
            }
            setIsLoading(true);
            try {
                const res = await apiFetch(`/products/search-suggestions?q=${encodeURIComponent(query)}`);
                if (res.status === 'success') {
                    setSuggestions(res.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);


    const executeSearch = (searchQuery: string) => {
        setIsFocused(false);

        // Save to recent searches
        if (searchQuery.trim()) {
            const updatedRecents = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
            setRecentSearches(updatedRecents);
            localStorage.setItem('amozunRecentSearches', JSON.stringify(updatedRecents));
        }

        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        }
        if (category && category !== 'all') {
            params.set('category', category);
        }

        router.push(`/search?${params.toString()}`);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(query);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        executeSearch(suggestion);
    };

    const clearRecentSearches = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRecentSearches([]);
        localStorage.removeItem('amozunRecentSearches');
    };

    const selectedCategoryName = categories.find(c => c.slug === category)?.name || 'All';
    const facadeText = selectedCategoryName === 'All Categories' ? 'All' : selectedCategoryName;

    const showDropdown = isFocused && (query.trim().length > 0 || recentSearches.length > 0);

    return (
        <form ref={wrapperRef} onSubmit={handleFormSubmit} className="flex w-full h-10 rounded-md overflow-visible relative focus-within:ring-[2.5px] focus-within:ring-[#f3a847] border border-transparent focus-within:border-transparent transition-all">

            {/* nav-left: Dropdown Facade */}
            <div className="flex relative bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] items-center px-3 cursor-pointer text-xs text-[#555] group focus-within:border-transparent rounded-l-md z-20">
                <span className="truncate max-w-[80px] md:max-w-[120px] mr-1">{facadeText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-2.5 h-2.5 fill-current opacity-60 ml-1">
                    <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                </svg>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full text-sm"
                    title="Search in"
                >
                    {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* nav-fill: Input */}
            <div className="flex-grow bg-white z-20 relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full h-full px-3 text-black text-[15px] focus:outline-none placeholder-gray-500"
                    placeholder="Search Amozun.in"
                    autoComplete="off"
                    spellCheck="false"
                    dir="auto"
                />
            </div>

            {/* nav-right: Submit Button */}
            <div className="bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center cursor-pointer transition-colors z-20 rounded-r-md">
                <button type="submit" aria-label="Go" className="w-[45px] h-full flex items-center justify-center focus:outline-none">
                    <Search className="w-5 h-5 text-[#333]" strokeWidth={2.5} />
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && (
                <div className="absolute top-[39px] left-0 right-0 bg-white border border-gray-300 shadow-lg rounded-b-sm z-50 overflow-hidden text-black text-[14px]">
                    {!query.trim() ? (
                        /* Recent Searches */
                        <div className="py-2">
                            <div className="flex justify-between items-center px-4 py-1 text-sm text-gray-500 font-bold border-b border-gray-100 pb-2 mb-1">
                                <span>Recent Searches</span>
                                <button type="button" onClick={clearRecentSearches} className="text-xs hover:text-[#c45500] hover:underline font-normal">
                                    Clear
                                </button>
                            </div>
                            {recentSearches.map((term, i) => (
                                <div
                                    key={`recent-${i}`}
                                    onClick={() => handleSuggestionClick(term)}
                                    className="flex items-center px-4 py-2 hover:bg-[#f3f3f3] cursor-pointer"
                                >
                                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                                    <span className="font-semibold text-gray-700">{term}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* API Suggestions */
                        <div className="py-2">
                            {isLoading && suggestions.length === 0 ? (
                                <div className="px-4 py-2 text-sm text-gray-500 italic">Searching...</div>
                            ) : suggestions.length === 0 ? (
                                <div className="px-4 py-2 text-sm text-gray-500 italic">No suggestions found.</div>
                            ) : (
                                suggestions.map((term, i) => (
                                    <div
                                        key={`sug-${i}`}
                                        onClick={() => handleSuggestionClick(term)}
                                        className="flex items-center px-4 py-2 hover:bg-[#f3f3f3] cursor-pointer"
                                    >
                                        <Search className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                                        <span className="font-semibold text-gray-700 flex-grow">{term.toLowerCase()}</span>
                                        <ArrowUpLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

        </form>
    );
}
