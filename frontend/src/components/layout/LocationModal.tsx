'use client'

import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { useDelivery } from "@/context/DeliveryContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
    const { user } = useAuth();
    const { selectedAddress: globalAddress, setSelectedAddress: setGlobalAddress } = useDelivery();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localSelectedId, setLocalSelectedId] = useState<string>("");

    // Fetch addresses when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setIsLoading(true);
            apiFetch('/addresses')
                .then(res => {
                    if (res.status === 'success') {
                        setAddresses(res.data);
                        if (globalAddress) {
                            setLocalSelectedId(globalAddress.id);
                        } else {
                            const defaultAddr = res.data.find((a: any) => a.is_default);
                            if (defaultAddr) setLocalSelectedId(defaultAddr.id);
                            else if (res.data.length > 0) setLocalSelectedId(res.data[0].id);
                        }
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, user, globalAddress]);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[375px] overflow-hidden flex flex-col z-10 animate-fade-in-up">

                {/* Header */}
                <div className="bg-[#f0f2f2] border-b border-[#d5d9d9] px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <h4 className="font-bold text-[15px] text-[#0f1111]">Choose your location</h4>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black cursor-pointer"
                        aria-label="Close"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-[13px] text-[#565959] leading-snug mb-4">
                        Delivery options and delivery speeds may vary for different locations
                    </p>

                    {!user ? (
                        <div className="mb-4">
                            <Link href="/login" onClick={onClose}>
                                <button className="w-full bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] rounded-lg py-1.5 text-[13px] shadow-sm text-[#0f1111]">
                                    Sign in to see your addresses
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="mb-4">
                            {isLoading ? (
                                <p className="text-[13px] text-gray-500 mb-4 text-center">Loading addresses...</p>
                            ) : addresses.length > 0 ? (
                                <div className="flex flex-col gap-3 mb-4">
                                    <select
                                        value={localSelectedId}
                                        onChange={(e) => setLocalSelectedId(e.target.value)}
                                        className="w-full border border-gray-400 rounded p-2 text-[14px] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none bg-white cursor-pointer"
                                    >
                                        {addresses.map(addr => (
                                            <option key={addr.id} value={addr.id}>
                                                {addr.full_name} - {addr.city}, {addr.zip_code}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="w-full bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] rounded-lg py-1.5 text-[13px] shadow-sm text-[#0f1111]"
                                        onClick={() => {
                                            const addr = addresses.find(a => a.id === localSelectedId);
                                            if (addr) setGlobalAddress(addr);
                                            onClose();
                                        }}
                                    >
                                        Apply Selected Address
                                    </button>
                                </div>
                            ) : (
                                <p className="text-[13px] text-gray-500 mb-4 text-center">No saved addresses found.</p>
                            )}

                            <div className="flex items-center my-3">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-2 text-[12px] text-gray-500">or</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <Link href="/account/addresses" onClick={onClose}>
                                <button className="w-full bg-white border border-[#d5d9d9] rounded-lg py-2 text-[13px] hover:bg-gray-50 shadow-sm text-[#0f1111]">
                                    Manage address book
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
