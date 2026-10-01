import Link from "next/link";
import { LayoutDashboard, Map, MapPinned, Users } from "lucide-react";
import { getLaboratoryContext } from "@/components/workspace/laboratory-context";
export const dynamic = "force-dynamic";
export default async function LaboratoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ laboratoryId: string }>;
}) {
  const { laboratoryId } = await params;
  const context = await getLaboratoryContext(laboratoryId);
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <header className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
           
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">
                Laboratório selecionado
              </p>
              <h2 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                {context.name}
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                {context.membershipRole} ·{" "}
                {context.readOnly ? "Inativo · Somente leitura" : "Ativo"}
              </p>
            </div>
          </div>
          <nav
            aria-label="Laboratório"
            className="grid grid-cols-2 gap-2 sm:flex"
          >
            <Link href={`/dashboard/laboratories/${laboratoryId}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:ring-2">
              <LayoutDashboard aria-hidden="true" size={18} /> Resumo
            </Link>
            <Link
              href={`/dashboard/laboratories/${laboratoryId}/areas`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700"
            >
              <MapPinned aria-hidden="true" size={18} /> Áreas
            </Link>
            <Link
              href={`/dashboard/laboratories/${laboratoryId}/map`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:ring-2"
            >
              <Map aria-hidden="true" size={18} /> Mapa
            </Link>
            {context.membershipRole === "OWNER" && (
              <Link
                href={`/dashboard/laboratories/${laboratoryId}/members`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Users aria-hidden="true" size={18} /> Membros
              </Link>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
