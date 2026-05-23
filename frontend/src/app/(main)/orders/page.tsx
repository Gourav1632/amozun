'use client'

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import RecentlyViewedSidebar from "@/components/cart/RecentlyViewedSidebar";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        apiFetch('/orders')
            .then(res => {
                if (res.status === 'success') {
                    setOrders(res.data);
                }
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <div className="min-h-screen bg-[#eaeded] flex justify-center pt-20">Loading your orders...</div>;
    }

    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Column - Main Content */}
                <div className="w-full lg:w-3/4 flex flex-col gap-4">
                    <div className="bg-white p-5 shadow-sm">
                        <div className="flex justify-between items-end mb-1">
                            <h1 className="text-[28px] leading-8 font-medium text-[#0f1111]">Your Orders</h1>
                            <span className="hidden md:block text-sm text-[#565959] pr-4">
                                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                            </span>
                        </div>
                        <div className="w-full bg-[#dddddd] h-[1px] mb-6 mt-2" />

                        {orders.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <h2 className="text-xl font-medium mb-4">You have not placed any orders yet.</h2>
                                <Link href="/">
                                    <button className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-full border border-[#fcd200] shadow-sm font-medium text-sm">
                                        Start Shopping
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {orders.map((order: any, idx: number) => (
                                    <div key={order.id} className="flex flex-col">
                                        {/* Order Header */}
                                        <div className="bg-[#f0f2f2] p-4 flex flex-wrap gap-4 sm:gap-10 justify-between items-start sm:items-center text-sm text-gray-700">
                                            <div className="flex gap-10">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#0f1111]">ORDER PLACED</span>
                                                    <span>
                                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                                            month: 'long', day: 'numeric', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#0f1111]">TOTAL</span>
                                                    <span>₹{Number(order.total_amount).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-[#0f1111]">ORDER # {order.id}</span>
                                                <Link href={`/orders/${order.id}`} className="text-[#007185] hover:text-[#c45500] hover:underline">
                                                    View order details
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Order Body */}
                                        <div className="pt-5">
                                            <h3 className="font-bold text-lg mb-4 text-green-700">
                                                Confirmed
                                            </h3>
                                            
                                            <div className="flex flex-col gap-4">
                                                {order.items?.map((item: any) => (
                                                    <div key={item.product_id} className="flex items-center gap-4">
                                                        <div className="flex-shrink-0 w-20 h-20 relative bg-gray-50 border border-gray-200 cursor-pointer" onClick={() => router.push(`/product/${item.product_id}`)}>
                                                            <Image 
                                                                src={item.image_url || "/placeholder.jpg"} 
                                                                alt={item.product_name_snapshot} 
                                                                fill 
                                                                className="object-contain p-1"
                                                            />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <Link href={`/product/${item.product_id}`}>
                                                                <h4 className="text-[#007185] hover:text-[#c45500] hover:underline font-medium text-sm line-clamp-2">
                                                                    {item.product_name_snapshot}
                                                                </h4>
                                                            </Link>
                                                            <div className="mt-2 flex gap-2">
                                                                <button 
                                                                    onClick={() => router.push(`/product/${item.product_id}`)}
                                                                    className="bg-[#ffd814] hover:bg-[#f7ca00] text-xs py-1.5 px-3 rounded-full border border-[#fcd200] shadow-sm font-medium"
                                                                >
                                                                    Buy it again
                                                                </button>
                                                                <Link href={`/orders/${order.id}`}>
                                                                    <button className="bg-white hover:bg-[#f7fafa] text-[#0f1111] text-xs py-1.5 px-3 rounded-full border border-[#d5d9d9] shadow-sm font-medium">
                                                                        Track package
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Divider below each order except the last */}
                                        {idx < orders.length - 1 && <div className="w-full bg-[#dddddd] h-[1px] mt-6" />}
                                    </div>
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
