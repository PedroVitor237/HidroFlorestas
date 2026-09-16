"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HouseIcon, MapPinIcon, PowerIcon } from "lucide-react";
export default function Sidebar(){
 const pathname=usePathname();const laboratoryId=pathname.match(/^\/dashboard\/laboratories\/([^/]+)/)?.[1];
 const links=[{title:"Laboratórios",href:"/workspace",Icon:HouseIcon},{title:"Áreas",href:laboratoryId?`/dashboard/laboratories/${laboratoryId}/areas`:"/workspace",Icon:MapPinIcon},{title:"Sair",href:"/logout",Icon:PowerIcon}];
 return <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-gray-200 bg-white p-2 md:static md:h-full md:w-28 md:shrink-0 md:flex-col md:justify-start md:gap-4 md:border-r md:border-t-0 md:pt-6">{links.map(({title,href,Icon})=><Link key={title} href={href} aria-current={pathname===href?"page":undefined} className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs focus-visible:outline-2 focus-visible:outline-green-700 ${pathname===href?"bg-green-700 text-white":"text-gray-700 hover:bg-green-50"}`}><Icon size={22}/>{title}</Link>)}</nav>;
}
