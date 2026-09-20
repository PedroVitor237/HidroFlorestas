import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";

export default async function LayoutPrivate({ children }: { children: React.ReactNode }) {
    const principal = await requireAuth();
    return (
        <div className="w-full h-screen bg-[#F9FAFB] flex flex-col overflow-hidden">
            <TopBar showProfile />
            
            <div className='flex flex-1 min-h-0'>
                <Sidebar canAdmin={principal.role === "ADMIN"} />
                <div className='overflow-y-auto h-full w-full md:p-10 p-3'>
                    {children}

                    <div className='h-30 flex md:hidden'></div>
                </div>
            </div>
        </div>
    )
}
