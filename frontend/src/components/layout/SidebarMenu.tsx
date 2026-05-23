'use client';

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { User, X, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface SidebarMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
    const { user } = useAuth();

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
        <div className={`relative z-[100] ${isOpen ? '' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/80 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            >
                {/* Close Button positioned right outside the menu */}
                <button
                    className="absolute top-4 left-[330px] sm:left-[380px] text-white p-2 hover:bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <X className="w-8 h-8" />
                </button>
            </div>

            {/* Sidebar Content */}
            <div
                className={`fixed top-0 left-0 h-full w-[320px] sm:w-[365px] bg-white overflow-y-auto shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <Link href={user ? "/account" : "/login"} onClick={onClose} className="bg-[#232f3e] px-8 min-h-[100px] py-4 flex items-center shrink-0 hover:bg-[#37475a] transition-colors cursor-pointer">
                    <User className="text-white w-7 h-7 mr-3" />
                    <span className="text-white text-[19px] font-bold">
                        Hello, {user ? user.name.split(' ')[0] : 'sign in'}
                    </span>
                </Link>

                {/* Content Sections */}
                <div className="py-2 pb-20">
                    {/* Trending */}
                    <div className="py-2 border-b border-gray-300">
                        <h2 className="px-8 py-2 text-[18px] font-bold text-[#111]">Trending</h2>
                        <ul className="flex flex-col">
                            <li><Link href="/search?sort=bestsellers" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Bestsellers</Link></li>
                            <li><Link href="/search?sort=new" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">New Releases</Link></li>
                        </ul>
                    </div>

                    {/* Top Categories */}
                    <div className="py-2 border-b border-gray-300">
                        <h2 className="px-8 py-2 text-[18px] font-bold text-[#111]">Top Categories for You</h2>
                        <ul className="flex flex-col">
                            <li><Link href="/search?category=electronics" onClick={onClose} className="flex items-center justify-between px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Electronics</Link></li>
                            <li><Link href="/search?category=clothing" onClick={onClose} className="flex items-center justify-between px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Fashion</Link></li>
                            <li><Link href="/search?category=home" onClick={onClose} className="flex items-center justify-between px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Home & Kitchen</Link></li>
                            <li><Link href="/search" onClick={onClose} className="flex items-center justify-between px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">See All Categories <ChevronRight className="w-4 h-4 text-gray-500" /></Link></li>
                        </ul>
                    </div>

                    {/* Programs & Features */}
                    <div className="py-2">
                        <h2 className="px-8 py-2 text-[18px] font-bold text-[#111]">Programs & Features</h2>
                        <ul className="flex flex-col">
                            <li><Link href="/search" onClick={onClose} className="flex items-center justify-between px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Today's Deals</Link></li>
                            <li><Link href="/account" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Your Account</Link></li>
                            <li><Link href="/orders" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Your Orders</Link></li>
                            <li><Link href="/wishlist" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Your Wishlist</Link></li>
                            <li><Link href="/recently-viewed" onClick={onClose} className="flex items-center px-8 py-[13px] text-[14px] text-[#111] hover:bg-gray-200">Recently Viewed</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
