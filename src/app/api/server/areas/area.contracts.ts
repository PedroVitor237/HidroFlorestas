import type { CollectionArea } from "@/generated/prisma";
import type { LaboratoryContext } from "./area.authorization";
import type { AreaDetailDto, AreaSummaryDto } from "@/types/area.type";
export type CreateAreaInput = { name: string; latitude: number; longitude: number; municipality: string|null; state: string|null; landType: string|null; description: string|null };
const keys=["name","latitude","longitude","municipality","state","landType","description"];
export function parseAreaInput(value: unknown): CreateAreaInput | null {
 if(typeof value!=="object"||value===null||Array.isArray(value))return null;
 const body=value as Record<string,unknown>;
 if(Object.keys(body).some(key=>!keys.includes(key)))return null;
 if(typeof body.latitude!=="number"||!Number.isFinite(body.latitude)||Math.abs(body.latitude)>90||typeof body.longitude!=="number"||!Number.isFinite(body.longitude)||Math.abs(body.longitude)>180)return null;
 const text=(value:unknown,limit:number):string|null|false=>{
  if(value===undefined||value===null)return null;if(typeof value!=="string")return false;
  const normalized=value.trim().replace(/\s+/g," ");return normalized.length>limit?false:normalized||null;
 };
 const name=text(body.name,100),municipality=text(body.municipality,100),state=text(body.state,100),landType=text(body.landType,100),description=text(body.description,2000);
 if(!name||municipality===false||state===false||landType===false||description===false)return null;
 return {name,latitude:body.latitude,longitude:body.longitude,municipality,state,landType,description};
}
export function serializeAreaSummary(area: CollectionArea): AreaSummaryDto {
 return {id:area.id,name:area.name,latitude:Number(area.latitude),longitude:Number(area.longitude),municipality:area.municipality,state:area.state};
}
export function serializeAreaDetail(area:CollectionArea,context:LaboratoryContext):AreaDetailDto {
 return {...serializeAreaSummary(area),landType:area.landType,description:area.description,createdAt:area.createdAt.toISOString(),laboratory:{id:context.id,name:context.name,status:context.status},readOnly:context.readOnly};
}
