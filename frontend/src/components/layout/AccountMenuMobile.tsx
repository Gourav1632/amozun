'use client';

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { User, X } from "lucide-react";
import { useEffect } from "react";

interface AccountMenuMobileProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountMenuMobile({ isOpen, onClose }: AccountMenuMobileProps) {
    const { user, logout } = useAuth();

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className={`relative z-[100] md:hidden ${isOpen ? '' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/80 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            >
                {/* Close Button positioned left outside the menu */}
                <button
                    className="absolute top-4 right-[330px] sm:right-[380px] text-white p-2 hover:bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <X className="w-8 h-8" />
                </button>
            </div>

            {/* Sidebar Content (Slides from Right) */}
            <div
                className={`fixed top-0 right-0 h-full w-[320px] sm:w-[365px] bg-white overflow-y-auto shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <Link href={user ? "/account" : "/login"} onClick={onClose} className="bg-[#232f3e] px-8 min-h-[100px] py-4 flex items-center justify-end shrink-0 hover:bg-[#37475a] transition-colors cursor-pointer">
                    <span className="text-white text-[19px] font-bold">
                        Hello, {user ? user.name.split(' ')[0] : 'sign in'}
                    </span>
                    <User className="text-white w-7 h-7 ml-3" />
                </Link>

                {/* Content Sections */}
                <div className="py-2 pb-20">
                    {!user && (
                        <div className="py-4 border-b border-gray-300 flex flex-col items-center">
                            <Link href="/login" onClick={onClose} className="w-48 bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] text-center rounded-lg py-1.5 text-[14px] font-medium shadow-sm mb-2 text-black">
                                Sign in
                            </Link>
                            <div className="text-[13px] text-gray-600">
                                New customer? <Link href="/register" onClick={onClose} className="text-[#007185] hover:text-[#c45500] hover:underline">Start here.</Link>
                            </div>
                        </div>
                    )}

                    <div className="py-2">
                        <h2 className="px-8 py-2 text-[18px] font-bold text-[#111]">Your Account</h2>
                        <ul className="flex flex-col">
                            <li><Link href="/account" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Your Account</Link></li>
                            <li><Link href="/orders" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Your Orders</Link></li>
                            <li><Link href="/wishlist" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Your Wish List</Link></li>
                            <li><Link href="/account/addresses" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Your Addresses</Link></li>
                            <li><Link href="/recently-viewed" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Recently Viewed</Link></li>
                            {user && (
                                <li>
                                    <button
                                        onClick={() => { logout(); onClose(); }}
                                        className="flex w-full items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200"
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
