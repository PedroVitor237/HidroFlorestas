import assert from "node:assert/strict";
import { it } from "node:test";
import { createAreaHandlers } from "../../src/app/api/laboratories/[laboratoryId]/areas/route.handlers";
import { createAreaDetailHandler } from "../../src/app/api/laboratories/[laboratoryId]/areas/[areaId]/route.handlers";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
const principal={id:"server-user",firstName:"T",lastName:"U",image:"",role:"USER" as const,};
const route={params:Promise.resolve({laboratoryId:"lab",areaId:"area"})};
const area={id:"area",name:"Area",latitude:0,longitude:0,municipality:null,state:null,landType:null,description:null,createdAt:"2026-09-15T00:00:00Z",laboratory:{id:"lab",name:"Lab",status:"ACTIVE" as const},readOnly:false};
const context={id:"lab",name:"Lab",status:"ACTIVE" as const,membershipRole:"OWNER" as const,readOnly:false};
it("POST derives identity from the authenticated principal and rejects privilege injection",async()=>{
 const calls:unknown[]=[];
 const handlers=createAreaHandlers({requireAuth:async()=>principal,service:{list:async()=>({context,areas:[]}),create:async(...args)=>{calls.push(args);return {area};}}});
 for(const key of ["userId","laboratoryId","isActive","creator"]){const r=await handlers.POST(new Request("http://localhost",{method:"POST",body:JSON.stringify({name:"Area",latitude:0,longitude:0,[key]:"forged"})}),route);assert.equal(r.status,400);}
 assert.equal(calls.length,0);
 const response=await handlers.POST(new Request("http://localhost",{method:"POST",body:JSON.stringify({name:"Area",latitude:0,longitude:0})}),route);
 assert.equal(response.status,201);assert.match(response.headers.get("location")??"",/\/lab\/areas\/area$/);assert.equal((calls[0] as unknown[])[0],principal.id);assert.equal(response.headers.get("cache-control"),"no-store");assert.deepEqual(await response.json(),{area});
});
it("all three handlers sanitize failures and preserve no-store",async()=>{
 for(const [error,status] of [[new AreaAccessError("NOT_FOUND"),404],[new AreaAccessError("READ_ONLY"),409],[new AreaAccessError("FORBIDDEN"),403],[new Error("private SQL stack"),500],[new AuthBoundaryError("UNAUTHORIZED"),401]] as const){
 const fail=async()=>{throw error;};const deps={requireAuth:async()=>principal,service:{list:fail,create:fail,detail:fail}};
 const handlers=createAreaHandlers(deps);const req=new Request("http://localhost",{method:"POST",body:JSON.stringify({name:"Area",latitude:0,longitude:0})});
 for(const r of [await handlers.GET(new Request("http://localhost"),route),await handlers.POST(req,route),await createAreaDetailHandler(deps)(new Request("http://localhost"),route)]){assert.equal(r.status,status);assert.equal(r.headers.get("cache-control"),"no-store");assert.equal((await r.text()).includes("private SQL"),false);}
 }
});
it("keeps inactive area detail readable with the inherited read-only DTO",async()=>{
 const inactive={...area,laboratory:{...area.laboratory,status:"INACTIVE" as const},readOnly:true};
 const deps={requireAuth:async()=>principal,service:{list:async()=>({context:{...context,status:"INACTIVE" as const,readOnly:true},areas:[]}),create:async()=>({area:inactive}),detail:async()=>({area:inactive})}};
 const response=await createAreaDetailHandler(deps)(new Request("http://localhost"),route);
 assert.equal(response.status,200);assert.equal(response.headers.get("cache-control"),"no-store");assert.deepEqual(await response.json(),{area:inactive});
});
