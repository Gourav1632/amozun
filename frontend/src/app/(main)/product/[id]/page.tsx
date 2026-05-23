import { apiFetch } from "@/lib/api";
import ProductGallery from "@/components/product/ProductGallery";
import BuyBox from "@/components/product/BuyBox";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import HomeProductSwiper from "@/components/Home/HomeProductSwiper";
import RecentlyViewedTracker from "@/components/product/RecentlyViewedTracker";
import RecentlyViewedClient from "@/components/Home/RecentlyViewedClient";
import { Metadata } from "next";

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const shortDesc = product.description
        ? (product.description.length > 155 ? product.description.substring(0, 155) + '...' : product.description)
        : `Buy ${product.name} at the best price on Amozun.in.`;

    return {
        title: product.name,
        description: shortDesc,
    };
}

async function getProduct(id: string) {
    try {
        const res = await apiFetch(`/products/${id}`, { cache: 'no-store' });
        return res.data;
    } catch (error) {
        return null;
    }
}

async function getSimilarProducts(categorySlug: string, excludeId: string) {
    try {
        const res = await apiFetch(`/products?category=${categorySlug}&limit=15`, { cache: 'no-store' });
        if (res.status === 'success' && Array.isArray(res.data)) {
            return res.data.filter((p: any) => p.id !== excludeId).slice(0, 10);
        }
        return [];
    } catch (e) {
        return [];
    }
}



export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const [similarProducts] = await Promise.all([
        getSimilarProducts(product.category_slug, product.id)
    ]);

    // Parse specifications if it's a JSON string, otherwise split by newlines or keep as string
    let specs: any = [];
    try {
        if (product.specifications) {
            if (product.specifications.startsWith('{') || product.specifications.startsWith('[')) {
                specs = JSON.parse(product.specifications);
            } else if (product.specifications.includes('|')) {
                specs = product.specifications.split('|').map((s: string) => {
                    const [key, val] = s.split(':');
                    return { name: key?.trim(), value: val?.trim() };
                }).filter((s: any) => s.name && s.value);
            } else if (product.specifications.includes('\n')) {
                specs = product.specifications.split('\n').map((s: string) => {
                    const parts = s.split(':');
                    if (parts.length >= 2) {
                        const key = parts.shift();
                        const val = parts.join(':');
                        return { name: key?.trim(), value: val?.trim() };
                    }
                    return null;
                }).filter((s: any) => s);
            }
        }
    } catch (e) {
        console.error("Error parsing specs", e);
    }

    return (
        <main className="bg-white min-h-screen text-[#0F1111]">
            <RecentlyViewedTracker productId={product.id} />

            {/* Breadcrumbs */}
            <div className="flex items-center text-xs text-gray-500 py-2 px-4 border-b border-gray-200 gap-1 overflow-x-auto whitespace-nowrap">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/search?category=${product.category_slug}`} className="hover:underline">{product.category_name}</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{product.name}</span>
            </div>

            <div className="max-w-[1500px] mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative items-start">

                    {/* Left Column: Gallery */}
                    <div className="md:col-span-6 lg:col-span-4 self-start md:sticky md:top-4">
                        <ProductGallery images={product.images || []} productName={product.name} />
                    </div>

                    {/* Middle Column: Product Info */}
                    <div className="md:col-span-6 lg:col-span-5 flex flex-col px-0 sm:px-4">
                        <h1 className="text-xl sm:text-2xl font-medium leading-tight mb-2 pb-2 border-b border-gray-200">
                            {product.name}
                        </h1>

                        {/* Price Area */}
                        <div className="mb-4 pt-2">
                            <div className="flex items-end gap-2 mb-1">
                                {product.mrp > product.price && (
                                    <span className="text-2xl text-[#cc0c39]">
                                        -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                                    </span>
                                )}
                                <span className="text-3xl font-medium">
                                    <span className="text-sm align-top">₹</span>{product.price.toLocaleString()}
                                </span>
                            </div>
                            {product.mrp > product.price && (
                                <div className="text-sm text-gray-500">
                                    M.R.P.: <span className="line-through">₹{product.mrp.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="text-sm mt-1">Inclusive of all taxes</div>
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <h2 className="font-bold mb-2">About this item</h2>
                            <p className="text-sm whitespace-pre-wrap">{product.description}</p>
                        </div>

                        {/* Specifications */}
                        {(Array.isArray(specs) && specs.length > 0) || (!Array.isArray(specs) && Object.keys(specs).length > 0) ? (
                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <h2 className="font-bold mb-2">Specifications</h2>
                                <table className="w-full text-sm">
                                    <tbody>
                                        {Array.isArray(specs) ? specs.map((spec: any, i: number) => (
                                            <tr key={i} className="border-b border-gray-100 last:border-0">
                                                <td className="py-2 pr-4 font-medium text-gray-700 bg-gray-50 w-1/3">{spec.name || Object.keys(spec)[0]}</td>
                                                <td className="py-2 pl-4 text-gray-900">{spec.value || Object.values(spec)[0]}</td>
                                            </tr>
                                        )) : Object.entries(specs).map(([key, value], i) => (
                                            <tr key={i} className="border-b border-gray-100 last:border-0">
                                                <td className="py-2 pr-4 font-medium text-gray-700 bg-gray-50 w-1/3">{key}</td>
                                                <td className="py-2 pl-4 text-gray-900">{value as string}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                    </div>

                    {/* Right Column: Buy Box */}
                    <div className="md:col-span-12 lg:col-span-3 w-full self-start lg:sticky lg:top-4 mt-2 lg:mt-0">
                        <BuyBox
                            productId={product.id}
                            price={product.price}
                            mrp={product.mrp}
                            stock={product.stock}
                        />
                    </div>

                </div>
            </div>

            <div className="max-w-[1500px] mx-auto bg-transparent pb-10">
                <div className="bg-transparent h-4"></div>
                {similarProducts.length > 0 && (
                    <HomeProductSwiper title="You may also like" products={similarProducts} />
                )}
                <RecentlyViewedClient variant="swiper" excludeId={product.id} />
            </div>
        </main>
    );
}
