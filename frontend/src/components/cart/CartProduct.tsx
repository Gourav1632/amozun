import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartProductProps {
    item: any;
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
}

const CartProduct = ({ item, selectedIds, setSelectedIds }: CartProductProps) => {
    const { updateQuantity, removeFromCart } = useCart();
    const [active, setActive] = useState(false);

    useEffect(() => {
        const check = selectedIds.includes(item.cart_item_id);
        setActive(check);
    }, [selectedIds, item.cart_item_id]);

    const handleSelect = () => {
        if (active) {
            setSelectedIds(selectedIds.filter((id: string) => id !== item.cart_item_id));
        } else {
            setSelectedIds([...selectedIds, item.cart_item_id]);
        }
    };

    const updateQty = (type: "plus" | "minus") => {
        const newQty = type === "plus" ? item.quantity + 1 : item.quantity - 1;
        if (newQty >= 1 && newQty <= item.stock) {
            updateQuantity(item.cart_item_id, newQty);
        }
    };

    const handleDelete = () => {
        removeFromCart(item.cart_item_id);
        setSelectedIds(selectedIds.filter((id: string) => id !== item.cart_item_id));
    };

    // Helper to format price with small decimal part
    const formatPrice = (price: number) => {
        const parts = Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.');
        return (
            <span>
                <span className="text-sm font-normal relative -top-[0.25em]">₹</span>
                <span className="text-lg">{parts[0]}</span>
                <span className="text-sm font-normal relative -top-[0.25em]">.{parts[1]}</span>
            </span>
        );
    };

    return (
        <div className="flex flex-col sm:flex-row py-4 border-b border-[#dddddd] last:border-none w-full">
            {/* Left Column: Checkbox & Image */}
            <div className="flex flex-shrink-0">
                <div className="mr-2 mt-1 flex-shrink-0 w-[20px]">
                    <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer rounded border-gray-400 focus:ring-transparent accent-[#007185]"
                        onChange={handleSelect}
                        checked={active}
                    />
                </div>
                <div className="relative w-[180px] h-[180px] flex-shrink-0 ml-1">
                    <Image
                        src={item.image_url || "/placeholder.png"}
                        fill
                        className="object-contain"
                        alt={item.name}
                        sizes="180px"
                    />
                </div>
            </div>

            {/* Right Column: Content Group */}
            <div className="flex flex-col flex-grow sm:pl-4 mt-2 sm:mt-0 max-w-full">

                {/* Desktop layout: Price floats right */}
                <div className="block w-full">

                    {/* Price Block (floats right on desktop, static on mobile) */}
                    <div className="sm:float-right sm:text-right sm:w-[120px] mb-2 sm:mb-0 sm:ml-4">
                        <div className="font-bold text-[#0f1111]">
                            {formatPrice(item.price * item.quantity)}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-base font-medium mb-1 break-words pr-2">
                        <Link href={`/product/${item.product_id}`} className="text-[#0f1111] hover:text-[#c45500] hover:underline line-clamp-2 leading-tight">
                            {item.name}
                        </Link>
                    </div>

                    {/* Stock */}
                    {item.stock > 0 ? (
                        <div className="text-xs text-[#007600] mb-1 font-medium">In stock</div>
                    ) : (
                        <div className="text-xs text-[#B12704] mb-1 font-medium">Out of stock</div>
                    )}

                    {/* Free Delivery */}
                    <div className="text-xs text-[#0f1111] mb-1">
                        Eligible for FREE Shipping
                    </div>

                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center mt-2 text-xs text-[#007185] clear-both">

                    {/* Quantity Stepper (Pill shaped) */}
                    <div className="flex items-center bg-white border border-[#d5d9d9] rounded-full shadow-sm mr-4 h-8 overflow-hidden">
                        <button
                            onClick={item.quantity > 1 ? () => updateQty("minus") : handleDelete}
                            className="px-3 h-full hover:bg-[#f0f2f2] flex items-center justify-center transition-colors border-r border-[#d5d9d9]"
                        >
                            {item.quantity === 1 ? (
                                <Trash2 className="w-3.5 h-3.5 text-[#0f1111]" />
                            ) : (
                                <Minus className="w-3.5 h-3.5 text-[#0f1111]" />
                            )}
                        </button>
                        <div className="px-3 text-sm font-medium text-[#0f1111] flex items-center justify-center min-w-[32px]">
                            {item.quantity}
                        </div>
                        <button
                            onClick={() => updateQty("plus")}
                            disabled={item.quantity >= item.stock}
                            className="px-3 h-full hover:bg-[#f0f2f2] flex items-center justify-center transition-colors border-l border-[#d5d9d9] disabled:opacity-50 disabled:bg-[#f0f2f2]"
                        >
                            <Plus className="w-3.5 h-3.5 text-[#0f1111]" />
                        </button>
                    </div>

                    {/* Text Links */}
                    <div className="flex flex-wrap items-center gap-y-2 mt-2 sm:mt-0 border-l-0 sm:border-l sm:border-[#dddddd] pl-0 sm:pl-3">
                        <button onClick={handleDelete} className="hover:underline whitespace-nowrap hidden sm:block">Delete</button>
                    </div>
                </div>

                {item.stock < item.quantity && (
                    <div className="text-[#B12704] text-xs mt-2">
                        Only {item.stock} left in stock.
                    </div>
                )}
            </div>
        </div >
    );
};

export default CartProduct;
