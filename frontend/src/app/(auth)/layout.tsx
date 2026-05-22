import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Main content */}
            <div className="flex-grow">
                {children}
            </div>

            {/* Auth mini footer — matches Amazon's sign-in footer */}
            <div className="mt-auto pt-8">
                <div className="border-t border-gray-300 mx-auto max-w-[600px] w-full" />
                <div className="flex justify-center gap-6 py-3 text-[11px] text-blue-600">
                    <Link href="#" className="hover:text-orange-500 hover:underline">
                        Conditions of Use
                    </Link>
                    <Link href="#" className="hover:text-orange-500 hover:underline">
                        Privacy Notice
                    </Link>
                    <Link href="#" className="hover:text-orange-500 hover:underline">
                        Help
                    </Link>
                </div>
                <p className="text-center text-[11px] text-gray-500 pb-4">
                    © 1996–2026, Amozun.com, Inc. or its affiliates
                </p>
            </div>
        </div>
    );
}
