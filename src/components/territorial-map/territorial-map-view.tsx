"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapPinned, RefreshCw } from "lucide-react";
import type { TerritorialArea, TerritorialMapResponse } from "@/types/territorial-map.type";
import { TerritorialMap } from "./territorial-map";
import { formatCoordinate, selectedArea } from "./territorial-map-state";

function isResponse(value: unknown): value is TerritorialMapResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TerritorialMapResponse>;
  return Boolean(candidate.context && Array.isArray(candidate.areas));
}

export function TerritorialMapView({ laboratoryId }: { laboratoryId: string }) {
  const [data, setData] = useState<TerritorialMapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const generation = useRef(0);
  const activeController = useRef<AbortController | null>(null);
  const load = useCallback(async () => {
    const current = ++generation.current;
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;
    setLoading(true); setError(null); setData(null); setSelectedId(null);
    try {
      const response = await fetch(`/api/laboratories/${laboratoryId}/territorial-map`, { credentials: "include", cache: "no-store", signal: controller.signal });
      const body: unknown = await response.json();
      if (current !== generation.current) return;
      if (!response.ok || !isResponse(body)) throw new Error("INVALID_RESPONSE");
      setData(body);
    } catch (caught) {
      if (current !== generation.current || (caught instanceof DOMException && caught.name === "AbortError")) return;
      setError("Não foi possível carregar a visão territorial.");
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [laboratoryId]);
  useEffect(() => {
    void load();
    return () => { generation.current += 1; activeController.current?.abort(); };
  }, [load]);

  if (loading) return <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"><RefreshCw className="mx-auto animate-spin text-green-700" aria-hidden="true"/><p role="status" className="mt-3 text-slate-700">Carregando visão territorial…</p></section>;
  if (error || !data) return <section className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm"><p role="alert" className="font-semibold text-red-800">{error ?? "Resposta territorial inválida."}</p><button type="button" onClick={() => void load()} className="mt-5 rounded-xl bg-red-700 px-5 py-3 font-bold text-white focus-visible:ring-2">Tentar novamente</button></section>;
  if (data.areas.length === 0) return <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"><MapPinned className="mx-auto text-slate-400" aria-hidden="true"/><h1 className="mt-3 text-2xl font-bold text-slate-900">Nenhuma área cadastrada</h1><p className="mt-2 text-slate-600">{data.context.readOnly ? "Este laboratório está inativo e disponível somente para leitura." : "A visão territorial aparecerá quando este laboratório possuir áreas."}</p>{!data.context.readOnly && <Link className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-3 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900" href={`/dashboard/laboratories/${laboratoryId}/areas`}>Ir para áreas</Link>}</section>;
  const selected = selectedArea(data.areas, selectedId);
  const available = data.areas.filter((area) => area.location);
  const unavailable = data.areas.filter((area) => !area.location);
  return <div className="min-w-0 space-y-6">
    <header className="rounded-3xl bg-linear-to-r from-green-700 to-blue-700 p-6 text-white shadow-sm"><p className="text-sm font-bold uppercase tracking-widest">Visão territorial</p><h1 className="mt-2 text-3xl font-bold">Áreas de {data.context.name}</h1><p className="mt-2 text-green-50">{data.areas.length} {data.areas.length === 1 ? "área" : "áreas"} · {data.context.readOnly ? "Laboratório inativo, somente leitura" : "Laboratório ativo"}</p></header>
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
      <TerritorialMap areas={data.areas} selectedAreaId={selectedId} onSelect={setSelectedId}/>
      <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="area-list-title"><h2 id="area-list-title" className="text-xl font-bold text-slate-900">Lista de áreas</h2><AreaList areas={available} selectedId={selectedId} onSelect={setSelectedId}/>{unavailable.length > 0 && <div className="mt-6 border-t border-slate-200 pt-5"><h3 className="font-bold text-slate-900">Localização indisponível</h3><AreaList areas={unavailable} selectedId={selectedId} onSelect={setSelectedId}/></div>}</section>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{selected ? `Área selecionada: ${selected.name}` : "Nenhuma área selecionada"}</p>
    {selected && <AreaPanel laboratoryId={laboratoryId} area={selected}/>}
  </div>;
}

function AreaList({ areas, selectedId, onSelect }: { areas: TerritorialArea[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return <ul className="mt-4 space-y-3">{areas.map((area) => <li key={area.id}><button type="button" onClick={() => onSelect(area.id)} aria-pressed={selectedId === area.id} aria-controls="selected-area-panel" className="min-h-11 w-full rounded-2xl border border-slate-200 p-4 text-left hover:border-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 aria-pressed:border-blue-600 aria-pressed:bg-blue-50"><span className="block wrap-break-word font-bold text-slate-900">{area.name}</span><span className="mt-1 block text-sm text-slate-600">{area.location ? `${formatCoordinate(area.location.latitude)}, ${formatCoordinate(area.location.longitude)}` : "Localização indisponível"}</span><span className="mt-1 block text-sm text-slate-600">{area.confirmedCollections.length} {area.confirmedCollections.length === 1 ? "coleta confirmada" : "coletas confirmadas"}</span></button></li>)}</ul>;
}

function AreaPanel({ laboratoryId, area }: { laboratoryId: string; area: TerritorialArea }) {
  return <section id="selected-area-panel" className="min-w-0 rounded-3xl border border-blue-200 bg-white p-5 shadow-sm" aria-labelledby="selected-area-title"><h2 id="selected-area-title" className="wrap-break-word text-2xl font-bold text-slate-900">{area.name}</h2>{area.location && <p className="mt-2 text-slate-600">Coordenadas: {formatCoordinate(area.location.latitude)}, {formatCoordinate(area.location.longitude)}</p>}<Link className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-green-700 px-4 py-2 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900" href={`/dashboard/laboratories/${laboratoryId}/areas/${area.id}`}>Abrir detalhe da área</Link><h3 className="mt-6 font-bold text-slate-900">Coletas confirmadas ({area.confirmedCollections.length})</h3>{area.confirmedCollections.length === 0 ? <p className="mt-2 text-slate-600">Nenhuma coleta confirmada nesta área.</p> : <ul className="mt-3 space-y-2">{area.confirmedCollections.map((collection) => <li key={collection.id} className="rounded-xl border border-slate-200 p-3"><p className="text-sm text-slate-700">Ocorrência: {new Date(collection.occurredAt).toLocaleString("pt-BR")}</p><p className="text-sm text-slate-600">Confirmação: {new Date(collection.confirmedAt).toLocaleString("pt-BR")}</p><Link className="mt-2 inline-flex min-h-11 items-center font-bold text-blue-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2" href={`/dashboard/laboratories/${laboratoryId}/areas/${area.id}/collections/${collection.id}`}>Abrir coleta</Link></li>)}</ul>}</section>;
}
