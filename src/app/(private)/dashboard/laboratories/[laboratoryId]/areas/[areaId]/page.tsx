import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ClipboardPlus, MapPin } from "lucide-react";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { areasService } from "@/app/api/server/services/areas.service";
import { AreaAccessError } from "@/app/api/server/areas/area.authorization";
import { AreaMap } from "@/components/areas/area-map";
export default async function AreaDetail({
  params,
}: {
  params: Promise<{ laboratoryId: string; areaId: string }>;
}) {
  const { laboratoryId, areaId } = await params;
  const principal = await requireAuth();
  const result = await areasService
    .detail(principal.id, laboratoryId, areaId)
    .catch((error) => {
      if (error instanceof AreaAccessError && error.code === "NOT_FOUND")
        notFound();
      throw new Error("Não foi possível carregar a área.");
    });
  const { area } = result;
  const optional = [
    ["Município", area.municipality],
    ["UF", area.state],
    ["Tipo do terreno", area.landType],
    ["Descrição", area.description],
  ].filter(([, value]) => value);
  return (
    <article className="space-y-6">
      <div className="flex items-start gap-3">
        <Link
          aria-label="Voltar às áreas"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-700 text-white hover:bg-amber-800"
          href={`/dashboard/laboratories/${laboratoryId}/areas`}
        >
          <ArrowLeft size={22} />
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-green-700">
            Diagnóstico hidroambiental
          </p>
          <h1 className="break-words text-3xl font-bold text-slate-900 sm:text-4xl">
            {area.name}
          </h1>
          <p className="mt-2 break-all text-xs text-slate-400">
            Identificador: {area.id}
          </p>
        </div>
      </div>
      {area.readOnly && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-medium text-amber-900">
          Laboratório inativo — somente leitura.
        </p>
      )}
      {!area.readOnly && (
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800"
          href={`/dashboard/laboratories/${laboratoryId}/areas/${areaId}/collections/new`}
        >
          <ClipboardPlus size={20} /> Registrar coleta
        </Link>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <MapPin className="text-green-600" /> Localização monitorada
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Latitude: {area.latitude} · Longitude: {area.longitude}
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <AreaMap latitude={area.latitude} longitude={area.longitude} />
          </div>
        </section>
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Informações da área
          </h2>
          <dl className="mt-5 space-y-4">
            {optional.map(([label, value]) => (
              <div key={label} className="border-b border-slate-100 pb-3">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {label}
                </dt>
                <dd className="mt-3 break-words font-semibold text-slate-700">
                  {value}
                </dd>
              </div>
            ))}
            <div>
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <CalendarDays size={15} /> Cadastrada em
              </dt>
              <dd className="mt-3 font-semibold text-slate-700">
                {new Date(area.createdAt).toLocaleString("pt-BR", {
                  timeZone: "America/Fortaleza",
                })}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
