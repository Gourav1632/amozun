import HeroSlider from "@/components/Home/HeroSlider";
import HomeProductRow from "@/components/Home/HomeProductRow";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import AuthBox from "@/components/Home/AuthBox";
import RecentlyViewedClient from "@/components/Home/RecentlyViewedClient";

async function fetchFilteredProducts(queryParams: string) {
    try {
        const res = await apiFetch(`/products?${queryParams}`, { method: 'GET' })
        return res.data || [];
    } catch (error) {
        console.error(`Failed to fetch products with params ${queryParams}:`, error);
        return [];
    }
}

export default async function Home() {
    // Fetch all required data concurrently
    const [electronics, fashionTop, homeTop, headphoneTop, deals, allOther] = await Promise.all([
        fetchFilteredProducts('category=electronics&limit=10'),
        fetchFilteredProducts('category=women&limit=4'),
        fetchFilteredProducts('category=home&limit=4'),
        fetchFilteredProducts('category=headphones&limit=4'),
        fetchFilteredProducts('minDiscount=10&sortBy=discount&sortOrder=desc&limit=10'),
        fetchFilteredProducts('limit=10') // generic products
    ]);

    return (
        <main className="flex flex-col min-h-screen bg-[#eaeded]">
            <HeroSlider />

            <div className="relative max-w-[1500px] mx-auto w-full px-4 sm:px-6 -mt-[40px] sm:-mt-[80px] md:-mt-[120px] lg:-mt-[250px] z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                    {/* Fashion 4-grid */}
                    <div className="bg-white p-4 z-20 flex flex-col h-[420px]">
                        <h2 className="text-xl font-bold mb-4">Up to 60% off | Styles of your choice</h2>
                        <div className="grid grid-cols-2 gap-4 flex-grow mb-4">
                            {fashionTop.map((f: any, i: number) => (
                                <Link key={f.id || i} href={`/product/${f.id}`} className="bg-[#f8f8f8] h-full w-full relative rounded-sm flex items-center justify-center p-2 group overflow-hidden">
                                    {f.image_url ? (
                                        <Image src={f.image_url} alt={f.name || ""} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain mix-blend-multiply p-2 group-hover:scale-105 transition-transform" />
                                    ) : null}
                                </Link>
                            ))}
                            {Array.from({ length: Math.max(0, 4 - fashionTop.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-[#f8f8f8] h-full w-full rounded-sm"></div>
                            ))}
                        </div>
                        <Link href="/search?category=clothing" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">End of season sale</Link>
                    </div>

                    {/* Home Revamp 4-grid */}
                    <div className="bg-white p-4 z-20 flex flex-col h-[420px]">
                        <h2 className="text-xl font-bold mb-4">Revamp your home in style</h2>
                        <div className="grid grid-cols-2 gap-4 flex-grow mb-4">
                            {homeTop.map((h: any, i: number) => (
                                <Link key={h.id || i} href={`/product/${h.id}`} className="bg-[#f8f8f8] h-full w-full relative rounded-sm flex items-center justify-center p-2 group overflow-hidden">
                                    {h.image_url ? (
                                        <Image src={h.image_url} alt={h.name || ""} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain mix-blend-multiply p-2 group-hover:scale-105 transition-transform" />
                                    ) : null}
                                </Link>
                            ))}
                            {Array.from({ length: Math.max(0, 4 - homeTop.length) }).map((_, i) => (
                                <div key={`empty-home-${i}`} className="bg-[#f8f8f8] h-full w-full rounded-sm"></div>
                            ))}
                        </div>
                        <Link href="/search?category=home" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">Explore all</Link>
                    </div>

                    {/* Headphones Single Hero */}
                    <div className="bg-white p-4 z-20 flex flex-col h-[420px]">
                        <h2 className="text-xl font-bold mb-4">Starting ₹149 | Headphones</h2>
                        <Link href={headphoneTop[0]?.id ? `/product/${headphoneTop[0].id}` : "/search?category=headphones"} className="bg-[#f8f8f8] h-full w-full mb-4 flex-grow relative rounded-sm overflow-hidden p-4 group">
                            {headphoneTop[0]?.image_url ? (
                                <Image src={headphoneTop[0].image_url} alt={headphoneTop[0].name || ""} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform" />
                            ) : null}
                        </Link>
                        <Link href="/search?category=headphones" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">See all offers</Link>
                    </div>

                    <AuthBox />
                </div>

                {/* Product Rows */}
                <div className="flex flex-col">
                    <RecentlyViewedClient variant="row" />
                    <HomeProductRow title="Today's Deals" products={deals} maxItems={6} viewAllLink="/search" />
                    <HomeProductRow title="Bestselling Electronics" products={electronics} maxItems={6} viewAllLink="/search?category=electronics" />
                    <HomeProductRow title="Trending in Fashion" products={fashionTop} maxItems={6} viewAllLink="/search?category=clothing" />
                    <HomeProductRow title="Explore More Products" products={allOther} maxItems={6} viewAllLink="/search" />
                </div>
            </div>
        </main>
    );
}
