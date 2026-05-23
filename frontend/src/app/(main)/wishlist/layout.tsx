import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Amozun.in Wish List",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
