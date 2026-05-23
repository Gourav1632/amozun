import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { DeliveryProvider } from "@/context/DeliveryContext";

export const metadata: Metadata = {
  title: "Amozun - Spend less. Smile more.",
  description: "A clone of the world's largest online retailer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <DeliveryProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
              </WishlistProvider>
            </CartProvider>
          </DeliveryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
