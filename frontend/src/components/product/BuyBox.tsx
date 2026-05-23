'use client'

import { useState } from "react";
import { ShoppingCart, Play, Heart, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

interface BuyBoxProps {
    productId: string;
    price: number;
    mrp: number;
    stock: number;
}

export default function BuyBox({ productId, price, mrp, stock }: BuyBoxProps) {
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isAddingWishlist, setIsAddingWishlist] = useState(false);

    const isWishlisted = wishlistItems.some(item => item.product_id === productId);

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsAdding(true);
        await addToCart(productId, quantity);
        setIsAdding(false);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        // Redirect to checkout with this product
        router.push(`/checkout?product=${productId}&quantity=${quantity}`);
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsAddingWishlist(true);
        try {
            if (isWishlisted) {
                const wishlistItem = wishlistItems.find(item => item.product_id === productId);
                if (wishlistItem) {
                    await removeFromWishlist(wishlistItem.wishlist_item_id);
                }
            } else {
                await addToWishlist(productId);
            }
        } catch (e) {
            // Error handling could go here
        } finally {
            setIsAddingWishlist(false);
        }
    };

    const discountPercentage = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    return (
        <div className="border border-gray-200 rounded-lg p-4 w-full md:w-[280px] flex-shrink-0 self-start sticky top-4 bg-white">
            <div className="flex flex-col mb-4">
                <span className="text-2xl font-medium">
                    <span className="text-sm align-top">₹</span>{price.toLocaleString()}
                </span>
                {discountPercentage > 0 && (
                    <span className="text-sm text-gray-500">
                        M.R.P.: <span className="line-through">₹{mrp.toLocaleString()}</span>
                    </span>
                )}
            </div>

            <div className="mb-4">
                <p className="text-sm text-[#007185] hover:text-[#c45500] cursor-pointer hover:underline">FREE delivery</p>
                <p className="text-sm font-bold text-green-700 mt-2">
                    {stock > 0 ? "In stock" : "Out of stock"}
                </p>
                {stock > 0 && stock < 10 && (
                    <p className="text-sm text-red-700">Only {stock} left in stock - order soon.</p>
                )}
            </div>

            {stock > 0 && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <label htmlFor="quantity" className="text-sm">Quantity: </label>
                        <select
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-gray-300 rounded-md py-1 px-2 text-sm shadow-sm bg-[#F0F2F2] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#007185]"
                        >
                            {[...Array(Math.min(10, stock))].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || addedToCart}
                        className={`w-full rounded-full py-2 px-4 text-sm font-medium shadow-sm transition-all duration-300 flex items-center justify-center disabled:opacity-80
                            ${addedToCart
                                ? "bg-[#131A22] border-[#131A22] text-white scale-[0.98]"
                                : "bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-[#0F1111]"
                            }`}
                    >
                        {addedToCart && <Check className="h-4 w-4 mr-2" />}
                        {isAdding ? "Adding..." : addedToCart ? "Added to Cart" : "Add to Cart"}
                    </button>

                    <button
                        onClick={handleBuyNow}
                        className="w-full bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ff8f00] rounded-full py-2 px-4 text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                        Buy Now
                    </button>

                    <div className="w-full border-t border-gray-200 my-2" />

                    <button
                        onClick={handleWishlistToggle}
                        disabled={isAddingWishlist}
                        className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-1.5 px-4 text-sm shadow-sm transition-colors flex items-center justify-center disabled:opacity-70 text-[#0F1111]"
                    >
                        <Heart className={`h-4 w-4 mr-2 transition-colors duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                        {isAddingWishlist ? "Updating..." : isWishlisted ? "In Wish List" : "Add to Wish List"}
                    </button>
                </div>
            )}

            <div className="mt-4 flex flex-col text-xs text-gray-500 gap-1 border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                    <span>Payment</span>
                    <span className="text-[#007185]">Secure transaction</span>
                </div>
                <div className="flex justify-between">
                    <span>Ships from</span>
                    <span>Amozun</span>
                </div>
                <div className="flex justify-between">
                    <span>Sold by</span>
                    <span>Amozun Retail</span>
                </div>
            </div>
        </div>
    );
}
