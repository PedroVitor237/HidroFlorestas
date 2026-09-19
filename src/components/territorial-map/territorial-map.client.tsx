"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { TerritorialArea } from "@/types/territorial-map.type";
import { mapTileConfig } from "@/components/maps/map-config";
import { areasWithLocation, classifyTiles, type TileState } from "./territorial-map-state";

const marker = divIcon({ html: '<span style="display:block;width:22px;height:22px;border:3px solid white;border-radius:50%;background:#15803d;box-shadow:0 0 0 2px #14532d"></span>', className: "territorial-point-marker", iconSize: [22, 22], iconAnchor: [11, 11] });
const selectedMarker = divIcon({ html: '<span style="display:block;width:26px;height:26px;border:4px solid white;border-radius:50%;background:#1d4ed8;box-shadow:0 0 0 3px #1e3a8a"></span>', className: "territorial-point-marker", iconSize: [26, 26], iconAnchor: [13, 13] });
function Fit({ areas }: { areas: TerritorialArea[] }) {
  const map = useMap();
  useEffect(() => {
    const points = areasWithLocation(areas).map((area) => [area.location!.latitude, area.location!.longitude] as [number, number]);
    if (points.length === 1) map.setView(points[0], 12);
    else if (points.length > 1) map.fitBounds(latLngBounds(points), { padding: [24, 24], maxZoom: 12 });
  }, [areas, map]);
  return null;
}
export default function TerritorialMapClient({ areas, selectedAreaId, onSelect }: { areas: TerritorialArea[]; selectedAreaId: string | null; onSelect: (id: string) => void }) {
  const config = mapTileConfig();
  const [tileState, setTileState] = useState<TileState>(config ? "LOADING" : "UNCONFIGURED");
  const counts = useRef({ loaded: 0, failed: 0 });
  const located = useMemo(() => areasWithLocation(areas), [areas]);
  return <div className="min-w-0 space-y-2">
    <div className="relative z-0 h-80 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-[28rem]" role="region" aria-label="Mapa das áreas do laboratório">
      <MapContainer center={[-14, -52]} zoom={3} className="h-full w-full" scrollWheelZoom={false}>
        {config && <TileLayer url={config.url} attribution={config.attribution} eventHandlers={{ loading: () => { counts.current = { loaded: 0, failed: 0 }; setTileState("LOADING"); }, tileload: () => { counts.current.loaded += 1; }, tileerror: () => { counts.current.failed += 1; }, load: () => setTileState(classifyTiles(counts.current.loaded, counts.current.failed)) }} />}
        <Fit areas={areas} />
        {located.map((area) => <Marker key={area.id} position={[area.location!.latitude, area.location!.longitude]} icon={area.id === selectedAreaId ? selectedMarker : marker} title={`Selecionar ${area.name}`} alt={`Selecionar ${area.name}`} keyboard eventHandlers={{ click: () => onSelect(area.id) }} />)}
      </MapContainer>
    </div>
    {tileState !== "AVAILABLE" && <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">{tileState === "DEGRADED" ? "A base cartográfica está parcialmente disponível." : tileState === "LOADING" ? "Carregando base cartográfica…" : "Base cartográfica indisponível. A lista permanece completa."}</p>}
  </div>;
}
