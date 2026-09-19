import assert from "node:assert/strict";
import { test } from "node:test";
import { harness, context } from "./environmental-data-service.test";
test('read returns null or exact allowlist, including inactive, and denies crossed/revoked',async()=>{
 const h=harness();assert.deepEqual(await h.service.detail('user',context),{environmentalData:null});
 const saved=await h.service.create(h.command);h.state.readOnly=true;
 assert.deepEqual(await h.service.detail('user',context),{environmentalData:{...saved.environmentalData,readOnly:true}});
 await assert.rejects(h.service.detail('user',{...context,collectionId:'00000000-0000-4000-8000-000000000999'}),{code:'NOT_FOUND'});
 h.state.revoked=true;await assert.rejects(h.service.detail('user',context),{code:'NOT_FOUND'});
});
