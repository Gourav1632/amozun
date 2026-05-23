import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Amozun Registration",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
