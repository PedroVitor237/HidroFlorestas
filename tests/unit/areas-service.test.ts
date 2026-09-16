import assert from "node:assert/strict";
import { it } from "node:test";
import { Prisma, type PrismaClient, type Prisma as PrismaTypes } from "../../src/generated/prisma";
import { AreasService } from "../../src/app/api/server/services/areas.service";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
const lab="00000000-0000-4000-8000-000000000311",id="00000000-0000-4000-8000-000000000321";
const source={id,name:"Area",latitude:new Prisma.Decimal(-3),longitude:new Prisma.Decimal(-38),municipality:null,state:null,landType:null,description:null,createdAt:new Date(0),updatedAt:new Date(0),userId:"server-user",laboratoryRoomId:lab,image:null,cep:null,isActive:false};
function setup(role="OWNER",active=true,linked=true,status="ACTIVE"){
 const calls:{method:string;args:unknown}[]=[];
 const tx={user:{findUnique:async()=>({status})},researchersLinked:{findUnique:async()=>linked?{role,laboratoryRoom:{id:lab,name:"Lab",isActive:active}}:null},collectionArea:{create:async(args:unknown)=>{calls.push({method:"create",args});return source;},findMany:async(args:unknown)=>{calls.push({method:"list",args});return [source];},findFirst:async(args:unknown)=>{calls.push({method:"detail",args});return source;}}};
 const db={$transaction:async(run:(tx:PrismaTypes.TransactionClient)=>unknown)=>run(tx as unknown as PrismaTypes.TransactionClient)} as unknown as PrismaClient;
 return {service:new AreasService(db),calls};
}
const input={name:"Area",latitude:-3,longitude:-38,municipality:null,state:null,landType:null,description:null};
it("scopes queries to laboratory and serializes without private fields or legacy active filtering",async()=>{
 const {service,calls}=setup();const list=await service.list("server-user",lab);const detail=await service.detail("server-user",lab,id);
 assert.deepEqual(calls[0].args,{where:{laboratoryRoomId:lab},orderBy:[{createdAt:"desc"},{id:"desc"}]});
 assert.deepEqual(calls[1].args,{where:{id,laboratoryRoomId:lab}});
 assert.equal(list.areas[0].latitude,-3);assert.equal(Object.hasOwn(detail.area,"userId"),false);assert.equal(Object.hasOwn(detail.area,"isActive"),false);
});
it("rechecks eligibility, membership, role and inactivity before a write",async()=>{
 for(const [role,active,linked,status,code] of [["MEMBER",true,true,"ACTIVE","FORBIDDEN"],["OWNER",false,true,"ACTIVE","READ_ONLY"],["MEMBER",false,true,"ACTIVE","READ_ONLY"],["OWNER",true,false,"ACTIVE","NOT_FOUND"],["OWNER",true,true,"BLOCKED","UNAUTHENTICATED"]] as const){
 const {service,calls}=setup(role,active,linked,status);await assert.rejects(service.create("server-user",lab,input),(e)=>e instanceof AreaAccessError&&e.code===code);assert.equal(calls.length,0);
 }
});
it("derives creator and laboratory in the transaction",async()=>{
 const {service,calls}=setup("ADMIN");await service.create("server-user",lab,input);
 const args=calls[0].args as {data:{userId:string;laboratoryRoomId:string}};
 assert.equal(args.data.userId,"server-user");assert.equal(args.data.laboratoryRoomId,lab);
});
