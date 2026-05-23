import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Password Assistance",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
