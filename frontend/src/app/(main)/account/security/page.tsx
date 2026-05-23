'use client'

import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SecurityPage() {
    const { user, login, logout } = useAuth();
    const router = useRouter();

    const [editing, setEditing] = useState<"name" | "password" | null>(null);
    const [name, setName] = useState(user?.name || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");

    if (!user) {
        return <div className="min-h-screen pt-20 text-center">Loading...</div>;
    }

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setIsLoading(true);
        try {
            const res = await apiFetch('/auth/update-name', {
                method: 'PUT',
                body: JSON.stringify({ name })
            });
            login(res.data);
            setSuccess("Name updated successfully.");
            setEditing(null);
        } catch (err: any) {
            setError(err.message || 'Failed to update name');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setIsLoading(true);
        try {
            await apiFetch('/auth/update-password', {
                method: 'PUT',
                body: JSON.stringify({ oldPassword, newPassword })
            });
            setSuccess("Password updated successfully.");
            setEditing(null);
            setOldPassword("");
            setNewPassword("");
        } catch (err: any) {
            setError(err.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccountClick = () => {
        setDeleteInput("");
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteAccount = async () => {
        if (deleteInput.toLowerCase() !== "delete") {
            setError("Please type 'delete' to confirm.");
            return;
        }

        setError(""); setSuccess(""); setIsLoading(true);
        try {
            await apiFetch('/auth/account', {
                method: 'DELETE'
            });
            setIsDeleteModalOpen(false);
            logout();
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to delete account');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <main className="max-w-[1000px] mx-auto bg-white p-6 sm:p-10 shadow-sm">

                <h1 className="text-[28px] leading-8 font-medium text-[#0f1111] mb-6">Login & security</h1>

                {error && (
                    <div className="flex items-start gap-2 p-3 mb-4 bg-white border border-red-400 rounded-md">
                        <span className="text-red-600 text-sm">⚠</span>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="flex items-start gap-2 p-3 mb-4 bg-white border border-green-400 rounded-md">
                        <span className="text-green-600 text-sm">✓</span>
                        <p className="text-sm text-green-700">{success}</p>
                    </div>
                )}

                <div className="border border-[#D5D9D9] rounded-[8px]">

                    {/* Name Section */}
                    <div className="p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#D5D9D9]">
                        {editing === "name" ? (
                            <form onSubmit={handleUpdateName} className="w-full">
                                <label className="block text-[13px] font-bold mb-1 text-[#0F1111]">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full md:w-[300px] border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] mb-3 block"
                                    required
                                />
                                <div className="flex gap-2">
                                    <button type="submit" disabled={isLoading} className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-1.5 px-4 shadow-sm text-[13px] font-medium disabled:opacity-70 text-[#0F1111]">
                                        {isLoading ? "Saving..." : "Save changes"}
                                    </button>
                                    <button type="button" onClick={() => { setEditing(null); setName(user.name); }} className="bg-white hover:bg-[#f7fafa] border border-[#D5D9D9] rounded-lg py-1.5 px-4 shadow-sm text-[13px] text-[#0F1111]">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div>
                                    <div className="font-bold text-[13px] text-[#0F1111]">Name:</div>
                                    <div className="text-[13px] text-[#0F1111]">{user.name}</div>
                                </div>
                                <button onClick={() => { setEditing("name"); setName(user.name); }} className="mt-3 md:mt-0 bg-white hover:bg-[#f7fafa] border border-[#D5D9D9] rounded-lg py-[5px] px-[14px] shadow-sm text-[13px] text-[#0F1111]">
                                    Edit
                                </button>
                            </>
                        )}
                    </div>

                    {/* Email Section */}
                    <div className="p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#D5D9D9]">
                        <div>
                            <div className="font-bold text-[13px] text-[#0F1111]">Email:</div>
                            <div className="text-[13px] text-[#0F1111]">{user.email}</div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#D5D9D9]">
                        {editing === "password" ? (
                            <form onSubmit={handleUpdatePassword} className="w-full">
                                <label className="block text-[13px] font-bold mb-1 text-[#0F1111]">Current Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full md:w-[300px] border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] mb-3 block"
                                    required
                                />
                                <label className="block text-[13px] font-bold mb-1 text-[#0F1111]">New Password</label>
                                <div className="relative mb-4 w-full md:w-[300px]">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] pr-10"
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
                                <div className="flex gap-2">
                                    <button type="submit" disabled={isLoading} className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-1.5 px-4 shadow-sm text-[13px] font-medium disabled:opacity-70 text-[#0F1111]">
                                        {isLoading ? "Saving..." : "Save changes"}
                                    </button>
                                    <button type="button" onClick={() => setEditing(null)} className="bg-white hover:bg-[#f7fafa] border border-[#D5D9D9] rounded-lg py-1.5 px-4 shadow-sm text-[13px] text-[#0F1111]">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div>
                                    <div className="font-bold text-[13px] text-[#0F1111]">Password:</div>
                                    <div className="text-[13px] text-[#0F1111]">********</div>
                                </div>
                                <button onClick={() => setEditing("password")} className="mt-3 md:mt-0 bg-white hover:bg-[#f7fafa] border border-[#D5D9D9] rounded-lg py-[5px] px-[14px] shadow-sm text-[13px] text-[#0F1111]">
                                    Edit
                                </button>
                            </>
                        )}
                    </div>

                    {/* Delete Account Section */}
                    <div className="p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <div className="font-bold text-[13px] text-[#0F1111]">Account Data:</div>
                            <div className="text-[13px] text-[#565959]">Permanently close your Amozun account and delete your data</div>
                        </div>
                        <button
                            onClick={handleDeleteAccountClick}
                            disabled={isLoading}
                            className="mt-3 md:mt-0 bg-white hover:bg-red-50 border border-[#D5D9D9] rounded-lg py-[5px] px-[14px] shadow-sm text-[13px] text-red-700 font-medium disabled:opacity-70 transition-colors"
                        >
                            {isLoading ? "Processing..." : "Close Account"}
                        </button>
                    </div>

                </div>
            </main>

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 transition-opacity"
                        onClick={() => setIsDeleteModalOpen(false)}
                    ></div>

                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[375px] overflow-hidden flex flex-col z-10 animate-fade-in-up">
                        <div className="bg-[#f0f2f2] border-b border-[#d5d9d9] px-6 py-4 flex justify-between items-center rounded-t-lg">
                            <h4 className="font-bold text-[15px] text-[#0f1111]">Confirm Account Deletion</h4>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-gray-500 hover:text-black cursor-pointer"
                                aria-label="Close"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-[13px] text-[#565959] leading-snug mb-4">
                                This action is permanent and cannot be undone. To confirm, please type <strong>delete</strong> below.
                            </p>

                            <input
                                type="text"
                                value={deleteInput}
                                onChange={(e) => setDeleteInput(e.target.value)}
                                placeholder="Type 'delete'"
                                className="w-full border border-[#a6a6a6] rounded-[3px] px-[7px] py-[3px] text-[13px] h-[31px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] mb-4 block"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 bg-white hover:bg-[#f7fafa] border border-[#D5D9D9] rounded-lg py-2 shadow-sm text-[13px] text-[#0F1111]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteAccount}
                                    disabled={deleteInput.toLowerCase() !== "delete" || isLoading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 shadow-sm text-[13px] font-medium disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? "Deleting..." : "Delete Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
