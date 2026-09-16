import assert from "node:assert/strict";
import { it } from "node:test";
import type { Prisma, PrismaClient } from "../../src/generated/prisma";
import { LaboratoryMembershipsService } from "../../src/app/api/server/services/laboratory-memberships.service";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
const lab="00000000-0000-4000-8000-000000000311",member="00000000-0000-4000-8000-000000000321";
it("protects OWNER and uses expectedRole compare-and-set scoped to the same laboratory",async()=>{
 let targetRole="MEMBER",count=1;const calls:unknown[]=[];
 const tx={user:{findUnique:async()=>({status:"ACTIVE"})},researchersLinked:{findUnique:async()=>({role:"OWNER",laboratoryRoom:{id:lab,name:"Lab",isActive:true}}),findFirst:async()=>({id:member,role:targetRole,user:{firstName:"A",lastName:"B"}}),updateMany:async(args:unknown)=>{calls.push(args);return {count};}}};
 const db={$transaction:async(run:(tx:Prisma.TransactionClient)=>unknown)=>run(tx as unknown as Prisma.TransactionClient)} as unknown as PrismaClient;
 const service=new LaboratoryMembershipsService(db);
 const result=await service.change("owner",lab,member,{expectedRole:"MEMBER",role:"ADMIN"});assert.deepEqual(result.membership,{id:member,role:"ADMIN",name:"A B",initials:"AB"});
 assert.deepEqual(calls[0],{where:{id:member,laboratoryRoomId:lab,role:"MEMBER"},data:{role:"ADMIN"}});
 count=0;await assert.rejects(service.change("owner",lab,member,{expectedRole:"MEMBER",role:"ADMIN"}),(e)=>e instanceof AreaAccessError&&e.code==="CONFLICT");
 targetRole="OWNER";const before=calls.length;await assert.rejects(service.change("owner",lab,member,{expectedRole:"MEMBER",role:"ADMIN"}));assert.equal(calls.length,before);
});
