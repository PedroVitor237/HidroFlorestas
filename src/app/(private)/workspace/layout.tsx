'use client';

import TopBar from "@/components/top-bar";

export default function LayoutPrivate({ children }: { children: React.ReactNode }) {

    return (
        <div className="w-full h-screen bg-[#F9FAFB]">
            <TopBar showLinks showProfile showLogout />
            {children}
        </div>
    )
}