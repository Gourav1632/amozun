'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    mrp: number;
    image_url: string;
    category_slug: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            router.push('/login');
            return;
        }

        setIsAdding(true);
        await addToCart(product.id, 1);
        setIsAdding(false);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <div className="flex flex-col bg-white w-full rounded-md p-3 relative h-full">
            <Link href={`/product/${product.id}`} className="group flex-grow">
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-[#f8f8f8] mb-3 overflow-hidden rounded-md flex items-center justify-center p-2">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="text-gray-400 text-sm">No image</div>
                    )}
                </div>

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#cc0c39] text-white text-[12px] font-bold px-2 py-[2px] rounded-sm">
                            {discount}% off
                        </span>
                        <span className="text-[#cc0c39] text-xs font-bold">Limited time deal</span>
                    </div>
                )}

                {/* Product Name */}
                <h3 className="text-[#0F1111] text-sm font-medium line-clamp-2 mb-1 group-hover:text-[#c45500]">
                    {product.name}
                </h3>
            </Link>

            {/* Price Section */}
            <div className="mt-auto pt-2">
                <div className="flex items-end gap-1">
                    <span className="text-sm font-normal text-[#0F1111] leading-none mb-[2px]">₹</span>
                    <span className="text-[21px] font-medium text-[#0F1111] leading-none">
                        {product.price?.toLocaleString('en-IN')}
                    </span>
                </div>
                {product.mrp > product.price && (
                    <div className="text-[12px] text-[#565959] mt-1">
                        M.R.P: <span className="line-through">₹{product.mrp?.toLocaleString('en-IN')}</span>
                    </div>
                )}
                
                {/* Add to Cart button */}
                <button 
                    onClick={handleAddToCart}
                    disabled={isAdding || addedToCart}
                    className={`w-full mt-3 border rounded-full py-[6px] px-3 text-[13px] text-[#0F1111] shadow-sm transition-all duration-300 flex items-center justify-center disabled:opacity-80
                        ${addedToCart 
                            ? "bg-[#131A22] border-[#131A22] text-white scale-[0.98]" 
                            : "bg-[#ffd814] hover:bg-[#f7ca00] border-[#fcd200]"
                        }`}
                >
                    {addedToCart && <Check className="h-4 w-4 mr-1" />}
                    {isAdding ? "Adding..." : addedToCart ? "Added" : "Add to cart"}
                </button>
            </div>
        </div>
    );
}
