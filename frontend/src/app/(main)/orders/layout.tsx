import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Orders",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
