'use client';

import { Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col w-full mx-auto">
            <button onClick={scrollToTop} className="w-full outline-none">
                <div className="flex bg-[#37475a] hover:bg-[#485769] justify-center transition-colors">
                    <p className="text-white text-xs py-4 font-medium">Back to top</p>
                </div>
            </button>

            <div className="flex max-md:flex-col items-center bg-[#131A22] justify-center py-6">
                <Link href="/" className="flex items-center justify-center">
                    <Image src="/images/logo.png" alt="Amozun Logo" width={100} height={30} className="object-contain opacity-80 hover:opacity-100 transition-opacity" style={{ width: 'auto', height: 'auto' }} />
                </Link>
            </div>

            <div className="flex flex-col pt-0 py-8 bg-[#131A22] items-center">
                <div className="flex flex-col items-center">
                    <ul className="flex whitespace-nowrap max-md:flex-col items-center text-xs text-slate-300 space-x-4 max-md:space-y-2">
                        <li className="hover:underline">
                            <Link href="">Conditions of Use</Link>
                        </li>
                        <li className="hover:underline">
                            <Link href="">Privacy Notice</Link>
                        </li>
                        <li className="hover:underline">
                            <Link href="">Your Ads Privacy Choices</Link>
                        </li>
                    </ul>
                    <h6 className="text-xs text-slate-300 mt-2">
                        © 2024, Amozun.com, Inc. or its affiliates
                    </h6>
                </div>
            </div>

        </div>
    );
}

export default Footer;