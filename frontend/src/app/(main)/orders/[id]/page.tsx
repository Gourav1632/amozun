'use client'

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import RecentlyViewedSidebar from "@/components/cart/RecentlyViewedSidebar";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) return;

        apiFetch(`/orders/${orderId}`)
            .then(res => {
                if (res.status === 'success') {
                    setOrder(res.data);
                } else {
                    setError("Failed to load order.");
                }
            })
            .catch(err => {
                setError(err.message || "An error occurred.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [orderId]);

    if (isLoading) {
        return <div className="min-h-screen bg-[#eaeded] flex justify-center pt-20">Loading order details...</div>;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#eaeded] flex flex-col items-center pt-20 px-4">
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "We couldn't find the order you are looking for."}</p>
                    <Link href="/orders">
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-lg border border-[#fcd200]">
                            Go to Your Orders
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Column - Order Details */}
                <div className="w-full lg:w-3/4 flex flex-col gap-4">
                    <div className="bg-white p-5 shadow-sm">
                        <div className="flex justify-between items-end mb-1">
                            <h1 className="text-[28px] leading-8 font-medium text-[#0f1111]">Order Details</h1>
                            <Link href="/orders" className="text-[#007185] hover:text-[#c45500] hover:underline text-sm hidden md:block">
                                Return to Order History
                            </Link>
                        </div>
                        <div className="w-full bg-[#dddddd] h-[1px] mb-6 mt-2" />

                        {/* Top Success Banner (if recently placed) */}
                        <div className="bg-white border-l-4 border-green-600 p-4 mb-6 shadow-sm flex items-center gap-3">
                            <CheckCircle2 className="text-green-600 h-8 w-8" />
                            <div>
                                <h2 className="text-xl font-bold text-green-700">Order Placed, thank you!</h2>
                                <p className="text-sm text-gray-600">Confirmation will be sent to your email.</p>
                            </div>
                        </div>

                        {/* Order Meta Info */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6 text-sm text-[#0f1111]">
                            <div>
                                <span className="block font-bold">Order Placed</span>
                                <span>{orderDate}</span>
                            </div>
                            <div className="md:border-l md:pl-4 border-gray-300">
                                <span className="block font-bold">Order ID</span>
                                <span className="font-mono text-gray-600">{order.id}</span>
                            </div>
                            <div className="md:border-l md:pl-4 border-gray-300">
                                <span className="block font-bold">Total</span>
                                <span className="text-[#B12704] font-bold">₹{Number(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="w-full bg-[#dddddd] h-[1px] mb-6" />

                        {/* Details Grid (Address, Payment, Summary) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <h3 className="font-bold mb-3 text-lg">Shipping Address</h3>
                                <p className="font-bold">{order.shippingAddress.full_name}</p>
                                <p>{order.shippingAddress.address_line1}</p>
                                {order.shippingAddress.address_line2 && <p>{order.shippingAddress.address_line2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip_code}</p>
                                <p className="mt-2 text-gray-500">Phone: {order.shippingAddress.phone}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold mb-3 text-lg">Payment Method</h3>
                                <p>Pay on Delivery (Cash/UPI)</p>
                            </div>

                            <div>
                                <h3 className="font-bold mb-3 text-lg">Order Summary</h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Item(s) Subtotal:</span>
                                    <span>₹{Number(order.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1 pb-2 border-b border-gray-200">
                                    <span>Shipping:</span>
                                    <span>₹0</span>
                                </div>
                                <div className="flex justify-between font-bold mt-2 text-base text-[#b12704]">
                                    <span>Grand Total:</span>
                                    <span>₹{Number(order.total_amount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                            <Package className="text-gray-600" />
                            <h3 className="font-bold text-lg text-green-700">Preparing for Shipment</h3>
                        </div>
                        
                        <div className="flex flex-col">
                            {order.items.map((item: any, index: number) => (
                                <div key={item.id} className={`py-4 flex flex-row gap-4 ${index !== order.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <div className="flex-shrink-0 w-24 h-24 relative bg-gray-50 border border-gray-200 cursor-pointer" onClick={() => router.push(`/product/${item.product_id}`)}>
                                        <Image 
                                            src={item.image_url || "/placeholder.jpg"} 
                                            alt={item.product_name_snapshot} 
                                            fill 
                                            sizes="96px"
                                            className="object-contain p-2"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div>
                                            <Link href={`/product/${item.product_id}`}>
                                                <h4 className="text-[#007185] hover:text-[#c45500] hover:underline font-medium text-sm line-clamp-2 mb-1">
                                                    {item.product_name_snapshot}
                                                </h4>
                                            </Link>
                                            <p className="text-xs text-gray-500 mb-1">Sold by: Amozun Retail</p>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-[#B12704]">₹{Number(item.price_at_purchase).toLocaleString()}</span>
                                                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button 
                                                onClick={() => router.push(`/product/${item.product_id}`)}
                                                className="bg-[#ffd814] hover:bg-[#f7ca00] text-sm py-1.5 px-3 rounded-full border border-[#fcd200] shadow-sm font-medium"
                                            >
                                                Buy it again
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
