"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MembershipDto } from "@/app/api/server/laboratories/laboratory-membership.contracts";
import type { LaboratoryContext } from "@/app/api/server/areas/area.authorization";
export function LaboratoryMemberships({ laboratoryId }: { laboratoryId: string }) {
  const [data,setData] = useState<{context:LaboratoryContext;memberships:MembershipDto[]} | null>(null);
  const [message,setMessage]=useState(""); const [busy,setBusy]=useState<string|null>(null); const inFlight=useRef(false);
  const load=useCallback(async()=>{
    try { const r=await fetch(`/api/laboratories/${laboratoryId}/memberships`,{cache:"no-store"}); const body=await r.json(); if(!r.ok){setData(null);setMessage(body.error?.message??"Não foi possível carregar membros.");return;}setData(body); }
    catch {setData(null);setMessage("Não foi possível conectar. Tente novamente.");}
  },[laboratoryId]);
  useEffect(()=>{void load();},[load]);
  async function change(member:MembershipDto) {
    if(inFlight.current || member.role==="OWNER")return;
    inFlight.current=true;setBusy(member.id);setMessage("");
    try {const r=await fetch(`/api/laboratories/${laboratoryId}/memberships/${member.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({expectedRole:member.role,role:member.role==="ADMIN"?"MEMBER":"ADMIN"})});const body=await r.json();setMessage(r.ok?"Papel atualizado.":body.error?.message??"Não foi possível atualizar.");await load();}
    catch {setMessage("Não foi possível conectar. Tente novamente.");}
    finally {inFlight.current=false;setBusy(null);}
  }
  return <section className="space-y-4"><h1 className="text-2xl font-bold">Membros do laboratório</h1><p role="status" aria-live="polite">{message}</p>{!data?<><p>{message?"Lista indisponível.":"Carregando membros…"}</p><button className="underline" onClick={()=>void load()}>Tentar novamente</button></>:<>{data.context.readOnly&&<p className="rounded bg-amber-50 p-3">Laboratório inativo — somente leitura.</p>}<ul className="divide-y rounded-xl border border-gray-200 bg-white">{data.memberships.map(member=><li key={member.id} className="flex flex-wrap items-center gap-3 p-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100" aria-hidden="true">{member.initials}</span><span className="flex-1">{member.name}<span className="block text-sm text-gray-600">{member.role}</span></span>{member.role!=="OWNER"&&!data.context.readOnly&&<button disabled={busy!==null} onClick={()=>void change(member)} className="rounded-lg border px-3 py-2 disabled:opacity-50" aria-label={`${member.role==="ADMIN"?"Rebaixar":"Promover"} ${member.name}`}>{busy===member.id?"Salvando…":member.role==="ADMIN"?"Rebaixar para membro":"Promover a administrador"}</button>}</li>)}</ul>{data.memberships.length===0&&<p>Nenhum membro encontrado.</p>}</>}</section>;
}
