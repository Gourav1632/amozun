import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: 'Your Account',
    description: 'Manage your Amozun account, orders, and addresses',
};

export default function AccountPage() {
    return (
        <div className="min-h-screen bg-[#eaeded] py-6 px-4">
            <main className="max-w-[1000px] mx-auto bg-white p-6 sm:p-10 shadow-sm">
                <h1 className="text-[28px] leading-8 font-medium text-[#0f1111] mb-6">Your Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Your Orders */}
                    <Link href="/orders" className="group border border-gray-300 rounded-[8px] p-4 flex hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/Box._CB485927553_.png"
                                alt="Your Orders"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-[#0F1111] font-normal group-hover:text-[#c45500] transition-colors leading-tight mb-1">
                                Your Orders
                            </h2>
                            <span className="text-sm text-[#565959] leading-snug">
                                Track, return, or buy things again
                            </span>
                        </div>
                    </Link>

                    {/* Login & Security */}
                    <Link href="/account/security" className="group border border-gray-300 rounded-[8px] p-4 flex hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/sign-in-lock._CB485931504_.png"
                                alt="Login & security"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-[#0F1111] font-normal group-hover:text-[#c45500] transition-colors leading-tight mb-1">
                                Login & security
                            </h2>
                            <span className="text-sm text-[#565959] leading-snug">
                                Edit login, name, and password
                            </span>
                        </div>
                    </Link>

                    {/* Your Addresses */}
                    <Link href="/account/addresses" className="group border border-gray-300 rounded-[8px] p-4 flex hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/address-map-pin._CB485934183_.png"
                                alt="Your Addresses"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-[#0F1111] font-normal group-hover:text-[#c45500] transition-colors leading-tight mb-1">
                                Your Addresses
                            </h2>
                            <span className="text-sm text-[#565959] leading-snug">
                                Edit addresses for orders and gifts
                            </span>
                        </div>
                    </Link>

                    {/* Prime */}
                    <div className="border border-gray-200 rounded-[8px] p-4 flex opacity-50 cursor-not-allowed bg-gray-50">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/rc_prime._CB485926807_.png"
                                alt="Prime"
                                className="w-full h-full object-contain grayscale"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-gray-500 font-normal leading-tight mb-1">
                                Prime
                            </h2>
                            <span className="text-sm text-gray-400 leading-snug">
                                View benefits and payment settings
                            </span>
                        </div>
                    </div>

                    {/* Your business account */}
                    <div className="border border-gray-200 rounded-[8px] p-4 flex opacity-50 cursor-not-allowed bg-gray-50">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/AmazonBusiness/YAPATF/amazon_business_yap_atf._CB588250268_.jpg"
                                alt="Your business account"
                                className="w-full h-full object-contain grayscale"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-gray-500 font-normal leading-tight mb-1">
                                Your business account
                            </h2>
                            <span className="text-sm text-gray-400 leading-snug">
                                Sign up for free to save up to 18% with GST invoice
                            </span>
                        </div>
                    </div>

                    {/* Payment options */}
                    <div className="border border-gray-200 rounded-[8px] p-4 flex opacity-50 cursor-not-allowed bg-gray-50">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/Payments._CB485926359_.png"
                                alt="Payment options"
                                className="w-full h-full object-contain grayscale"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-gray-500 font-normal leading-tight mb-1">
                                Payment options
                            </h2>
                            <span className="text-sm text-gray-400 leading-snug">
                                Edit or add payment methods
                            </span>
                        </div>
                    </div>

                    {/* Amazon Pay balance */}
                    <div className="border border-gray-200 rounded-[8px] p-4 flex opacity-50 cursor-not-allowed bg-gray-50">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/amazon_pay._CB485946857_.png"
                                alt="Amazon Pay balance"
                                className="w-full h-full object-contain grayscale"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-gray-500 font-normal leading-tight mb-1">
                                Amazon Pay balance
                            </h2>
                            <span className="text-sm text-gray-400 leading-snug">
                                Add money to your balance
                            </span>
                        </div>
                    </div>

                    {/* Contact Us */}
                    <div className="border border-gray-200 rounded-[8px] p-4 flex opacity-50 cursor-not-allowed bg-gray-50">
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative mr-3">
                            <img
                                src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/self-service/contact_us._CB623781998_.png"
                                alt="Contact Us"
                                className="w-full h-full object-contain grayscale"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[17px] text-gray-500 font-normal leading-tight mb-1">
                                Contact Us
                            </h2>
                            <span className="text-sm text-gray-400 leading-snug">
                                Contact our customer service via phone or chat
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
