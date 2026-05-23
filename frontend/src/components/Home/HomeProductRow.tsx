import Link from "next/link";
import ProductCard from "./ProductCard";

interface HomeProductRowProps {
    title: string;
    products: any[];
    maxItems?: number;
    viewAllLink?: string;
}

export default function HomeProductRow({ title, products, maxItems = 6, viewAllLink = "#" }: HomeProductRowProps) {
    if (!products || products.length === 0) return null;

    const displayProducts = products.slice(0, maxItems);

    return (
        <div className="z-10 flex flex-col bg-white h-auto mb-5 mx-4 p-4 border border-gray-200">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-[#0F1111]">
                    {title}
                </h2>
                <Link href={viewAllLink} className="text-[14px] text-[#007185] hover:text-[#c45500] hover:underline font-medium">
                    View all
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x pb-4 hide-scrollbar">
                {displayProducts.map((product) => (
                    <div
                        key={product.id}
                        className="h-full snap-start flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-10.66px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-12.8px)] xl:w-[calc(16.666%-13.33px)]"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
