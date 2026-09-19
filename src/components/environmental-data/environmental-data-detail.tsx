import Link from "next/link";
import { Droplets, Mountain, Sprout, Layers } from "lucide-react";
import type { EnvironmentalPayload, PublicEnvironmentalData } from "@/types/environmental-data.type";
import { ENVIRONMENTAL_FIELDS } from "@/types/environmental-data.validation";
export const GROUPS = {
 water:{label:'Água',color:'bg-sky-700',icon:Droplets},soil:{label:'Solo',color:'bg-amber-800',icon:Layers},vegetation:{label:'Vegetação',color:'bg-green-700',icon:Sprout},terrain:{label:'Terreno',color:'bg-orange-800',icon:Mountain},
};
export const VALUE_LABELS:Record<string,string>={RIVER_STREAM:'Rio ou riacho',SPRING:'Nascente',SHALLOW_WELL:'Poço raso',TUBULAR_WELL:'Poço tubular',CISTERN:'Cisterna',OTHER:'Outra',PERMANENT:'Permanente',SEASONAL:'Sazonal',SCARCE:'Escassa',NONE:'Nenhum',SUSPECTED:'Suspeita',CONFIRMED:'Confirmada',SANDY:'Arenosa',MEDIUM:'Média',CLAYEY:'Argilosa',LOW:'Baixo',HIGH:'Alto',LAMINAR:'Laminar',RILLS_GULLIES:'Sulcos ou ravinas'};
export function EnvironmentalValues({payload}:{payload:EnvironmentalPayload}) {
 return <div className="grid gap-5 lg:grid-cols-2">{Object.entries(ENVIRONMENTAL_FIELDS).map(([group,fields])=>{
  const style=GROUPS[group as keyof typeof GROUPS];const Icon=style.icon;
  return <section key={group} aria-label={style.label} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
   <h3 className={`${style.color} flex items-center gap-2 px-5 py-3 font-semibold text-white`}><Icon size={19} aria-hidden="true"/>{style.label}</h3>
   <dl className="divide-y divide-slate-100 px-5">{Object.entries(fields).map(([key,rule])=>{
    const value=(payload[group as keyof EnvironmentalPayload] as Record<string,unknown>)[key];
    const text=value===null?'Não informado':typeof value==='boolean'?(value?'Sim':'Não'):typeof value==='number'?`${value}${rule.unit?` ${rule.unit}`:''}`:VALUE_LABELS[String(value)]??String(value);
    return <div key={key} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><dt className="text-slate-600">{rule.label}</dt><dd className="font-semibold text-slate-900">{text}</dd></div>;
   })}</dl>
  </section>;
 })}</div>;
}
export function EnvironmentalDetail({data,readOnly,basePath}:{data:PublicEnvironmentalData|null;readOnly:boolean;basePath:string}) {
 if(!data)return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="text-xl font-semibold">Nenhum dado ambiental registrado</h2><p className="mt-2 text-slate-600">Esta coleta ainda não possui um conjunto ambiental confirmado.</p>{!readOnly&&<Link href={`${basePath}/new`} className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">Registrar dados ambientais</Link>}</div>;
 return <div className="space-y-5"><p className="rounded-xl bg-green-50 p-4 text-sm text-green-900">Conjunto confirmado e imutável. Os valores abaixo foram registrados para esta coleta.</p><EnvironmentalValues payload={data}/><p className="text-sm text-slate-600">Contrato de captura: {data.measurementContractVersion} · Confirmado em {new Date(data.confirmedAt).toLocaleString('pt-BR',{timeZone:'America/Fortaleza'})} (UTC−03:00)</p></div>;
}
