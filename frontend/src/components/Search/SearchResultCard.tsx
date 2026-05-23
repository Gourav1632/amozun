'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export interface Product {
    id: string;
    name: string;
    price: number;
    mrp: number;
    image_url: string;
}

export default function SearchResultCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { user, requireAuth } = useAuth();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        requireAuth(async () => {
            setIsAdding(true);
            await addToCart(product.id, 1);
            setIsAdding(false);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        });
    };

    const discount = product.mrp > product.price 
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
        : 0;

    return (
        <div className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-sm transition-shadow h-full">
            {/* Image Container */}
            <div className="w-full bg-[#f8f8f8] flex-shrink-0 flex items-center justify-center p-2 sm:p-4 relative h-[150px] sm:h-[250px]">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain mix-blend-multiply p-4"
                        sizes="(max-width: 640px) 100vw, 250px"
                    />
                ) : (
                    <div className="text-gray-400">No image</div>
                )}
            </div>

            {/* Details Container */}
            <div className="p-4 flex flex-col flex-grow">
                <Link href={`/product/${product.id}`} className="group">
                    <h2 className="text-[#0F1111] text-[16px] font-medium group-hover:text-[#c45500] line-clamp-3 mb-1">
                        {product.name}
                    </h2>
                </Link>
                

                {/* Price Section */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-start">
                        <span className="text-[12px] mt-[2px] font-medium text-[#0F1111]">₹</span>
                        <span className="text-[28px] font-medium text-[#0F1111] leading-none">
                            {product.price?.toLocaleString('en-IN')}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className="flex flex-col text-sm">
                            <span className="text-[#565959]">
                                M.R.P: <span className="line-through">₹{product.mrp?.toLocaleString('en-IN')}</span>
                            </span>
                            <span className="text-[#cc0c39] font-medium">({discount}% off)</span>
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    <span className="text-[12px] text-[#565959]">Get it by </span>
                    <span className="text-[14px] font-bold text-[#0F1111]">Tomorrow</span>
                    <div className="text-[12px] text-[#565959] mt-1">FREE Delivery by Amozun</div>
                </div>

                {/* Add to Cart button */}
                <div className="mt-4 sm:mt-auto pt-2">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isAdding || addedToCart}
                        className={`border rounded-full py-1.5 px-4 text-sm font-medium shadow-sm transition-all duration-300 flex items-center justify-center disabled:opacity-80
                            ${addedToCart 
                                ? "bg-[#131A22] border-[#131A22] text-white scale-[0.98]" 
                                : "bg-[#ffd814] hover:bg-[#f7ca00] border-[#fcd200] text-[#0F1111]"
                            }`}
                    >
                        {addedToCart && <Check className="h-4 w-4 mr-1" />}
                        {isAdding ? "Adding..." : addedToCart ? "Added" : "Add to cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}
