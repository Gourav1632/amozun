import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Amozun.in Checkout",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
