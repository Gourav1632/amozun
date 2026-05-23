interface CheckoutProps {
    subtotal: number;
    shippingFee: number;
    total: number;
    selectedCount: number;
    handleCheckout: () => void;
}

const Checkout = ({ subtotal, shippingFee, total, selectedCount, handleCheckout }: CheckoutProps) => {
    return (
        <div className="flex flex-col h-fit bg-white px-5 pt-4 pb-6 mt-0">
            {/* Free Delivery Banner Area */}
            {shippingFee === 0 && (
                <div className="mb-4">
                    <div className="w-full flex items-center mb-1">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#007185] h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <div className="text-green-700 bg-green-50 p-1 rounded">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <span className="text-[#0f1111] font-medium">Your order is eligible for FREE Delivery.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Subtotal */}
            <div className="mb-3">
                <span className="text-lg">
                    Subtotal ({selectedCount} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                </span>
            </div>


            {/* Button */}
            <button
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                className={`${selectedCount === 0
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed border-transparent shadow-none"
                    : "bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] cursor-pointer border-[#fcd200] shadow-sm hover:shadow-md"
                    } w-full py-2 px-4 rounded-full text-sm font-medium transition duration-200 border`}
            >
                Proceed to Buy
            </button>

        </div>
    );
};

export default Checkout;
