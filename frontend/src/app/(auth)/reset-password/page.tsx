'use client'

import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setIsLoading(true);

        try {
            await apiFetch('/auth/send-reset-otp', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setStep(2);
            setSuccess("OTP sent to your email.");
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setError("Please enter a valid OTP");
            return;
        }
        setError(""); setSuccess(""); setIsLoading(true);

        try {
            await apiFetch('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, password, otp })
            });
            setSuccess("Password reset successfully. You can now sign in.");
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center pt-4 px-4">
            <Link href="/" className="mb-4">
                <span className="text-3xl font-bold tracking-tight text-[#0F1111]">
                    amozun<span className="text-orange-500">.in</span>
                </span>
            </Link>

            <div className="w-full max-w-[350px] border border-[#ddd] rounded-lg p-6 mb-4"
                style={{ boxShadow: '0 2px 4px 0 rgba(0,0,0,.13)' }}>

                <h1 className="text-[28px] font-normal text-[#0F1111] mb-3">
                    Password assistance
                </h1>

                {step === 1 && <p className="text-[13px] text-[#0F1111] mb-4">Enter the email address associated with your Amozun account.</p>}

                {error && (
                    <div className="flex items-start gap-2 p-3 mb-3 bg-white border border-red-400 rounded-md">
                        <span className="text-red-600 text-sm">⚠</span>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
                {success && step !== 3 && (
                    <div className="flex items-start gap-2 p-3 mb-3 bg-white border border-green-400 rounded-md">
                        <span className="text-green-600 text-sm">✓</span>
                        <p className="text-sm text-green-700">{success}</p>
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
                                className="w-full border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px]
                                           focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Sending..." : "Continue"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP and New Password */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="text-[13px] font-bold text-[#0F1111] block mb-1">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px]
                                           focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] tracking-widest text-center"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-[13px] font-bold text-[#0F1111] block mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] pr-10
                                               focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)]"
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
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : "Save changes and sign in"}
                        </button>
                    </form>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center">
                        <div className="text-green-600 mb-4 text-4xl">✓</div>
                        <h2 className="text-lg font-bold text-[#0F1111] mb-2">Password changed</h2>
                        <p className="text-[13px] text-[#0F1111] mb-6">
                            Your password has been changed successfully.
                        </p>
                        <Link href="/login" className="w-full flex items-center justify-center bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium">
                            Sign In
                        </Link>
                    </div>
                )}
            </div>

            {step === 1 && (
                <div className="w-full max-w-[350px]">
                    <div className="relative flex items-center my-3">
                        <div className="flex-grow border-t border-[#e7e7e7]" />
                        <span className="px-2 text-[12px] text-[#767676] bg-white">
                            Has your email changed?
                        </span>
                        <div className="flex-grow border-t border-[#e7e7e7]" />
                    </div>
                    <p className="text-[12px] text-[#111] leading-[1.5] text-center">
                        If you no longer use the e-mail address associated with your Amozun account, you may contact <Link href="#" className="text-blue-600 hover:text-orange-500 hover:underline">Customer Service</Link> for help restoring access to your account.
                    </p>
                </div>
            )}
        </div>
    );
}
