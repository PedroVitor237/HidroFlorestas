import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import LogoHF from "@/assets/logo/logo-hf.png";

export function AccountShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 sm:py-14">
    <section className="mx-auto w-full max-w-lg rounded-[20px] bg-white p-6 shadow-md sm:p-10" aria-labelledby="account-title">
      <Link href="/" className="mx-auto mb-7 block w-fit" aria-label="HidroFlorestas, início"><Image src={LogoHF} alt="HidroFlorestas" width={220} priority /></Link>
      <h1 id="account-title" className="text-center text-2xl font-bold text-amber-700">{title}</h1>
      <p className="mt-3 text-center text-[#3E3E3E]">{description}</p>
      <div className="mt-7">{children}</div>
    </section>
  </main>;
}

export const accountInputClass = "mt-2 w-full rounded-lg border border-gray-400 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-700";
export const accountButtonClass = "w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
