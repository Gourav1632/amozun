import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Amozun.in Shopping Cart",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
