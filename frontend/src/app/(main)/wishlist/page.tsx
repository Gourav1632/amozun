'use client'

import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import WishlistProduct from "@/components/wishlist/WishlistProduct";
import RecentlyViewedSidebar from "@/components/cart/RecentlyViewedSidebar";

export default function WishlistPage() {
    const { items, isLoading } = useWishlist();
    const { user, isLoading: isAuthLoading } = useAuth();

    if (isAuthLoading || isLoading) {
        return (
            <div className="min-h-screen bg-[#eaeded] flex justify-center pt-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c45500]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#eaeded] p-4 flex flex-col items-center pt-10">
                <div className="bg-white p-8 rounded shadow-sm flex flex-col items-center w-full max-w-lg border">
                    <h2 className="text-2xl font-bold mb-4">Sign in to view your Wish List</h2>
                    <Link href="/login">
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 px-6 shadow-sm">
                            Sign in to your account
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 items-start">

                {/* Left Column - Main Content */}
                <div className="w-full lg:w-3/4 flex flex-col gap-4">

                    <div className="bg-white p-5 shadow-sm">
                        <div className="flex justify-between items-end mb-1">
                            <h1 className="text-[28px] leading-8 font-medium text-[#0f1111]">
                                Wish List
                            </h1>
                            <span className="hidden md:block text-sm text-[#565959] pr-4">
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        <div className="w-full bg-[#dddddd] h-[1px] mb-4 mt-2" />

                        {items.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <p className="text-lg text-gray-600 mb-4">Your Wish List is empty.</p>
                                <Link href="/" className="text-[#007185] hover:text-[#c45500] hover:underline">
                                    Continue shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {items.map((item) => (
                                    <WishlistProduct
                                        key={item.wishlist_item_id}
                                        item={item}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Recommendations */}
                <div className="w-full lg:w-1/4">
                    <RecentlyViewedSidebar />
                </div>

            </div>
        </div>
    );
}
