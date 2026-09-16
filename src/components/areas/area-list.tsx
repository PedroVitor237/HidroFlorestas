"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Plus, RefreshCw } from "lucide-react";
import type { LaboratoryContext } from "@/app/api/server/areas/area.authorization";
import type { AreaSummaryDto } from "@/types/area.type";
export function AreaList({ laboratoryId }: { laboratoryId: string }) {
  const [data, setData] = useState<{
    context: LaboratoryContext;
    areas: AreaSummaryDto[];
  } | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/laboratories/${laboratoryId}/areas`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => ({
        ok: response.ok,
        body: await response.json(),
      }))
      .then(({ ok, body }) => {
        if (controller.signal.aborted) return;
        if (!ok) {
          setData(null);
          setError(body.error?.message ?? "Não foi possível carregar áreas.");
          return;
        }
        setData(body);
        setError("");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setData(null);
          setError("Falha de conexão. Tente novamente.");
        }
      });
    return () => controller.abort();
  }, [laboratoryId, attempt]);
  return (
    <section className="space-y-7" aria-labelledby="areas-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-green-700">
            Monitoramento ambiental
          </p>
          <h1
            id="areas-title"
            className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Áreas Monitoradas
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Gerencie os pontos de monitoramento e consulte as informações
            registradas pela equipe.
          </p>
        </div>
        {data &&
          !data.context.readOnly &&
          data.context.membershipRole !== "MEMBER" && (
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-sm hover:bg-green-700"
              href={`/dashboard/laboratories/${laboratoryId}/areas/new`}
            >
              <Plus aria-hidden="true" size={20} /> Nova área
            </Link>
          )}
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => {
              setError("");
              setData(null);
              setAttempt((v) => v + 1);
            }}
            className="mt-3 inline-flex items-center gap-2 font-bold underline"
          >
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      ) : !data ? (
        <div
          role="status"
          className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm"
        >
          <RefreshCw className="mr-3 animate-spin" size={20} /> Carregando
          áreas…
        </div>
      ) : (
        <>
          {data.context.readOnly && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-medium text-amber-900">
              Laboratório inativo — somente leitura.
            </p>
          )}
          {data.areas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <MapPin className="mx-auto text-slate-300" size={42} />
              <h2 className="mt-4 text-xl font-bold text-slate-800">
                Nenhuma área cadastrada
              </h2>
              <p className="mt-2 text-slate-500">
                Cadastre o primeiro ponto de monitoramento deste laboratório.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data.areas.map((area, index) => (
                <li
                  key={area.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`h-2 ${index % 3 === 0 ? "bg-green-600" : index % 3 === 1 ? "bg-blue-500" : "bg-amber-600"}`}
                  />
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <MapPin size={22} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="break-words text-lg font-bold text-slate-900">
                          <Link
                            href={`/dashboard/laboratories/${laboratoryId}/areas/${area.id}`}
                          >
                            {area.name}
                          </Link>
                        </h2>
                        <p className="mt-3 text-xs text-slate-400">
                          Ponto de monitoramento
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600">
                      Latitude: {area.latitude} · Longitude: {area.longitude}
                    </p>
                    {(area.municipality || area.state) && (
                      <p className="mt-3 text-sm text-slate-500">
                        {[area.municipality, area.state]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    <p className="mt-3 break-all text-xs text-slate-400">
                      Identificador: {area.id}
                    </p>
                    <Link
                      href={`/dashboard/laboratories/${laboratoryId}/areas/${area.id}`}
                      className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-bold text-white hover:bg-green-700"
                    >
                      Ver detalhes <ArrowRight size={18} />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
