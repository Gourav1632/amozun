'use client'

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, totalItems, fetchCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');

    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
    const [saveAddress, setSaveAddress] = useState(false);

    const [buyNowItem, setBuyNowItem] = useState<{ productId: string, quantity: number } | null>(null);
    const [buyNowProduct, setBuyNowProduct] = useState<any>(null);
    const [isLoadingBuyNow, setIsLoadingBuyNow] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        const quantity = Number(urlParams.get('quantity')) || 1;

        if (productId) {
            setBuyNowItem({ productId, quantity });
            apiFetch(`/products/${productId}`).then(res => {
                if (res.status === 'success') setBuyNowProduct(res.data);
                setIsLoadingBuyNow(false);
            }).catch(() => setIsLoadingBuyNow(false));
        } else {
            setIsLoadingBuyNow(false);
        }

        apiFetch('/addresses').then(res => {
            if (res.status === 'success' && res.data.length > 0) {
                setSavedAddresses(res.data);
                setSelectedAddressId(res.data[0].id);
            }
        }).catch(err => console.error("Failed to fetch addresses:", err));
    }, []);

    const [address, setAddress] = useState({
        full_name: user?.name || "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        phone: ""
    });

    const isBuyNow = !!buyNowItem && !!buyNowProduct;
    const activeItems = isBuyNow ? [{ ...buyNowProduct, quantity: buyNowItem.quantity }] : items;
    const displayTotalItems = isBuyNow ? buyNowItem.quantity : totalItems;

    const subtotal = activeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (activeItems.length === 0) {
            alert("Nothing to checkout!");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalAddress = address;

            if (selectedAddressId !== "new") {
                const found = savedAddresses.find(a => a.id === selectedAddressId);
                if (found) {
                    finalAddress = {
                        full_name: found.full_name,
                        address_line1: found.address_line1,
                        address_line2: found.address_line2,
                        city: found.city,
                        state: found.state,
                        zip_code: found.zip_code,
                        phone: found.phone
                    };
                }
            } else if (saveAddress) {
                try {
                    await apiFetch('/addresses', {
                        method: 'POST',
                        body: JSON.stringify(address)
                    });
                } catch (err) {
                    console.warn("Failed to save address");
                }
            }

            const bodyPayload: any = {
                shippingAddress: finalAddress,
                paymentMethod
            };
            if (isBuyNow) {
                bodyPayload.buyNowItem = buyNowItem;
            }

            const res = await apiFetch('/orders', {
                method: 'POST',
                body: JSON.stringify(bodyPayload)
            });

            if (res.status === 'success' && res.data?.orderId) {
                if (!isBuyNow) {
                    await fetchCart(); // Refresh cart to empty it locally
                }

                if (res.data.url) {
                    window.location.href = res.data.url;
                } else {
                    router.push(`/orders/${res.data.orderId}`);
                }
            }
        } catch (error: any) {
            alert(error.message || "Failed to place order");
            setIsSubmitting(false);
        }
    };

    if (isLoadingBuyNow) {
        return <div className="min-h-screen bg-[#eaeded] flex justify-center pt-20">Loading checkout...</div>;
    }

    if (activeItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#eaeded] p-4 flex flex-col items-center pt-10">
                <div className="bg-white p-8 rounded shadow-sm flex flex-col items-center w-full max-w-lg text-center">
                    <h2 className="text-2xl font-bold mb-4">Your Amozun Cart is empty</h2>
                    <p className="mb-6 text-gray-600">Please add items to your cart before proceeding to checkout.</p>
                    <Link href="/">
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 px-6 shadow-sm">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <div className="max-w-[1500px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Left Column - Forms */}
                    <div className="w-full lg:w-3/4 bg-white p-5 shadow-sm">

                        <div className="flex justify-between items-end mb-1">
                            <h1 className="text-[28px] leading-8 font-medium text-[#0f1111]">
                                Checkout ({displayTotalItems} items)
                            </h1>
                        </div>
                        <div className="w-full bg-[#dddddd] h-[1px] mb-6 mt-2" />

                        {/* 1. Shipping Address */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4 ">1. Shipping address</h2>

                            {savedAddresses.length > 0 && (
                                <div className="mb-6 space-y-3">
                                    <h3 className="font-bold text-sm">Your saved addresses</h3>
                                    {savedAddresses.map(addr => (
                                        <label key={addr.id} className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${selectedAddressId === addr.id ? 'border-[#e77600] bg-[#fcf5ee]' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input
                                                type="radio"
                                                name="addressSelection"
                                                checked={selectedAddressId === addr.id}
                                                onChange={() => setSelectedAddressId(addr.id)}
                                                className="mt-1 h-4 w-4 text-[#e77600] focus:ring-[#e77600]"
                                            />
                                            <div className="text-sm">
                                                <div className="font-bold">{addr.full_name}</div>
                                                <div>{addr.address_line1} {addr.address_line2 && `, ${addr.address_line2}`}</div>
                                                <div>{addr.city}, {addr.state} {addr.zip_code}</div>
                                                <div>Phone number: {addr.phone}</div>
                                            </div>
                                        </label>
                                    ))}

                                    <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${selectedAddressId === "new" ? 'border-[#e77600] bg-[#fcf5ee]' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="addressSelection"
                                            checked={selectedAddressId === "new"}
                                            onChange={() => setSelectedAddressId("new")}
                                            className="mt-1 h-4 w-4 text-[#e77600] focus:ring-[#e77600]"
                                        />
                                        <div className="text-sm font-bold pt-0.5">
                                            Add a new address
                                        </div>
                                    </label>
                                </div>
                            )}

                            <form id="checkout-form" onSubmit={handleSubmit} className={`flex flex-col gap-4 ${selectedAddressId !== "new" && savedAddresses.length > 0 ? 'hidden' : ''}`}>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Full name</label>
                                    <input required={selectedAddressId === "new"} type="text" value={address.full_name} onChange={e => setAddress({ ...address, full_name: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Address Line 1</label>
                                    <input required={selectedAddressId === "new"} type="text" value={address.address_line1} onChange={e => setAddress({ ...address, address_line1: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Address Line 2 (Optional)</label>
                                    <input type="text" value={address.address_line2} onChange={e => setAddress({ ...address, address_line2: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">City</label>
                                        <input required={selectedAddressId === "new"} type="text" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">State</label>
                                        <input required={selectedAddressId === "new"} type="text" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">ZIP Code</label>
                                        <input required={selectedAddressId === "new"} type="text" value={address.zip_code} onChange={e => setAddress({ ...address, zip_code: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Phone number</label>
                                        <input required={selectedAddressId === "new"} type="tel" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="saveAddress"
                                        checked={saveAddress}
                                        onChange={(e) => setSaveAddress(e.target.checked)}
                                        className="h-4 w-4 text-[#e77600] focus:ring-[#e77600] rounded"
                                    />
                                    <label htmlFor="saveAddress" className="text-sm cursor-pointer">Save this address for future use</label>
                                </div>
                            </form>
                        </div>

                        <div className="w-full bg-[#dddddd] h-[1px] mb-6" />

                        {/* 2. Payment method */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">2. Payment method</h2>

                            <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer mb-3 ${paymentMethod === "COD" ? 'border-[#e77600] bg-[#fcf5ee]' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => setPaymentMethod('COD')}
                                    className="mt-1 h-4 w-4 text-[#e77600] focus:ring-[#e77600]"
                                />
                                <div>
                                    <div className="text-sm font-medium">Cash on Delivery (COD) / Pay on Delivery</div>
                                    <p className="text-xs text-gray-500 mt-1">Please pay the delivery agent in cash or via UPI when the package arrives.</p>
                                </div>
                            </label>

                            <label className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${paymentMethod === "CARD" ? 'border-[#e77600] bg-[#fcf5ee]' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'CARD'}
                                    onChange={() => setPaymentMethod('CARD')}
                                    className="mt-1 h-4 w-4 text-[#e77600] focus:ring-[#e77600]"
                                />
                                <div>
                                    <div className="text-sm font-medium">Credit or Debit Card</div>
                                    <p className="text-xs text-gray-500 mt-1">Pay securely via Credit or Debit Card.</p>
                                </div>
                            </label>
                        </div>

                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white p-5 shadow-sm sticky top-4">
                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium mb-4 disabled:opacity-70"
                            >
                                {isSubmitting ? "Processing..." : "Place your order in INR"}
                            </button>
                            <p className="text-xs text-center text-gray-500 mb-4 pb-4 border-b border-gray-200">
                                By placing your order, you agree to Amozun's privacy notice and conditions of use.
                            </p>

                            <h3 className="font-bold text-lg mb-2">Order Summary</h3>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Items:</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Delivery:</span>
                                <span>₹0</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1 pb-2 border-b border-gray-200">
                                <span>Total:</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-[#b12704] mt-2">
                                <span>Order Total:</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
