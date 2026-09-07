import { redirect } from "next/navigation";

import { AuthSessionRestorer } from "@/contexts/auth.context";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";

export default async function LayoutPrivate({ children }: { children: React.ReactNode }) {
    try {
        await requireAuth();
    } catch {
        redirect("/login");
    }

    return (
        <div className="w-full h-screen bg-[#F9FAFB]">
            <AuthSessionRestorer />
            {children}
        </div>
    );
}
