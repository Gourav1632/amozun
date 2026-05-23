import TopActionBar from "@/components/Search/TopActionBar";
import FilterSidebar from "@/components/Search/FilterSidebar";
import SearchResultSkeleton from "@/components/Search/SearchResultSkeleton";

export default function SearchLoading() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <div className="h-12 bg-white border-b border-gray-200 px-4 py-2 mb-4 animate-pulse" />

            <div className="flex max-w-[1500px] mx-auto w-full px-4 sm:px-6">
                <div className="w-[240px] flex-shrink-0 pr-4 hidden md:block">
                    <div className="h-[600px] bg-gray-100 rounded-md animate-pulse"></div>
                </div>

                <div className="flex-1 pb-10">
                    <h1 className="text-xl font-bold mb-2">Results</h1>
                    <p className="text-sm text-gray-500 mb-4">
                        Check each product page for other buying options. Price and other details may vary based on product size and colour.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SearchResultSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
