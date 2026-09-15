import assert from "node:assert/strict";
import { it } from "node:test";
import { parseAreaInput } from "../../src/app/api/server/areas/area.contracts";
it("normalizes minimal input, optional blanks, and preserves exact coordinate bounds",()=>{
 assert.deepEqual(parseAreaInput({name:"  Test  area  ",latitude:-90,longitude:180}),{name:"Test area",latitude:-90,longitude:180,municipality:null,state:null,landType:null,description:null});
});
it("rejects invalid coordinates and any privileged or unknown key",()=>{
 for(const value of [NaN,Infinity,-Infinity,"0",null,undefined,91,-91])assert.equal(parseAreaInput({name:"Area",latitude:value,longitude:0}),null);
 for(const key of ["userId","laboratoryRoomId","laboratoryId","creator","id","isActive","cep","image"])assert.equal(parseAreaInput({name:"Area",latitude:0,longitude:0,[key]:"forged"}),null);
 for(const name of ["", " ","x".repeat(101)])assert.equal(parseAreaInput({name,latitude:0,longitude:0}),null);
 assert.equal(parseAreaInput({name:"Area",latitude:0,longitude:181}),null);
 assert.equal(parseAreaInput({name:"Area",latitude:0,longitude:0,description:"x".repeat(2001)}),null);
});
