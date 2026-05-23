'use client'

import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AddressesPage() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        full_name?: string;
        phone?: string;
        address_line1?: string;
        city?: string;
        state?: string;
        zip_code?: string;
    }>({});
    const [newAddress, setNewAddress] = useState({
        full_name: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        phone: "",
        is_default: false
    });

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const res = await apiFetch('/addresses');
            if (res.status === 'success') {
                setAddresses(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
        if (user) {
            setNewAddress(prev => ({ ...prev, full_name: user.name }));
        }
    }, [user]);

    const handleRemove = async (id: string) => {
        try {
            await apiFetch(`/addresses/${id}`, { method: 'DELETE' });
            fetchAddresses();
        } catch (error) {
            console.error("Failed to remove address:", error);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await apiFetch(`/addresses/${id}/default`, { method: 'PUT' });
            fetchAddresses();
        } catch (error) {
            console.error("Failed to set default address.");
        }
    };

    const handleEdit = (addr: any) => {
        setNewAddress({
            full_name: addr.full_name,
            address_line1: addr.address_line1,
            address_line2: addr.address_line2 || "",
            city: addr.city,
            state: addr.state,
            zip_code: addr.zip_code,
            phone: addr.phone,
            is_default: addr.is_default
        });
        setEditingId(addr.id);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setNewAddress({
            full_name: user?.name || "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            zip_code: "",
            phone: "",
            is_default: false
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let isValid = true;
        let errors: any = {};

        if (!newAddress.full_name || newAddress.full_name.trim().length < 2) {
            errors.full_name = "Enter a valid full name";
            isValid = false;
        }
        if (!newAddress.phone || !/^\d{10}$/.test(newAddress.phone)) {
            errors.phone = "Enter a valid 10-digit mobile number";
            isValid = false;
        }
        if (!newAddress.address_line1 || newAddress.address_line1.trim().length < 5) {
            errors.address_line1 = "Enter a valid address";
            isValid = false;
        }
        if (!newAddress.city || newAddress.city.trim().length < 2) {
            errors.city = "Enter a valid city";
            isValid = false;
        }
        if (!newAddress.state || newAddress.state.trim().length < 2) {
            errors.state = "Enter a valid state";
            isValid = false;
        }
        if (!newAddress.zip_code || !/^\d{6}$/.test(newAddress.zip_code)) {
            errors.zip_code = "Enter a valid 6-digit Pincode";
            isValid = false;
        }

        setFieldErrors(errors);
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            if (editingId) {
                await apiFetch(`/addresses/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(newAddress)
                });
            } else {
                await apiFetch('/addresses', {
                    method: 'POST',
                    body: JSON.stringify(newAddress)
                });
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchAddresses();
        } catch (error: any) {
            console.error(error.message || "Failed to save address");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <main className="max-w-[1000px] mx-auto bg-white p-6 sm:p-10 shadow-sm mb-20">

                <h1 className="text-[28px] leading-8 font-medium mb-6 text-[#0f1111]">Your Addresses</h1>

                {isLoading ? (
                    <div className="py-10 text-center">Loading addresses...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Add Address Card */}
                        <div
                            onClick={openAddModal}
                            className="border-2 border-dashed border-[#D5D9D9] rounded-[8px] p-6 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-gray-50 group transition-colors"
                        >
                            <div className="w-12 h-12 mb-2 text-[#D5D9D9] group-hover:text-gray-400">
                                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#565959] group-hover:text-gray-700">Add address</h2>
                        </div>

                        {/* Saved Addresses Cards */}
                        {addresses.map(addr => (
                            <div key={addr.id} className="border border-[#D5D9D9] rounded-[8px] p-4 flex flex-col relative min-h-[250px]">
                                {addr.is_default && (
                                    <div className="absolute top-0 left-0 w-full text-xs font-bold text-gray-500 bg-gray-100 border-b border-[#D5D9D9] p-2 rounded-t-[8px]">
                                        Default
                                    </div>
                                )}
                                <div className={`flex-1 ${addr.is_default ? 'mt-8' : ''}`}>
                                    <h3 className="font-bold text-[15px] mb-1">{addr.full_name}</h3>
                                    <div className="text-[14px] text-[#0F1111] leading-relaxed">
                                        <p>{addr.address_line1}</p>
                                        {addr.address_line2 && <p>{addr.address_line2}</p>}
                                        <p>{addr.city}, {addr.state} {addr.zip_code}</p>
                                        <p>India</p>
                                        <p className="mt-2">Phone number: {addr.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#D5D9D9] text-sm text-[#007185]">
                                    <button onClick={() => handleEdit(addr)} className="hover:underline hover:text-[#c45500]">Edit</button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={() => handleRemove(addr.id)} className="hover:underline hover:text-[#c45500]">Remove</button>
                                    {!addr.is_default && (
                                        <>
                                            <span className="text-gray-300">|</span>
                                            <button onClick={() => handleSetDefault(addr.id)} className="hover:underline hover:text-[#c45500]">Set as Default</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                )}

                {/* Add Address Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 " onClick={() => setIsModalOpen(false)}>
                        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-100 rounded-t-lg">
                                <h2 className="font-bold text-lg">{editingId ? "Edit address" : "Add a new address"}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Full name (First and Last name)</label>
                                    <input required type="text" value={newAddress.full_name} onChange={e => setNewAddress({ ...newAddress, full_name: e.target.value })} className={`w-full border ${fieldErrors.full_name ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-gray-400 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded p-2 focus:outline-none`} />
                                    {fieldErrors.full_name && <p className="text-[#c40000] text-[12px] mt-1"><span className="text-[14px]">!</span> {fieldErrors.full_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Mobile number</label>
                                    <input required type="tel" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className={`w-full border ${fieldErrors.phone ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-gray-400 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded p-2 focus:outline-none`} />
                                    {fieldErrors.phone && <p className="text-[#c40000] text-[12px] mt-1"><span className="text-[14px]">!</span> {fieldErrors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Flat, House no., Building, Company, Apartment</label>
                                    <input required type="text" value={newAddress.address_line1} onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })} className={`w-full border ${fieldErrors.address_line1 ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-gray-400 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded p-2 focus:outline-none`} />
                                    {fieldErrors.address_line1 && <p className="text-[#c40000] text-[12px] mt-1"><span className="text-[14px]">!</span> {fieldErrors.address_line1}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Area, Street, Sector, Village (Optional)</label>
                                    <input type="text" value={newAddress.address_line2} onChange={e => setNewAddress({ ...newAddress, address_line2: e.target.value })} className="w-full border border-gray-400 rounded p-2 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Town/City</label>
                                        <input required type="text" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className={`w-full border ${fieldErrors.city ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-gray-400 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded p-2 focus:outline-none`} />
                                        {fieldErrors.city && <p className="text-[#c40000] text-[12px] mt-1"><span className="text-[14px]">!</span> {fieldErrors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">State</label>
                                        <input required type="text" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className={`w-full border ${fieldErrors.state ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-gray-400 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded p-2 focus:outline-none`} />
                                        {fieldErrors.state && <p className="text-[#c40000] text-[12px] mt-1"><span className="text-[14px]">!</span> {fieldErrors.state}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Pincode</label>
                                    <input required type="text" value={newAddress.zip_code} onChange={e => setNewAddress({ ...newAddress, zip_code: e.target.value })} className={`w-full border ${fieldErrors.zip_code ? 'border-red-600 focus:border-red-600 focus:shadow-[0_0_3px_2px_rgba(220,38,38,.5)]' : 'border-gray-400 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]'} rounded p-2 focus:outline-none`} />
                                    {fieldErrors.zip_code && <p className="text-[#c40000] text-[12px] mt-1"><span className="text-[14px]">!</span> {fieldErrors.zip_code}</p>}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <input type="checkbox" id="isDefault" checked={newAddress.is_default} onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })} className="h-4 w-4 text-[#e77600] focus:ring-[#e77600] rounded" />
                                    <label htmlFor="isDefault" className="text-sm">Make this my default address</label>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="mt-4 w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg py-2 shadow-sm text-sm font-medium disabled:opacity-70">
                                    {isSubmitting ? "Saving..." : (editingId ? "Save changes" : "Add address")}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
