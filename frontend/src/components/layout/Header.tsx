'use client'
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = ({ title }: any) => {
    const { user, logout } = useAuth();
    const openMenuHandler = () => {
        console.log("Open menu");
    };

    return (
        <>
            <header>
                <div className="bg-[#131A22] flex flex-col md:flex-row">
                    <div className="flex flex-grow items-center p-3 md:space-x-5 md:px-4 text-white">
                        {/* Menu Icon Mobile */}
                        <div className="flex items-center justify-center">
                            <div
                                onClick={openMenuHandler}
                                className="md:hidden cursor-pointer mr-1"
                            >
                                <Menu className="h-8 md:h-7" />
                            </div>
                            {/* Logo */}
                            <Link href="/">
                                <div className="text-2xl font-bold pt-2 px-2">Amozun</div>
                            </Link>
                        </div>

                        <div className="hidden md:flex flex-col ml-4">
                            <span className="text-xs text-gray-300">Deliver to</span>
                            <span className="text-sm font-bold">Select your address</span>
                        </div>

                        {/* Search Desktop*/}
                        <div className="hidden md:flex flex-grow mx-4 items-center bg-white rounded-md h-10 overflow-hidden">
                            <input type="text" className="h-full w-full px-4 text-black focus:outline-none" placeholder="Search Amozun..." />
                            <div className="bg-[#FEBD69] h-full px-4 flex items-center justify-center cursor-pointer hover:bg-[#F3A847]">
                                <Search className="h-5 text-gray-900" />
                            </div>
                        </div>

                        {/* Mega Menu Flyout for Account & Lists */}
                        <div className="hidden md:flex flex-col mx-4 cursor-pointer group relative pt-2 pb-2">
                            <div className="flex flex-col">
                                <span className="text-xs leading-tight">Hello, {user ? user.name : "sign in"}</span>
                                <span className="text-sm font-bold flex items-center leading-tight">Account & Lists <ChevronDown className="h-3 ml-1 text-gray-400" /></span>
                            </div>

                            {/* Flyout Menu */}
                            <div className="absolute top-[40px] -right-20 mt-1 hidden group-hover:block bg-white text-black rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 z-50 w-[300px] p-4 cursor-default">
                                {/* Triangle pointer */}
                                <div className="absolute -top-2 right-[90px] w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

                                {!user && (
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
                                            <li><Link href="#" className="hover:text-[#c45500] hover:underline">Your Account</Link></li>
                                            <li><Link href="/orders" className="hover:text-[#c45500] hover:underline">Your Orders</Link></li>
                                            <li><Link href="#" className="hover:text-[#c45500] hover:underline">Your Wish List</Link></li>
                                            {user && (
                                                <li><button onClick={logout} className="hover:text-[#c45500] hover:underline w-full text-left">Sign Out</button></li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col mx-4 cursor-pointer">
                            <span className="text-xs">Returns</span>
                            <span className="text-sm font-bold">& Orders</span>
                        </div>

                        <div className="flex items-center cursor-pointer">
                            <ShoppingCart className="h-8" />
                            <span className="font-bold text-[#F90] ml-1 mt-3">0</span>
                        </div>
                    </div>

                    {/* Search Mobile*/}
                    <div className="md:hidden p-2 bg-[#232F3E]">
                        <div className="flex bg-white rounded-md h-10 overflow-hidden">
                            <input type="text" className="h-full w-full px-4 text-black focus:outline-none" placeholder="Search Amozun..." />
                            <div className="bg-[#FEBD69] h-full px-4 flex items-center justify-center cursor-pointer">
                                <Search className="h-5 text-gray-900" />
                            </div>
                        </div>
                    </div>
                </div>

            </header>
        </>
    );
};

export default Header;
