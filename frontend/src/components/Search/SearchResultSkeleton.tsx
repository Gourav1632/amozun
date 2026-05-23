export default function SearchResultSkeleton() {
    return (
        <div className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden h-full">
            {/* Image Container Skeleton */}
            <div className="w-full bg-[#f8f8f8] flex-shrink-0 flex items-center justify-center relative h-[150px] sm:h-[250px]">
                <div className="w-3/4 h-3/4 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Details Container Skeleton */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title Lines */}
                <div className="w-full h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="w-5/6 h-4 bg-gray-200 animate-pulse rounded mb-4"></div>
                
                {/* Reviews Skeleton */}
                <div className="w-1/2 h-3 bg-gray-200 animate-pulse rounded mb-4"></div>

                {/* Price Section Skeleton */}
                <div className="mt-2 flex items-end gap-2 mb-4">
                    <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 animate-pulse rounded mb-1"></div>
                </div>

                {/* Delivery details skeleton */}
                <div className="mt-auto">
                    <div className="w-3/4 h-3 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="w-1/2 h-3 bg-gray-200 animate-pulse rounded mb-4"></div>
                </div>

                {/* Button Skeleton */}
                <div className="mt-4 sm:mt-auto pt-2">
                    <div className="w-28 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
