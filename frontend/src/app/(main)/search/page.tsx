import { apiFetch } from "@/lib/api";
import { Suspense } from "react";
import FilterSidebar from "@/components/Search/FilterSidebar";
import TopActionBar from "@/components/Search/TopActionBar";
import SearchProductList from "@/components/Search/SearchProductList";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate metadata dynamically if needed
export const metadata = {
    title: 'Amozun Search',
    description: 'Search for products on Amozun',
};

async function getSearchResults(searchParams: any) {
    try {
        const query = new URLSearchParams();

        // Map searchParams to API query parameters
        if (searchParams.search) query.set('search', searchParams.search);
        if (searchParams.category) query.set('category', searchParams.category);
        if (searchParams.minPrice) query.set('minPrice', searchParams.minPrice);
        if (searchParams.maxPrice) query.set('maxPrice', searchParams.maxPrice);
        if (searchParams.minDiscount) query.set('minDiscount', searchParams.minDiscount);
        if (searchParams.sortBy) query.set('sortBy', searchParams.sortBy);
        if (searchParams.sortOrder) query.set('sortOrder', searchParams.sortOrder);
        if (searchParams.page) query.set('page', searchParams.page);

        // Use a higher limit for search results page
        query.set('limit', '16');

        const res = await apiFetch(`/products?${query.toString()}`, { method: 'GET', cache: 'no-store' });

        return {
            products: res.data || [],
            pagination: res.pagination || { total: 0 }
        };
    } catch (error) {
        console.error("Failed to fetch search results:", error);
        return { products: [], pagination: { total: 0 } };
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const { products, pagination } = await getSearchResults(resolvedSearchParams);

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Suspense fallback={<div className="h-12 bg-white border-b border-gray-200 px-4 py-2 mb-4">Loading top bar...</div>}>
                <TopActionBar
                    totalResults={pagination.total}
                    searchQuery={resolvedSearchParams.search as string}
                />
            </Suspense>

            <div className="flex max-w-[1500px] mx-auto w-full px-4 sm:px-6">
                <Suspense fallback={<div className="w-[240px] flex-shrink-0 pr-4 hidden md:block">Loading filters...</div>}>
                    <FilterSidebar />
                </Suspense>

                {/* Main Results Column */}
                <div className="flex-1 pb-10">
                    <h1 className="text-xl font-bold mb-2">Results ({products.length})</h1>

                    <SearchProductList initialProducts={products} pagination={pagination} />
                </div>
            </div>
        </main>
    );
}
