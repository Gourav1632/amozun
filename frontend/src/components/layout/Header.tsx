'use client'
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingCart, User, ChevronDown, List, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useDelivery } from "@/context/DeliveryContext";
import SearchBar from "./SearchBar";
import { Suspense, useState } from "react";
import LocationModal from "./LocationModal";
import SidebarMenu from "./SidebarMenu";
import AccountMenuMobile from "./AccountMenuMobile";

const Header = ({ title }: any) => {
    const { user, isLoading, logout } = useAuth();
    const { totalItems } = useCart();
    const { selectedAddress } = useDelivery();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const openMenuHandler = () => {
        setIsSidebarOpen(true);
    };

    return (
        <>
            <header>
                <div className="bg-[#131A22] flex flex-col md:flex-row">
                    <div className="flex flex-grow items-center justify-between md:justify-start p-3 md:space-x-5 md:px-4 text-white w-full">
                        {/* Menu Icon Mobile */}
                        <div className="flex items-center justify-center">
                            <div
                                onClick={openMenuHandler}
                                className="md:hidden cursor-pointer mr-1"
                            >
                                <Menu className="h-8 md:h-7" />
                            </div>
                            {/* Logo */}
                            <Link href="/" className="flex items-center px-2 pt-1 pb-1 mt-1 border border-transparent hover:border-white rounded-sm">
                                <Image src="/images/logo.png" alt="Amozun Logo" width={100} height={30} className="object-contain" style={{ width: 'auto', height: 'auto' }} priority />
                            </Link>
                        </div>

                        <div
                            className="hidden md:flex items-end ml-2 cursor-pointer hover:border hover:border-white p-1 border border-transparent rounded-[2px]"
                            onClick={() => setIsLocationModalOpen(true)}
                        >
                            <MapPin className="h-[18px] w-[18px] text-white mb-[2px]" />
                            <div className="flex flex-col pl-1">
                                <span className="text-[#ccc] text-[12px] leading-[14px] pl-[1px]">
                                    {selectedAddress ? `Deliver to ${selectedAddress.full_name.split(' ')[0]}` : "Deliver to"}
                                </span>
                                <span className="text-white text-[14px] font-bold leading-[15px]">
                                    {selectedAddress ? `${selectedAddress.city} ${selectedAddress.zip_code}` : "Select your address"}
                                </span>
                            </div>
                        </div>

                        {/* Search Desktop*/}
                        <div className="hidden md:flex flex-grow mx-4">
                            <Suspense fallback={<div className="h-10 bg-white w-full rounded-md" />}>
                                <SearchBar />
                            </Suspense>
                        </div>

                        {/* Mega Menu Flyout for Account & Lists */}
                        <div className="hidden md:flex flex-col mx-4 cursor-pointer group relative pt-2 pb-2">
                            {/* Backdrop */}
                            <div className="fixed inset-0 bg-black/60 hidden group-hover:block z-[45] pointer-events-none"></div>

                            <div className="flex flex-col relative z-[50] bg-[#131A22] rounded-[2px] p-1 -m-1">
                                <span className="text-xs leading-tight">Hello, {isLoading ? "..." : (user ? user.name : "sign in")}</span>
                                <span className="text-sm font-bold flex items-center leading-tight">Account & Lists <ChevronDown className="h-3 ml-1 text-gray-400" /></span>
                            </div>

                            {/* Flyout Menu */}
                            <div className="absolute top-[40px] -right-20 mt-1 hidden group-hover:block bg-white text-black rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 z-50 w-[300px] p-4 cursor-default">
                                {/* Triangle pointer */}
                                <div className="absolute -top-2 right-[90px] w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

                                {!isLoading && !user && (
                                    <div className="flex flex-col items-center border-b border-gray-200 pb-3 mb-3">
                                        <Link href="/login" className="w-48 bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] text-center rounded-lg py-1.5 text-[13px] font-medium shadow-sm mb-1 text-black">
                                            Sign in
                                        </Link>
                                        <div className="text-[11px] text-gray-600">
                                            New customer? <Link href="/register" className="text-[#007185] hover:text-[#c45500] hover:underline">Start here.</Link>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between">

                                    {/* Right Column - Your Account */}
                                    <div className="w-full pl-4">
                                        <h3 className="font-bold text-[16px] mb-2">Your Account</h3>
                                        <ul className="text-[13px] text-[#444] space-y-2">
                                            <li><Link href="/account" className="hover:text-[#c45500] hover:underline">Your Account</Link></li>
                                            <li><Link href="/orders" className="hover:text-[#c45500] hover:underline">Your Orders</Link></li>
                                            <li><Link href="/wishlist" className="hover:text-[#c45500] hover:underline">Your Wish List</Link></li>
                                            <li><Link href="/account/addresses" className="hover:text-[#c45500] hover:underline">Your Addresses</Link></li>
                                            <li><Link href="/recently-viewed" className="hover:text-[#c45500] hover:underline">Recently Viewed</Link></li>
                                            {user && (
                                                <li><button onClick={logout} className="hover:text-[#c45500] hover:underline w-full text-left">Sign Out</button></li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/orders" className="hidden md:flex flex-col mx-4 cursor-pointer hover:border border-transparent hover:border-white p-1 -m-1">
                            <span className="text-xs">Returns</span>
                            <span className="text-sm font-bold">& Orders</span>
                        </Link>

                        {/* Right side cluster for mobile/desktop */}
                        <div className="flex items-center">
                            {/* Profile Icon Mobile */}
                            <div
                                className="flex md:hidden items-center text-sm font-medium cursor-pointer hover:border-white p-1 border border-transparent rounded-[2px]"
                                onClick={() => setIsAccountMenuOpen(true)}
                            >
                                <span>{isLoading ? '...' : (user ? user.name.split(' ')[0] : 'Sign in')}</span>
                                <User className="h-6 ml-1" />
                            </div>

                            {/* Cart (desktop + mobile) */}
                            <Link href="/cart" className="flex items-center cursor-pointer ml-2 hover:border hover:border-white p-1 border border-transparent rounded-[2px]">
                                <ShoppingCart className="h-8" />
                                <span className="font-bold text-[#F90] ml-1 mt-3">{totalItems}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search Mobile*/}
                <div className="md:hidden p-2 bg-[#232F3E]">
                    <Suspense fallback={<div className="h-10 bg-white w-full rounded-md" />}>
                        <SearchBar />
                    </Suspense>
                </div>
                {/* Amazon Sub-Header (nav-main) */}
                <div className="hidden md:flex bg-[#232F3E] text-white items-center px-4 py-1 space-x-4 text-sm font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
                    <div
                        onClick={openMenuHandler}
                        className="flex items-center gap-1 cursor-pointer hover:border hover:border-white p-1 -m-1 mr-2 border border-transparent"
                    >
                        <Menu className="h-5" />
                        <span className="px-2 py-1">All</span>
                    </div>

                    {[
                        { label: 'Bestsellers', href: '/search?sort=bestsellers' },
                        { label: 'Today\'s Deals', href: '/search?minDiscount=10' },
                        { label: 'Mobiles', href: '/search?category=mobiles' },
                        { label: 'New Releases', href: '/search?sort=new' },
                        { label: 'Electronics', href: '/search?category=electronics' },
                        { label: 'Fashion', href: '/search?category=fashion' },
                        { label: 'Home & Kitchen', href: '/search?category=home-kitchen' },
                        { label: 'Computers', href: '/search?category=computers' },
                        { label: 'Toys & Games', href: '/search?category=toys' },
                        { label: 'Beauty & Personal Care', href: '/search?category=beauty' },
                        { label: 'Books', href: '/search?category=books' },
                        { label: 'Sports, Fitness & Outdoors', href: '/search?category=sports' },
                        { label: 'Baby', href: '/search?category=baby' },
                        { label: 'Pet Supplies', href: '/search?category=pets' },
                        { label: 'Video Games', href: '/search?category=video-games' },
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="cursor-pointer hover:border hover:border-white px-2 py-2 border border-transparent whitespace-nowrap"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
                <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <AccountMenuMobile isOpen={isAccountMenuOpen} onClose={() => setIsAccountMenuOpen(false)} />
            </header >
        </>
    );
};

export default Header;
