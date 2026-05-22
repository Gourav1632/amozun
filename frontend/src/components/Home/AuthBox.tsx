'use client'

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

export default function AuthBox() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="bg-white p-4 z-20 flex flex-col h-[420px] sm:hidden lg:flex animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
                <div className="bg-gray-100 h-full w-full mb-4 flex-grow mt-2 rounded"></div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="bg-white p-4 z-20 flex flex-col h-[420px] sm:hidden lg:flex">
                <h2 className="text-xl font-bold mb-4">Welcome back, {user.name}!</h2>
                <div className="bg-[#f8f8f8] h-full w-full mb-4 flex-grow relative rounded-sm overflow-hidden p-4 flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 bg-[#e3e6e6] rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl text-gray-500 font-bold">{user.name.charAt(0).toUpperCase()}</span>
                   </div>
                   <p className="text-sm text-gray-600 mb-2">Ready to explore more deals today?</p>
                   <Link href="/orders" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                       View your orders
                   </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 z-20 flex flex-col h-[420px] sm:hidden lg:flex">
            <h2 className="text-xl font-bold mb-4">Sign in for your best experience</h2>
            <Link href="/login" className="w-full">
                <button className="w-full bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] rounded-lg py-2 text-[13px] font-medium shadow-sm mb-2">
                    Sign in securely
                </button>
            </Link>
            <div className="bg-gray-100 h-full w-full mb-4 flex-grow mt-2 relative rounded overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-sm text-gray-600 font-medium">Create an account to save items, track orders, and more.</p>
                </div>
            </div>
        </div>
    );
}
