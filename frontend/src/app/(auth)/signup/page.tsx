'use client'

import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();
    
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{ email?: string, otp?: string, name?: string, password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setFieldErrors(prev => ({ ...prev, email: "Enter a valid email address" }));
            return;
        }
        setFieldErrors(prev => ({ ...prev, email: undefined }));
        setError("");
        setIsLoading(true);

        try {
            await apiFetch('/auth/send-signup-otp', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !/^\d{6}$/.test(otp)) {
            setFieldErrors(prev => ({ ...prev, otp: "Please enter a valid 6-digit OTP" }));
            return;
        }
        setFieldErrors(prev => ({ ...prev, otp: undefined }));
        setError("");
        setStep(3);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let isValid = true;
        let errors: any = {};
        
        if (!name || name.trim().length < 2) {
            errors.name = "Enter your first and last name";
            isValid = false;
        }
        if (!password || password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            errors.password = "Passwords must be at least 6 characters and contain letters and numbers";
            isValid = false;
        }
        
        setFieldErrors(prev => ({ ...prev, name: errors.name, password: errors.password }));
        if (!isValid) return;

        setError("");
        setIsLoading(true);

        try {
            const res = await apiFetch('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, otp })
            });

            router.push('/login');
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

            {/* Sign up card */}
            <div className="w-full max-w-[350px] border border-[#ddd] rounded-lg p-6 mb-4"
                 style={{ boxShadow: '0 2px 4px 0 rgba(0,0,0,.13)' }}>

                <h1 className="text-[28px] font-normal text-[#0F1111] mb-3">
                    Create Account
                </h1>

                {error && (
                    <div className="flex items-start gap-2 p-3 mb-3 bg-white border border-red-400 rounded-md">
                        <span className="text-red-600 text-sm">⚠</span>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Step 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-4">
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Sending OTP..." : "Verify email"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-2">
                            <p className="text-[13px] text-[#0F1111] mb-2">
                                To verify your email, we&apos;ve sent a One Time Password (OTP) to <span className="font-bold">{email}</span> <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setStep(1)}>(Change)</span>
                            </p>
                            <label className="text-[13px] font-bold text-[#0F1111] block mb-1">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className={`w-full border ${fieldErrors.otp ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]'} rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] focus:outline-none tracking-widest text-center`}
                                required
                                autoFocus
                            />
                            {fieldErrors.otp && (
                                <p className="text-[#c40000] text-[12px] mt-1 flex items-start gap-1">
                                    <span className="text-[14px]">!</span> {fieldErrors.otp}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium mt-4 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </form>
                )}

                {/* Step 3: Name & Password */}
                {step === 3 && (
                    <form onSubmit={handleSignup}>
                        <div className="mb-3">
                            <label className="text-[13px] font-bold text-[#0F1111] block mb-1">
                                Your name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="First and last name"
                                className={`w-full border ${fieldErrors.name ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]'} rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] focus:outline-none`}
                                required
                                autoFocus
                            />
                            {fieldErrors.name && (
                                <p className="text-[#c40000] text-[12px] mt-1 flex items-start gap-1">
                                    <span className="text-[14px]">!</span> {fieldErrors.name}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-[13px] font-bold text-[#0F1111] block mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className={`w-full border ${fieldErrors.password ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-[#a6a6a6] focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]'} rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] pr-10 focus:outline-none`}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {fieldErrors.password ? (
                                <p className="text-[#c40000] text-[12px] mt-1 flex items-start gap-1 leading-tight">
                                    <span className="text-[14px]">!</span> {fieldErrors.password}
                                </p>
                            ) : (
                                <p className="text-[11px] text-[#0F1111] mt-1 flex items-center gap-1">
                                    <span className="text-blue-600 italic">i</span> Passwords must be at least 6 characters.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating account..." : "Verify and Create account"}
                        </button>
                    </form>
                )}

                <p className="text-[12px] text-[#111] leading-[1.5]">
                    By creating an account, you agree to Amozun&apos;s{' '}
                    <Link href="#" className="text-blue-600 hover:text-orange-500 hover:underline">
                        Conditions of Use
                    </Link>{' '}and{' '}
                    <Link href="#" className="text-blue-600 hover:text-orange-500 hover:underline">
                        Privacy Notice
                    </Link>.
                </p>

                {/* Login link */}
                <div className="mt-4 pt-4 border-t border-[#e7e7e7]">
                    <div className="text-[13px] text-[#0F1111]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-orange-500 hover:underline flex items-center inline-flex">
                            Sign in <span className="ml-1">▶</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
