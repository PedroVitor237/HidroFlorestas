'use client';

import Sidebar from "@/components/sidebar";
import TopBar from "@/components/top-bar";

export default function LayoutPrivate({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen bg-[#F9FAFB] flex flex-col overflow-hidden">
            <TopBar showProfile />
            
            <div className='flex flex-1 min-h-0'>
                <Sidebar />
                <div className='overflow-y-auto h-full w-full md:p-10 p-3'>
                    {children}

                    <div className='h-30 flex md:hidden'></div>
                </div>
            </div>
        </div>
    )
}