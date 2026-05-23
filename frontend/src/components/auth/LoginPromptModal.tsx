'use client'

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPromptModal() {
    const { user, showLoginModal, setShowLoginModal } = useAuth();

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowLoginModal(false);
        };
        if (showLoginModal) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showLoginModal, setShowLoginModal]);

    if (!showLoginModal || user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={() => setShowLoginModal(false)}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[375px] overflow-hidden flex flex-col z-10 animate-fade-in-up">

                {/* Header */}
                <div className="bg-[#f0f2f2] border-b border-[#d5d9d9] px-6 py-4 flex justify-between items-center rounded-t-lg">
                    <h4 className="font-bold text-[15px] text-[#0f1111]">Sign in required</h4>
                    <button
                        onClick={() => setShowLoginModal(false)}
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
                    <p className="text-[14px] text-[#565959] leading-snug mb-5">
                        Please sign in to your Amozun account to continue.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link href="/login" onClick={() => setShowLoginModal(false)}>
                            <button className="w-full bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] rounded-lg py-2 text-[14px] shadow-sm text-[#0f1111] font-medium">
                                Sign in
                            </button>
                        </Link>

                        <div className="flex items-center my-1">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink-0 mx-2 text-[12px] text-gray-500">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <button 
                            className="w-full bg-white border border-[#d5d9d9] rounded-lg py-2 text-[14px] hover:bg-gray-50 shadow-sm text-[#0f1111]"
                            onClick={() => setShowLoginModal(false)}
                        >
                            Continue browsing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
