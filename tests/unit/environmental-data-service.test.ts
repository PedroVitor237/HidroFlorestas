import assert from "node:assert/strict";
import { test } from "node:test";
import { EnvironmentalDataService, type MeasurementRecord, type MeasurementTransaction } from "../../src/app/api/server/services/environmental-data.service";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
import { validEnvironmentalPayload } from "../fixtures/environmental-data";
export const context={laboratoryId:'00000000-0000-4000-8000-000000000511',areaId:'00000000-0000-4000-8000-000000000521',collectionId:'00000000-0000-4000-8000-000000000531'};
export function harness() {
 const records:MeasurementRecord[]=[];
 const state={readOnly:false,revoked:false,exists:true,fail:false};
 const tx:MeasurementTransaction={findCollection:async c=>state.exists&&c.collectionId===context.collectionId&&c.areaId===context.areaId&&c.laboratoryId===context.laboratoryId,findByKey:async(u,k)=>records.find(r=>r.userId===u&&r.confirmationKey===k)??null,findByCollection:async id=>records.find(r=>r.collectionDataId===id)??null,create:async r=>{if(state.fail)throw Error('sensitive');records.push(r);return r;}};
 const service=new EnvironmentalDataService({store:{transaction:async fn=>fn(tx)},authorize:async(_u,_l,_t,write)=>{if(state.revoked)throw new AreaAccessError('NOT_FOUND');if(write&&state.readOnly)throw new AreaAccessError('READ_ONLY');return {id:context.laboratoryId,name:'Lab',status:state.readOnly?'INACTIVE':'ACTIVE',membershipRole:'MEMBER',readOnly:state.readOnly};},clock:()=>new Date('2026-09-17T12:00:00Z'),createId:()=>crypto.randomUUID()});
 const command={...context,userId:'user',confirmationKey:'50000000-0000-4000-8000-000000000001',payload:validEnvironmentalPayload()};
 return {service,records,state,command};
}
test('creates one immutable versioned set and replays without privileged projection',async()=>{
 const h=harness();const first=await h.service.create(h.command); const replay=await h.service.create(h.command);
 assert.equal(first.created,true);assert.equal(replay.created,false);assert.deepEqual(first.environmentalData,replay.environmentalData);assert.equal(h.records.length,1);
 assert.equal(h.records[0].userId,'user');assert.equal(first.environmentalData.measurementContractVersion,'ihfr-measurement-v1');
 for(const key of ['userId','confirmationKey','payloadHash','algorithmVersion'])assert.ok(!(key in first.environmentalData));
 await assert.rejects(h.service.create({...h.command,confirmationKey:'50000000-0000-4000-8000-000000000002'}),{code:'CONFLICT'});
 const changed=validEnvironmentalPayload();changed.water.hasSpring=true;
 await assert.rejects(h.service.create({...h.command,payload:changed}),{code:'CONFLICT'});
 assert.equal(h.records.length,1);
});
test('revalidates context, read-only and failures before any write/replay',async()=>{
 const h=harness();h.state.readOnly=true;await assert.rejects(h.service.create(h.command),{code:'READ_ONLY'});
 h.state.readOnly=false;h.state.revoked=true;await assert.rejects(h.service.create(h.command),{code:'NOT_FOUND'});
 h.state.revoked=false;await assert.rejects(h.service.create({...h.command,areaId:'00000000-0000-4000-8000-000000000999'}),{code:'NOT_FOUND'});
 h.state.fail=true;await assert.rejects(h.service.create(h.command),{code:'INTERNAL_ERROR'});assert.equal(h.records.length,0);
});
