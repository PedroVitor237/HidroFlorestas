"use client";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { areaMapConfig } from "./map-config";
export type AreaMapProps={latitude:number|null;longitude:number|null;onSelect?:(lat:number,lng:number)=>void};
const marker=divIcon({html:'<span style="display:block;width:22px;height:22px;border:3px solid white;border-radius:50%;background:#15803d;box-shadow:0 0 0 2px #14532d"></span>',className:"area-point-marker",iconSize:[22,22],iconAnchor:[11,11]});
function Point({latitude,longitude,onSelect}:AreaMapProps){
 const map=useMap();
 useMapEvents({click:event=>{if(onSelect){const lng=((event.latlng.lng+180)%360+360)%360-180;onSelect(Math.max(-90,Math.min(90,event.latlng.lat)),lng);}}});
 useEffect(()=>{if(latitude!==null&&longitude!==null)map.setView([latitude,longitude],Math.max(map.getZoom(),12));},[map,latitude,longitude]);
 return latitude!==null&&longitude!==null?<Marker position={[latitude,longitude]} icon={marker} title="Ponto confirmado"/>:null;
}
export default function AreaMapClient(props:AreaMapProps){const config=areaMapConfig();return <div className="space-y-2"><div className="relative z-0 h-72 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner sm:h-96" aria-label="Mapa da área" role="region"><MapContainer center={[-14,-52]} zoom={3} className="h-full w-full" scrollWheelZoom={false}>{config&&<TileLayer url={config.url} attribution={config.attribution}/>}<Point {...props}/></MapContainer></div>{!config&&<p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Mapa base indisponível. As coordenadas continuam disponíveis.</p>}</div>;}
