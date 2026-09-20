"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuários", icon: Users },
] as const;

function isCurrentRoute(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-emerald-950/10 bg-emerald-950 text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
              <ShieldCheck aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">HidroFlorestas</p>
              <p className="mt-1 font-semibold">Administração global</p>
            </div>
          </div>
        </div>

        <nav aria-label="Navegação administrativa" className="flex-1 space-y-2 px-4 py-6">
          {adminLinks.map(({ href, label, icon: Icon }) => {
            const current = isCurrentRoute(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${current ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-50 hover:bg-white/10"}`}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-4">
          <Link href="/workspace" className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <ArrowLeft size={19} aria-hidden="true" /> Ambiente principal
          </Link>
          <Link href="/logout" className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <LogOut size={19} aria-hidden="true" /> Sair
          </Link>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Área restrita</p>
              <p className="font-semibold text-slate-900">Administração global</p>
            </div>
            <Link href="/workspace" className="hidden min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 sm:flex">
              <ArrowLeft size={18} aria-hidden="true" /> Ambiente principal
            </Link>
          </div>
        </header>

        <nav aria-label="Navegação administrativa móvel" className="sticky top-[77px] z-10 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {adminLinks.map(({ href, label, icon: Icon }) => {
            const current = isCurrentRoute(pathname, href);
            return (
              <Link key={href} href={href} aria-current={current ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${current ? "bg-emerald-800 text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
                <Icon size={18} aria-hidden="true" /> {label}
              </Link>
            );
          })}
          <Link href="/logout" className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            <LogOut size={18} aria-hidden="true" /> Sair
          </Link>
        </nav>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
