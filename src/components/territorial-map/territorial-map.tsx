"use client";
import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import type { TerritorialArea } from "@/types/territorial-map.type";

const ClientMap = dynamic(() => import("./territorial-map.client"), { ssr: false, loading: () => <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-600" role="status">Carregando mapa…</div> });
class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">Mapa indisponível. Use a lista de áreas.</p> : this.props.children; }
}
export function TerritorialMap({ areas, selectedAreaId, onSelect }: { areas: TerritorialArea[]; selectedAreaId: string | null; onSelect: (id: string) => void }) {
  return <MapBoundary><ClientMap areas={areas} selectedAreaId={selectedAreaId} onSelect={onSelect} /></MapBoundary>;
}
