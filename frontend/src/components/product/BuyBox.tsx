'use client'

import { useState } from "react";
import { ShoppingCart, Play } from "lucide-react";
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
    const { addToWishlist } = useWishlist();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingWishlist, setIsAddingWishlist] = useState(false);

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsAdding(true);
        await addToCart(productId, quantity);
        setIsAdding(false);
    };

    const handleBuyNow = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        // Redirect to checkout with this product
        router.push(`/checkout?product=${productId}&quantity=${quantity}`);
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsAddingWishlist(true);
        try {
            await addToWishlist(productId);
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
                        disabled={isAdding}
                        className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full py-2 px-4 text-sm font-medium shadow-sm transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {isAdding ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                        onClick={handleBuyNow}
                        className="w-full bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ff8f00] rounded-full py-2 px-4 text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <Play className="h-4 w-4 fill-current" /> Buy Now
                    </button>
                    
                    <div className="w-full border-t border-gray-200 my-2" />
                    
                    <button
                        onClick={handleAddToWishlist}
                        disabled={isAddingWishlist}
                        className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-1.5 px-4 text-sm shadow-sm transition-colors flex items-center justify-center disabled:opacity-70 text-[#0F1111]"
                    >
                        {isAddingWishlist ? "Adding..." : "Add to Wish List"}
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
