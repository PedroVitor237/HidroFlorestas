import { requireAuth, AuthBoundaryError } from "../middlewares/auth.middleware";
import { AreaAccessError } from "../areas/area.authorization";
import { CollectionContractError, parseIdempotencyKey } from "../collections/collection.contracts";
import { EnvironmentalServiceError, type EnvironmentalDataService } from "../services/environmental-data.service";
import { EnvironmentalValidationError, parseEnvironmentalInput } from "./environmental-data.contracts";
import type { EnvironmentalContext } from "@/types/environmental-data.type";
type Context={params:Promise<EnvironmentalContext>};
const messages={INVALID_REQUEST:'Verifique os campos indicados.',UNAUTHENTICATED:'Autenticação necessária.',FORBIDDEN:'Conta sem permissão para esta operação.',NOT_FOUND:'Recurso não encontrado.',READ_ONLY:'O laboratório está em modo somente leitura.',CONFLICT:'Já existe um conjunto confirmado ou a chave foi usada com outros dados.',INTERNAL_ERROR:'Não foi possível concluir a operação.'};
function json(body:unknown,status:number,headers:Record<string,string>={}){return Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}});}
function failure(error:unknown){
 let code:keyof typeof messages='INTERNAL_ERROR';let status=500;
 if(error instanceof EnvironmentalValidationError || error instanceof CollectionContractError){code='INVALID_REQUEST';status=400;}
 else if(error instanceof AuthBoundaryError && error.code==='UNAUTHORIZED'){code='UNAUTHENTICATED';status=401;}
 else if(error instanceof AreaAccessError || error instanceof EnvironmentalServiceError){
  const mapping={UNAUTHENTICATED:401,FORBIDDEN:403,NOT_FOUND:404,READ_ONLY:409,CONFLICT:409,INTERNAL_ERROR:500,INVALID_INPUT:400};
  code=error.code==='INVALID_INPUT'?'INVALID_REQUEST':error.code;status=mapping[error.code];
 }
 return json({error:{code,message:messages[code],...(error instanceof EnvironmentalValidationError?{details:{fields:error.fields}}:{})}},status);
}
export function createEnvironmentalHandlers(dependencies:{requireAuth:typeof requireAuth;service:Pick<EnvironmentalDataService,'create'|'detail'>}){
 return {
  POST:async(request:Request,context:Context)=>{try{
   const principal=await dependencies.requireAuth();const ids=await context.params;
   const confirmationKey=parseIdempotencyKey(request.headers.get('Idempotency-Key'));
   if(request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase()!=='application/json')throw new EnvironmentalValidationError({form:'Envie JSON.'});
   let body:unknown;try{body=await request.json();}catch{throw new EnvironmentalValidationError({form:'JSON inválido.'});}
   const payload=parseEnvironmentalInput(body);
   const result=await dependencies.service.create({...ids,userId:principal.id,confirmationKey,payload});
   return json({environmentalData:result.environmentalData},result.created?201:200,{Location:`/api/laboratories/${ids.laboratoryId}/areas/${ids.areaId}/collections/${ids.collectionId}/environmental-data`});
  }catch(error){return failure(error);}},
  GET:async(_request:Request,context:Context)=>{try{const principal=await dependencies.requireAuth();return json(await dependencies.service.detail(principal.id,await context.params),200);}catch(error){return failure(error);}},
 };
}
