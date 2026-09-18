import assert from "node:assert/strict";
import { test } from "node:test";
import { createEnvironmentalHandlers } from "../../src/app/api/server/environmental-data/environmental-data.http";
import { AuthBoundaryError } from "../../src/app/api/server/middlewares/auth.middleware";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { EnvironmentalServiceError } from "../../src/app/api/server/services/environmental-data.service";
import { validEnvironmentalPayload } from "../fixtures/environmental-data";
const ctx={laboratoryId:'00000000-0000-4000-8000-000000000511',areaId:'00000000-0000-4000-8000-000000000521',collectionId:'00000000-0000-4000-8000-000000000531'};
const request=(body:unknown=validEnvironmentalPayload(),key='50000000-0000-4000-8000-000000000001')=>new Request('http://local.test',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify(body)});
const context=()=>({params:Promise.resolve(ctx)});
const principal=async()=>({id:'session-author',firstName:'Test',lastName:'Test',image:'',isAdmin:false});
test('POST/GET envelopes, session author, Location, no-store and replay',async()=>{
 for(const created of [true,false]) {
  let author='';const h=createEnvironmentalHandlers({requireAuth:principal,service:{create:async c=>{author=c.userId;return {created,environmentalData:null as never};},detail:async()=>({environmentalData:null})}});
  const res=await h.POST(request(),context());assert.equal(res.status,created?201:200);assert.equal(author,'session-author');assert.equal(res.headers.get('Cache-Control'),'no-store');assert.match(res.headers.get('Location')!,/\/environmental-data$/);
  const read=await h.GET(request(),context());assert.equal(read.status,200);assert.deepEqual(await read.json(),{environmentalData:null});
 }
});
test('rejects invalid JSON/header/extra fields before invoking service',async()=>{
 const h=createEnvironmentalHandlers({requireAuth:principal,service:{create:async()=>{throw Error('unexpected');},detail:async()=>({environmentalData:null})}});
 for(const req of [request({},''),request({...validEnvironmentalPayload(),userId:'forged'}),new Request('http://local.test',{method:'POST',headers:{'Idempotency-Key':'50000000-0000-4000-8000-000000000001','Content-Type':'application/json'},body:'{'} )])assert.equal((await h.POST(req,context())).status,400);
});
test('sanitizes every error and applies no-store on both methods',async()=>{
 for(const [error,status] of [[new AuthBoundaryError('UNAUTHORIZED'),401],[new EnvironmentalServiceError('FORBIDDEN'),403],[new AreaAccessError('NOT_FOUND'),404],[new AreaAccessError('READ_ONLY'),409],[new EnvironmentalServiceError('CONFLICT'),409],[Error('secret'),500]] as const) {
  const fail=async():Promise<never>=>{throw error;};
  const h=createEnvironmentalHandlers({requireAuth:principal,service:{create:fail,detail:fail}});
  for(const method of [h.POST,h.GET]){const r=await method(request(),context());assert.equal(r.status,status);assert.equal(r.headers.get('Cache-Control'),'no-store');assert.ok(!(await r.text()).includes('secret'));}
 }
});
