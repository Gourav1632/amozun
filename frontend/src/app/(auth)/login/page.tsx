'use client'

import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ email?: string, password?: string }>({});
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let isValid = true;
        let errors: any = {};

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = "Enter a valid email address";
            isValid = false;
        }
        if (!password) {
            errors.password = "Enter your password";
            isValid = false;
        }

        setFieldErrors(errors);
        if (!isValid) return;

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
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full border ${fieldErrors.email ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]'} rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] focus:outline-none`}
                            required
                            autoFocus
                        />
                        {fieldErrors.email && (
                            <p className="text-[#c40000] text-[12px] mt-1 flex items-start gap-1">
                                <span className="text-[14px]">!</span> {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[13px] font-bold text-[#0F1111]">
                                Password
                            </label>
                            <Link href="/reset-password" className="text-[13px] text-blue-600 hover:text-orange-500 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                className={`w-full border ${fieldErrors.password ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]'} rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] pr-10 focus:outline-none`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <p className="text-[#c40000] text-[12px] mt-1 flex items-start gap-1">
                                <span className="text-[14px]">!</span> {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium mt-2 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    className="flex items-center justify-center w-full bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-lg py-2 text-sm font-medium text-[#0F1111]"
                >
                    Create your Amozun account
                </Link>
            </div>
        </div>
    );
}