"use client";
import {
  HouseIcon,
  MenuIcon,
  PowerIcon,
  ShredderIcon,
  UserRoundCogIcon,
  CirclePlusIcon,
} from "lucide-react";
import UserProfile from "../user-profile";
import { useAuth } from "@/contexts/auth.context";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const sidebarLinks = [
  { title: "Início", href: "/dashboard", Icon: HouseIcon },
  { title: "Coletas", href: "/dashboard/collects", Icon: ShredderIcon },
  { title: "Perfil", href: "/dashboard/profile", Icon: UserRoundCogIcon },
];

function MobileSidebar({ closeMenu }: { closeMenu: () => void }) {
  return (
    <div className="fixed z-30 w-full bg-black/50" onClick={closeMenu}>
      <div
        className="h-screen w-3/5 bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        Menu lateral
      </div>
    </div>
  );
}

function MobileTabBar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full bottom-0 fixed bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200 md:hidden">
        <ul className="flex items-center justify-between w-full">
          <li
            onClick={() => setMenuOpen(true)}
            className="flex items-center flex-col text-gray-500 p-2 rounded-md hover:text-green-600 hover:bg-green-600/6"
          >
            <MenuIcon size={20} />
            <span className="text-sm text-gray-500">Menu</span>
          </li>
          <li className="flex items-center flex-col text-white p-2 rounded-md hover:text-green-600 bg-green-600">
            <CirclePlusIcon size={20} />
            <span className="text-sm text-white">Nova Coleta</span>
          </li>
          <li className="flex items-center flex-col text-gray-500 p-2 rounded-md hover:text-green-600 hover:bg-green-600/6">
            <UserProfile
              lyrics={`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`}
              image={user?.image}
            />
          </li>
        </ul>
      </div>
      {menuOpen && <MobileSidebar closeMenu={() => setMenuOpen(false)} />}
    </>
  );
}

export default function Sidebar() {
  // pegar nome da rota para destacar o link ativo
  const urlPath = usePathname();
   const router = useRouter();

  return (
    <>
      <div className="h-full w-25 bg-white hidden p-3 border-r border-gray-200 md:flex flex-col justify-between">
        <ul className="space-y-2 mt-4">
          {sidebarLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className={`flex items-center flex-col text-gray-500 p-2 rounded-md ${urlPath === link.href ? "bg-green-600 text-white hover:text-green-500 hover:bg-green-700 " : "hover:text-green-600 hover:bg-green-600/6 "}`}
              >
                <link.Icon />
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <hr className="border-gray-300" />
          <button
            onClick={() => {
              if (confirm("Tem certeza que deseja sair?")) {
                router.push("/logout");
              }
            }}
            className={`flex items-center flex-col hover:bg-amber-800 hover:text-amber-400 p-2 rounded-md cursor-pointer text-white bg-amber-700`}
          >
            <PowerIcon />
            Sair
          </button>
        </div>
      </div>
      <MobileTabBar />
    </>
  );
}
