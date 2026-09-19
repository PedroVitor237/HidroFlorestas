import type { EnvironmentalPayload } from "@/types/environmental-data.type";
import { ENVIRONMENTAL_FIELDS, parseEnvironmentalInput } from "@/types/environmental-data.validation";
export type EnvironmentalFormState=Record<string,string>;
export type Submission={key:string;canonical:string;payload:EnvironmentalPayload};
export function emptyEnvironmentalForm():EnvironmentalFormState {return Object.fromEntries(Object.entries(ENVIRONMENTAL_FIELDS).flatMap(([group,fields])=>Object.keys(fields).map(key=>[`${group}.${key}`,''])));}
export function formToPayload(form:EnvironmentalFormState) {
 const payload:Record<string,Record<string,unknown>>={};
 for(const [group,fields] of Object.entries(ENVIRONMENTAL_FIELDS)) {
  payload[group]={};for(const [key,rule] of Object.entries(fields)) {
   const value=form[`${group}.${key}`]?.trim()??'';
   payload[group][key]=value===''?null:rule.type==='number'?(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)?Number(value):NaN):rule.type==='boolean'?(value==='true'?true:value==='false'?false:value):value;
  }
 }
 return parseEnvironmentalInput(payload);
}
export function prepareSubmission(payload:EnvironmentalPayload,previous:Submission|null,newKey=()=>crypto.randomUUID()):Submission {
 const canonical=JSON.stringify(payload);
 return previous?.canonical===canonical?previous:{key:newKey(),canonical,payload};
}
