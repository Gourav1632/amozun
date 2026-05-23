import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { useState } from "react";

interface WishlistProductProps {
    item: WishlistItem;
}

const WishlistProduct = ({ item }: WishlistProductProps) => {
    const { addToCart } = useCart();
    const { removeFromWishlist } = useWishlist();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        await addToCart(item.product_id, 1);
        setIsAdding(false);
    };

    const handleRemove = async () => {
        await removeFromWishlist(item.wishlist_item_id);
    };

    const addedDate = new Date(item.added_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="mt-2 flex flex-row border-b p-2 pb-4 last:border-none gap-4">
            {/* Image Section */}
            <div className="flex-shrink-0">
                <Link href={`/product/${item.product_id}`}>
                    <div className="relative w-[100px] h-[100px]">
                        <Image
                            src={item.image_url || "/placeholder.png"}
                            fill
                            sizes="100px"
                            className="object-contain rounded-md outline outline-1 outline-offset-2 outline-slate-300"
                            alt={item.name}
                        />
                    </div>
                </Link>
            </div>

            {/* Content Group (Info + Actions) */}
            <div className="flex flex-col md:flex-row flex-grow gap-2 md:gap-4 overflow-hidden">
                
                {/* Info Section */}
                <div className="flex flex-col flex-grow justify-start">
                <Link href={`/product/${item.product_id}`} className="text-base font-medium text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 mb-1">
                    {item.name}
                </Link>

                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xl">
                        <span className="text-sm align-top">₹</span>{item.price.toLocaleString()}
                    </span>
                </div>

                <span className="text-sm font-bold text-green-700">
                    {item.stock > 0 ? "In stock" : "Out of stock"}
                </span>

                <span className="text-xs text-gray-500 mt-1">
                    Item added {addedDate}
                </span>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-start gap-2 flex-shrink-0 mt-2 md:mt-0 w-full md:w-auto">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || item.stock === 0}
                    className="flex-1 md:flex-none w-full md:w-[150px] bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full py-1.5 px-2 text-xs sm:text-sm font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                <button
                    onClick={handleRemove}
                    className="flex-1 md:flex-none w-full md:w-[150px] bg-white border border-[#d5d9d9] hover:bg-[#f7fafa] rounded-full py-1.5 px-2 text-xs sm:text-sm text-[#0f1111] font-medium shadow-sm transition-colors flex items-center justify-center"
                >
                    Remove
                </button>
            </div>
            </div>
        </div>
    );
};

export default WishlistProduct;
