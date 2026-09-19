import type { Prisma, PrismaClient } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { AreaAccessError, authorizeLaboratoryAccess, validResourceId, type LaboratoryContext } from "../areas/area.authorization";
import { hashPayload, parseEnvironmentalInput } from "../environmental-data/environmental-data.contracts";
import { MEASUREMENT_CONTRACT_VERSION, type EnvironmentalContext, type EnvironmentalPayload, type PublicEnvironmentalData } from "@/types/environmental-data.type";
export type MeasurementRecord = { id:string; collectionDataId:string; userId:string; measurementContractVersion:string; payload:unknown; payloadHash:string; confirmationKey:string; confirmedAt:Date };
export type MeasurementTransaction = {
 raw?: Prisma.TransactionClient;
 findCollection(context:EnvironmentalContext):Promise<boolean>;
 findByKey(userId:string,key:string):Promise<MeasurementRecord|null>;
 findByCollection(collectionId:string):Promise<MeasurementRecord|null>;
 create(record:MeasurementRecord):Promise<MeasurementRecord>;
};
export type MeasurementStore = { transaction<T>(fn:(tx:MeasurementTransaction)=>Promise<T>):Promise<T> };
export type MeasurementAuthorization = (userId:string,laboratoryId:string,tx:MeasurementTransaction,write:boolean)=>Promise<LaboratoryContext>;
export type MeasurementCommand = EnvironmentalContext & {userId:string;confirmationKey:string;payload:EnvironmentalPayload};
export class EnvironmentalServiceError extends Error { constructor(public readonly code:"NOT_FOUND"|"CONFLICT"|"INTERNAL_ERROR"|"FORBIDDEN") { super(code); } }
export class EnvironmentalDataService {
 constructor(private readonly dependencies:{store:MeasurementStore;authorize:MeasurementAuthorization;clock:()=>Date;createId:()=>string}) {}
 async create(command:MeasurementCommand):Promise<{created:boolean;environmentalData:PublicEnvironmentalData}> {
  const payload=parseEnvironmentalInput(command.payload); const payloadHash=hashPayload(payload);
  for(let attempt=0;attempt<3;attempt++) {
   try { return await this.dependencies.store.transaction(async tx=>{
    const access=await this.dependencies.authorize(command.userId,command.laboratoryId,tx,true);
    await this.assertContext(tx,command);
    const existing=await tx.findByKey(command.userId,command.confirmationKey);
    if(existing) {
     if(existing.collectionDataId!==command.collectionId || existing.payloadHash!==payloadHash || existing.measurementContractVersion!==MEASUREMENT_CONTRACT_VERSION)throw new EnvironmentalServiceError("CONFLICT");
     return {created:false,environmentalData:project(existing,access)};
    }
    if(await tx.findByCollection(command.collectionId))throw new EnvironmentalServiceError("CONFLICT");
    const record=await tx.create({id:this.dependencies.createId(),collectionDataId:command.collectionId,userId:command.userId,measurementContractVersion:MEASUREMENT_CONTRACT_VERSION,payload,payloadHash,confirmationKey:command.confirmationKey,confirmedAt:this.dependencies.clock()});
    return {created:true,environmentalData:project(record,access)};
   }); } catch(error) {
    if(error instanceof AreaAccessError || error instanceof EnvironmentalServiceError)throw error;
    if(error && typeof error==='object' && 'code' in error && ['P2002','P2034'].includes(String(error.code)) && attempt<2)continue;
    throw new EnvironmentalServiceError("INTERNAL_ERROR");
   }
  }
  throw new EnvironmentalServiceError("INTERNAL_ERROR");
 }
 private async assertContext(tx:MeasurementTransaction,context:EnvironmentalContext) {
  if(![context.laboratoryId,context.areaId,context.collectionId].every(validResourceId)||!await tx.findCollection(context))throw new EnvironmentalServiceError("NOT_FOUND");
 }
 async detail(userId:string,context:EnvironmentalContext):Promise<{environmentalData:PublicEnvironmentalData|null}> {
  try { return await this.dependencies.store.transaction(async tx=>{
   const access=await this.dependencies.authorize(userId,context.laboratoryId,tx,false);
   await this.assertContext(tx,context);
   const record=await tx.findByCollection(context.collectionId);
   return {environmentalData:record?project(record,access):null};
  }); } catch(error) {
   if(error instanceof AreaAccessError || error instanceof EnvironmentalServiceError)throw error;
   throw new EnvironmentalServiceError("INTERNAL_ERROR");
  }
 }
}
function project(record:MeasurementRecord,access:LaboratoryContext):PublicEnvironmentalData {
 if(record.measurementContractVersion!==MEASUREMENT_CONTRACT_VERSION)throw new EnvironmentalServiceError("INTERNAL_ERROR");
 return {id:record.id,collectionId:record.collectionDataId,measurementContractVersion:MEASUREMENT_CONTRACT_VERSION,confirmedAt:record.confirmedAt.toISOString(),readOnly:access.readOnly,...parseEnvironmentalInput(record.payload)};
}
export class PrismaMeasurementStore implements MeasurementStore {
 constructor(private readonly db:PrismaClient=prisma){}
 transaction<T>(fn:(tx:MeasurementTransaction)=>Promise<T>) {
  return this.db.$transaction(async raw=>fn({raw,
   findCollection:async c=>Boolean(await raw.collectionData.findFirst({where:{id:c.collectionId,collectionAreaId:c.areaId,laboratoryRoomId:c.laboratoryId,confirmedAt:{not:null},occurredAt:{not:null},occurrenceOffset:{not:null},confirmationKey:{not:null}},select:{id:true}})),
   findByKey:async(userId,confirmationKey)=>raw.environmentalMeasurementSet.findUnique({where:{userId_confirmationKey:{userId,confirmationKey}}}),
   findByCollection:async collectionDataId=>raw.environmentalMeasurementSet.findUnique({where:{collectionDataId}}),
   create:async record=>raw.environmentalMeasurementSet.create({data:{...record,payload:record.payload as Prisma.InputJsonValue}}),
  }),{isolationLevel:'Serializable',maxWait:15000,timeout:30000});
 }
}
export const measurementAuthorization:MeasurementAuthorization=async(userId,laboratoryId,tx,write)=>{
 if(!tx.raw)throw new EnvironmentalServiceError('INTERNAL_ERROR');
 const identity=await tx.raw.user.findUnique({where:{id:userId},select:{status:true}});
 if(!identity || identity.status!=='ACTIVE')throw new EnvironmentalServiceError('FORBIDDEN');
 return authorizeLaboratoryAccess({id:userId},laboratoryId,write?'CREATE_ENVIRONMENTAL_DATA':'READ_ENVIRONMENTAL_DATA',tx.raw,write);
};
export const environmentalDataService=new EnvironmentalDataService({store:new PrismaMeasurementStore(),authorize:measurementAuthorization,clock:()=>new Date(),createId:()=>crypto.randomUUID()});
