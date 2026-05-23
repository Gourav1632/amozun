'use client'

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CartProduct from "@/components/cart/CartProduct";
import Checkout from "@/components/cart/Checkout";
import RecentlyViewedSidebar from "@/components/cart/RecentlyViewedSidebar";

export default function CartPage() {
    const { items, isLoading } = useCart();
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { subTotal, total } = useMemo(() => {
        const selectedItems = items.filter((item) => selectedIds.includes(item.cart_item_id));
        const calculatedSubTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const calculatedTotal = calculatedSubTotal;
        return { subTotal: calculatedSubTotal, total: calculatedTotal };
    }, [items, selectedIds]);

    const shippingFee = 0;

    const handleCheckout = () => {
        if (!user) {
            router.push('/login');
        } else {
            router.push('/checkout');
        }
    };

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
                    <h2 className="text-2xl font-bold mb-4 text-[#0f1111]">Your Amozun Cart is empty</h2>
                    <Link href="/login">
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 px-6 shadow-sm">
                            Sign in to your account
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleDeselectAll = () => {
        setSelectedIds([]);
    };

    return (
        <div className="min-h-screen bg-[#eaeded]">
            <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row px-4 py-8 gap-6 items-start">
                {/* Left Column */}
                <div className="w-full lg:w-3/4">

                    <div className="bg-white p-5 shadow-sm">
                        <div className="flex justify-between items-end mb-1">
                            <h2 className="font-medium text-[28px] leading-8 text-[#0f1111]">
                                Shopping Cart
                            </h2>
                            <span className="hidden md:block text-sm text-[#565959] pr-4">Price</span>
                        </div>

                        {items.length > 0 && (
                            <div className="mb-2">
                                <button onClick={handleDeselectAll} className="text-[#007185] hover:text-[#c45500] hover:underline text-sm">
                                    Deselect all items
                                </button>
                            </div>
                        )}

                        <div className="w-full bg-[#dddddd] h-[1px] mb-4" />

                        {items.length === 0 ? (
                            <div className="py-8 text-center text-lg text-gray-600">
                                Your Amozun Cart is empty.
                            </div>
                        ) : (
                            items.map((item) => (
                                <CartProduct
                                    key={item.cart_item_id}
                                    item={item}
                                    selectedIds={selectedIds}
                                    setSelectedIds={setSelectedIds}
                                />
                            ))
                        )}

                        {items.length > 0 && (
                            <div className="mt-4 text-right pr-4">
                                <span className="text-lg">
                                    Subtotal ({selectedIds.length} items): <span className="font-bold text-[#0f1111]">₹{subTotal.toLocaleString()}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-full lg:w-1/4 flex flex-col gap-4">
                    <Checkout
                        subtotal={subTotal}
                        shippingFee={shippingFee}
                        total={total}
                        selectedCount={selectedIds.length}
                        handleCheckout={handleCheckout}
                    />

                    <RecentlyViewedSidebar />
                </div>
            </div>
        </div>
    );
}
