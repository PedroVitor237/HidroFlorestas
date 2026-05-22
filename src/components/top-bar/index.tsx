"use client";
import Image from "next/image";
import Logo from "@/assets/logo/logo-hf.png";
import { useAuth } from "@/contexts/auth.context";
import UserProfile from "../user-profile";

type Props = {
  showLinks?: boolean;
  showProfile?: boolean;
};

export default function TopBar(props: Props) {
  const { user } = useAuth();
  const { showLinks, showProfile } = props;

  return (
    <div className="w-full top-0 hidden sticky bg-white px-6 py-3 md:flex items-center justify-between border-b border-gray-200">
      <Image src={Logo} alt="Logo HidroFlorestas" width={180} />
      <div className="flex items-center justify-between gap-20">
        {showLinks && (
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-blue-500 underline">
              O que são laborátórios IHFR?
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500 underline">
              Sobre nós
            </a>
          </div>
        )}
        {showProfile && (
          <div className="flex items-center gap-4">
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
      </div>
    </div>
  );
}
