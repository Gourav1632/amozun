'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';

interface Address {
    id: string;
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    is_default: boolean;
}

interface DeliveryContextType {
    selectedAddress: Address | null;
    setSelectedAddress: (address: Address | null) => void;
    isLoading: boolean;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [selectedAddress, setAddressState] = useState<Address | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setSelectedAddress = (address: Address | null) => {
        setAddressState(address);
        if (address) {
            localStorage.setItem('delivery_address', JSON.stringify(address));
        } else {
            localStorage.removeItem('delivery_address');
        }
    };

    useEffect(() => {
        // First try to load from local storage for instant render
        const stored = localStorage.getItem('delivery_address');
        if (stored) {
            try {
                setAddressState(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored address", e);
            }
        }

        // Then, if user is logged in, fetch latest addresses to ensure accuracy
        if (user) {
            setIsLoading(true);
            apiFetch('/addresses')
                .then(res => {
                    if (res.status === 'success' && res.data.length > 0) {
                        const addresses = res.data;
                        
                        // If we have a stored address, check if it still exists
                        if (stored) {
                            try {
                                const parsed = JSON.parse(stored);
                                const exists = addresses.find((a: Address) => a.id === parsed.id);
                                if (exists) {
                                    // Update with latest data
                                    setSelectedAddress(exists);
                                    return;
                                }
                            } catch (e) {}
                        }

                        // Otherwise use default or first
                        const defaultAddr = addresses.find((a: Address) => a.is_default) || addresses[0];
                        setSelectedAddress(defaultAddr);
                    } else if (res.status === 'success' && res.data.length === 0) {
                        setSelectedAddress(null);
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
            if (!stored) {
                setSelectedAddress(null);
            }
        }
    }, [user]);

    return (
        <DeliveryContext.Provider value={{ selectedAddress, setSelectedAddress, isLoading }}>
            {children}
        </DeliveryContext.Provider>
    );
};

export const useDelivery = () => {
    const context = useContext(DeliveryContext);
    if (context === undefined) {
        throw new Error('useDelivery must be used within a DeliveryProvider');
    }
    return context;
};
