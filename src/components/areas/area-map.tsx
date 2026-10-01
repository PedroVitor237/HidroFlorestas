"use client";
import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import type { AreaMapProps } from "./area-map.client";
const ClientMap=dynamic(()=>import("./area-map.client"),{ssr:false,loading:()=> <p className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 sm:h-96">Carregando mapa…</p>});
class MapBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<p role="status">Mapa indisponível. Use as coordenadas informadas abaixo.</p>:this.props.children;}}
export function AreaMap(props:AreaMapProps){return <MapBoundary><ClientMap {...props}/></MapBoundary>;}
