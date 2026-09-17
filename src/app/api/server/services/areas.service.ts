import { Prisma, type PrismaClient } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { AreaAccessError, authorizeLaboratoryAccess, validResourceId } from "../areas/area.authorization";
import { parseAreaInput, serializeAreaDetail, serializeAreaSummary, type CreateAreaInput } from "../areas/area.contracts";
export class AreasService {
 constructor(private readonly db:PrismaClient=prisma){}
 async create(userId:string,laboratoryId:string,input:CreateAreaInput){
  const parsed=parseAreaInput(input);if(!parsed)throw new AreaAccessError("INVALID_INPUT");
  return this.db.$transaction(async tx=>{
   const context=await authorizeLaboratoryAccess({id:userId},laboratoryId,"CREATE_AREA",tx,true);
   const area=await tx.collectionArea.create({data:{...parsed,latitude:new Prisma.Decimal(parsed.latitude).toDecimalPlaces(6),longitude:new Prisma.Decimal(parsed.longitude).toDecimalPlaces(6),userId,laboratoryRoomId:laboratoryId}});
   return {area:serializeAreaDetail(area,context)};
  },{isolationLevel:"Serializable"});
 }
 async list(userId:string,laboratoryId:string){
  return this.db.$transaction(async tx=>{
   const context=await authorizeLaboratoryAccess({id:userId},laboratoryId,"READ_AREAS",tx);
   const areas=await tx.collectionArea.findMany({where:{laboratoryRoomId:laboratoryId},orderBy:[{createdAt:"desc"},{id:"desc"}]});
   return {context,areas:areas.map(serializeAreaSummary)};
  });
 }
 async detail(userId:string,laboratoryId:string,areaId:string){
  return this.db.$transaction(async tx=>{
   const context=await authorizeLaboratoryAccess({id:userId},laboratoryId,"READ_AREAS",tx);
   if(!validResourceId(areaId))throw new AreaAccessError("NOT_FOUND");
   const area=await tx.collectionArea.findFirst({where:{id:areaId,laboratoryRoomId:laboratoryId}});
   if(!area)throw new AreaAccessError("NOT_FOUND");return {area:serializeAreaDetail(area,context)};
  });
 }
}
export const areasService=new AreasService();
