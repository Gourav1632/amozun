'use client'

import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            login(res.data);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center pt-4 px-4">
            {/* Logo */}
            <Link href="/" className="mb-4">
                <span className="text-3xl font-bold tracking-tight text-[#0F1111]">
                    amozun<span className="text-orange-500">.in</span>
                </span>
            </Link>

            {/* Sign in card */}
            <div className="w-full max-w-[350px] border border-[#ddd] rounded-lg p-6 mb-4"
                 style={{ boxShadow: '0 2px 4px 0 rgba(0,0,0,.13)' }}>

                <h1 className="text-[28px] font-normal text-[#0F1111] mb-3">
                    Sign in
                </h1>

                {error && (
                    <div className="flex items-start gap-2 p-3 mb-3 bg-white border border-red-400 rounded-md">
                        <span className="text-red-600 text-sm">⚠</span>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="text-[13px] font-bold text-[#0F1111] block mb-1">
                            Email or mobile phone number
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px]
                                       focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[13px] font-bold text-[#0F1111]">
                                Password
                            </label>
                            <Link href="#" className="text-[13px] text-blue-600 hover:text-orange-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px]
                                       focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-[6px] text-[13px] rounded-lg cursor-pointer border border-[#a88734]
                                   bg-gradient-to-b from-[#f7dea0] to-[#f0c14b]
                                   hover:from-[#f5d78e] hover:to-[#eeb933]
                                   active:from-[#f0c14b] active:to-[#f0c14b]
                                   disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-[12px] text-[#111] mt-4 leading-[1.5]">
                    By continuing, you agree to Amozun&apos;s{' '}
                    <Link href="#" className="text-blue-600 hover:text-orange-500 hover:underline">
                        Conditions of Use
                    </Link>{' '}and{' '}
                    <Link href="#" className="text-blue-600 hover:text-orange-500 hover:underline">
                        Privacy Notice
                    </Link>.
                </p>
            </div>

            {/* Divider + Create account */}
            <div className="w-full max-w-[350px]">
                <div className="relative flex items-center my-3">
                    <div className="flex-grow border-t border-[#e7e7e7]" />
                    <span className="px-2 text-[12px] text-[#767676] bg-white">
                        New to Amozun?
                    </span>
                    <div className="flex-grow border-t border-[#e7e7e7]" />
                </div>
                <Link
                    href="/signup"
                    className="flex items-center justify-center w-full py-[6px] text-[13px] rounded-lg cursor-pointer
                               border border-[#adb1b8] bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec]
                               hover:from-[#e7eaf0] hover:to-[#d9dce1]
                               text-[#0F1111]"
                >
                    Create your Amozun account
                </Link>
            </div>
        </div>
    );
}