import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Recently Viewed Items",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
