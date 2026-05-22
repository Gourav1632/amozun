import { apiFetch } from "@/lib/api";
import FilterSidebar from "@/components/Search/FilterSidebar";
import TopActionBar from "@/components/Search/TopActionBar";
import SearchResultCard from "@/components/Search/SearchResultCard";

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

        const res = await apiFetch(`/products?${query.toString()}`, { method: 'GET' });
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
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { products, pagination } = await getSearchResults(searchParams);

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <TopActionBar 
                totalResults={pagination.total} 
                searchQuery={searchParams.search as string} 
            />

            <div className="flex max-w-[1500px] mx-auto w-full px-4 sm:px-6">
                <FilterSidebar />

                {/* Main Results Column */}
                <div className="flex-1 pb-10">
                    <h1 className="text-xl font-bold mb-2">Results</h1>
                    <p className="text-sm text-gray-500 mb-4">
                        Check each product page for other buying options. Price and other details may vary based on product size and colour.
                    </p>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                            {products.map((product: any) => (
                                <SearchResultCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found.</h2>
                            <p className="text-gray-600">Try adjusting your filters or searching for something else.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
