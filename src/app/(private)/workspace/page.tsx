"use client";

import Image from "next/image";

import Logo from "@/assets/logo/logo.png";
import { LaboratoryWorkspace } from "@/components/workspace/laboratory-workspace";
import { useAuth } from "@/contexts/auth.context";

export default function Workspace() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <header className="mt-2 flex flex-col items-center justify-center">
          <Image src={Logo} alt="HidroFlorestas" width={150} priority />
          <h1 className="mt-3 text-center text-2xl font-bold leading-snug text-gray-900 md:text-4xl">
            <span className="text-amber-700">
              Olá, {user?.firstName || "usuário"}! 👋
            </span>
            <br />
            Ambiente de Análises
            <br />
            <span className="font-bold text-blue-500">HIDRO</span>
            <span className="font-bold text-green-600">FLORESTAS</span>
          </h1>
        </header>
        <LaboratoryWorkspace />
      </div>
    </main>
  );
}
