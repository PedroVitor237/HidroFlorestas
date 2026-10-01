import assert from "node:assert/strict";
import { test } from "node:test";
import dotenv from "dotenv";
import { EnvironmentalDataService, PrismaMeasurementStore, measurementAuthorization } from "../../src/app/api/server/services/environmental-data.service";
import { setupEnvironmentalFixtures,cleanupEnvironmentalFixtures,countEnvironmentalFixtures,createEnvironmentalFixtureClient,ENVIRONMENTAL_FIXTURES } from "../fixtures/environmental-data-fixtures";
import { validEnvironmentalPayload } from "../fixtures/environmental-data";
dotenv.config({path:'.env',quiet:true});dotenv.config({path:'.env.test.local',quiet:true});Object.assign(process.env,{NODE_ENV:'test'});
test('PostgreSQL races and contextual authorization preserve a single immutable set',async()=>{
 await setupEnvironmentalFixtures(process.env);
 const db=createEnvironmentalFixtureClient(process.env.TEST_DATABASE_URL!);
 const service=new EnvironmentalDataService({store:new PrismaMeasurementStore(db),authorize:measurementAuthorization,clock:()=>new Date(),createId:()=>crypto.randomUUID()});
 const [userId,adminId,memberId,outsiderId]=ENVIRONMENTAL_FIXTURES.userIds;
 const context={laboratoryId:ENVIRONMENTAL_FIXTURES.laboratoryIds[0],areaId:ENVIRONMENTAL_FIXTURES.areaIds[0],collectionId:ENVIRONMENTAL_FIXTURES.collectionIds[0]};
 const command={...context,userId,confirmationKey:crypto.randomUUID(),payload:validEnvironmentalPayload()};
 try {
  const parent=await db.collectionData.findUnique({where:{id:context.collectionId}});
  const same=await Promise.all([service.create(command),service.create(command)]);
  assert.equal(same.filter(r=>r.created).length,1);assert.equal(same[0].environmentalData.id,same[1].environmentalData.id);
  assert.deepEqual(await db.collectionData.findUnique({where:{id:context.collectionId}}),parent);
  for(const actor of [userId,adminId,memberId])assert.ok((await service.detail(actor,context)).environmentalData);
  await assert.rejects(service.detail(outsiderId,context),{code:'NOT_FOUND'});
  await assert.rejects(service.detail(userId,{...context,areaId:ENVIRONMENTAL_FIXTURES.areaIds[1]}),{code:'NOT_FOUND'});
  await db.researchersLinked.delete({where:{userId_laboratoryRoomId:{userId:memberId,laboratoryRoomId:context.laboratoryId}}});
  await assert.rejects(service.detail(memberId,context),{code:'NOT_FOUND'});
  await db.user.update({where:{id:adminId},data:{status:'BLOCKED'}});
  await assert.rejects(service.detail(adminId,context),{code:'FORBIDDEN'});
  await db.user.update({where:{id:adminId},data:{status:'ACTIVE'}});
  await db.laboratoryRoom.update({where:{id:context.laboratoryId},data:{isActive:false}});
  assert.equal((await service.detail(userId,context)).environmentalData?.readOnly,true);
  await assert.rejects(service.create(command),{code:'READ_ONLY'});
  await db.laboratoryRoom.update({where:{id:context.laboratoryId},data:{isActive:true}});
  for(const diverge of [false,true]){
   const collectionId=crypto.randomUUID();
   await db.collectionData.create({data:{id:collectionId,collectionAreaId:context.areaId,laboratoryRoomId:context.laboratoryId,userId,occurredAt:new Date('2026-09-01T12:00:00Z'),occurrenceOffset:'Z',confirmedAt:new Date(),confirmationKey:crypto.randomUUID()}});
   const a={...command,collectionId,confirmationKey:crypto.randomUUID()};const b={...a,payload:validEnvironmentalPayload()};
   if(diverge)b.payload.water.hasSpring=true;else b.confirmationKey=crypto.randomUUID();
   const results=await Promise.allSettled([service.create(a),service.create(b)]);
   assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
   const rejected=results.find(r=>r.status==='rejected') as PromiseRejectedResult;assert.equal(rejected.reason.code,'CONFLICT');
   assert.equal(await db.environmentalMeasurementSet.count({where:{collectionDataId:collectionId}}),1);
  }
 }finally{await db.$disconnect();await cleanupEnvironmentalFixtures(process.env);assert.ok(Object.values(await countEnvironmentalFixtures(process.env)).every(n=>n===0));}
});
