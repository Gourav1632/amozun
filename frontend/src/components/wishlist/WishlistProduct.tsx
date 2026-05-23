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
        <div className="mt-2 grid grid-cols-1 md:grid-cols-6 border-b p-2 pb-4 last:border-none gap-4 md:gap-0">
            {/* Image Section */}
            <div className="flex justify-center md:justify-start md:col-span-1">
                <Link href={`/product/${item.product_id}`}>
                    <div className="relative w-[120px] h-[120px] md:w-[100px] md:h-[100px]">
                        <Image
                            src={item.image_url || "/placeholder.png"}
                            fill
                            className="object-contain rounded-md outline outline-1 outline-offset-2 outline-slate-300"
                            alt={item.name}
                        />
                    </div>
                </Link>
            </div>

            {/* Info Section */}
            <div className="col-span-1 md:col-span-3 md:ml-2 flex flex-col justify-start">
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
            <div className="col-span-1 md:col-span-2 flex flex-col items-end justify-start gap-2 pt-2 pr-2">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || item.stock === 0}
                    className="w-full sm:w-[150px] bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full py-1.5 text-sm font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                <button
                    onClick={handleRemove}
                    className="w-full sm:w-[150px] bg-white border border-[#d5d9d9] hover:bg-[#f7fafa] rounded-full py-1.5 text-sm text-[#0f1111] font-medium shadow-sm transition-colors flex items-center justify-center"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default WishlistProduct;
