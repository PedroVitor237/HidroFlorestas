import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { it } from "node:test";
import { parse } from "yaml";
const doc=parse(readFileSync('specs/003-area-registration-and-viewing/contracts/area-registration-api.openapi.yaml','utf8'));
it("declares five unique operations, local references, closed DTOs and sanitized failures",()=>{
 assert.equal(doc.openapi,'3.1.0');const ids:string[]=[];
 const walk=(node:unknown)=>{if(!node||typeof node!=='object')return;for(const [key,value] of Object.entries(node)){if(key==='$ref'){assert.equal(typeof value,'string');const parts=(value as string).split('/');assert.equal(parts.shift(),'#');let resolved=doc;for(const part of parts)resolved=resolved?.[part];assert.ok(resolved,`Unresolved ref ${value}`);}else walk(value);}};
 walk(doc);
 for(const path of Object.values(doc.paths) as Record<string, {operationId:string;responses:Record<string,unknown>}>[]){for(const operation of Object.values(path)){ids.push(operation.operationId);assert.ok(operation.responses['500']);}}
 assert.equal(ids.length,5);assert.equal(new Set(ids).size,5);
 for(const name of ['Membership','CreateAreaInput','AreaSummary','AreaDetail','LaboratoryContext'])assert.equal(doc.components.schemas[name].additionalProperties,false);
 for(const name of ['AreaSummary','AreaDetail'])for(const key of ['userId','creator','email','accessCode','cep','isActive'])assert.equal(key in doc.components.schemas[name].properties,false);
 assert.equal(doc.components.schemas.InternalErrorResponse.properties.error.properties.code.const,'INTERNAL_ERROR');
});
it("provides concrete success examples for each public response",()=>{
 for(const name of ['MembershipListResponse','MembershipMutationResponse','AreaListResponse','AreaDetailResponse','AreaMutationResponse'])assert.ok(doc.components.schemas[name].examples?.length,`Missing example: ${name}`);
});
