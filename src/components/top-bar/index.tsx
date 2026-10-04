"use client";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import Logo from "@/assets/logo/logo-hf.png";
import { useAuth } from "@/contexts/auth.context";
import UserProfile from "../user-profile";

type Props = {
  showLinks?: boolean;
  showProfile?: boolean;
  showLogout?: boolean;
};

export default function TopBar(props: Props) {
  const { user } = useAuth();
  const { showLinks, showProfile, showLogout } = props;

  return (
    <div className={`w-full top-0 sticky bg-white px-4 py-3 items-center justify-between gap-3 border-b border-gray-200 ${showLogout ? "flex" : "hidden md:flex"}`}>
      <Image src={Logo} alt="Logo HidroFlorestas" width={180} className="h-auto w-32 shrink-0 md:w-44" />
      <div className="flex min-w-0 items-center justify-between gap-3 md:gap-8">
        {showLinks && (
          <div className="hidden gap-4 md:flex">
            <a href="#" className="text-gray-500 hover:text-blue-500 underline">
              O que são laborátórios IHFR?
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500 underline">
              Sobre nós
            </a>
          </div>
        )}
        {showProfile && (
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex flex-col items-end">
              <span className="font-semibold text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-sm text-green-600">
                Ambiente de Análise
              </span>
            </div>
            <UserProfile
              image={user?.image}
              lyrics={`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`}
            />
          </div>
        )}
        {showLogout && (
          <Link href="/change-password" className="inline-flex min-h-11 shrink-0 items-center rounded-xl px-2 text-sm font-semibold text-gray-700 underline focus-visible:outline-2 focus-visible:outline-green-700">Alterar senha</Link>
        )}
        {showLogout && (
          <Link href="/logout" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-green-700">
            <LogOut size={18} aria-hidden="true" /> Sair
          </Link>
        )}
      </div>
    </div>
  );
}
