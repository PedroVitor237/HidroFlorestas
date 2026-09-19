import assert from "node:assert/strict";
import { it } from "node:test";
import { compareHistory, decodeHistoryCursor, encodeHistoryCursor, DashboardError } from "../../src/app/api/server/dashboard/dashboard.contracts";
import type { DashboardHistoryItem } from "../../src/types/dashboard.type";
const areaId = "10000000-0000-4000-8000-000000000201";
const collectionId = "10000000-0000-4000-8000-000000000301";
const area: DashboardHistoryItem = { id:`AREA_CREATED:${areaId}`, type:"AREA_CREATED", label:"Área criada", eventAt:"2026-09-18T12:00:00.000Z", area:{id:areaId,name:"Área"}, destination:`/dashboard/laboratories/10000000-0000-4000-8000-000000000101/areas/${areaId}` };
const collection: DashboardHistoryItem = { id:`COLLECTION_CONFIRMED:${collectionId}`, type:"COLLECTION_CONFIRMED", label:"Coleta confirmada", eventAt:area.eventAt, occurredAt:"2026-09-18T10:00:00.000Z", area:area.area, collection:{id:collectionId}, destination:`${area.destination}/collections/${collectionId}` };
it("round-trips a versioned opaque cursor",()=>{ const encoded=encodeHistoryCursor(collection); assert.equal(encoded.includes(collectionId),false); assert.deepEqual(decodeHistoryCursor(encoded),{version:1,eventAt:collection.eventAt,type:collection.type,sourceId:collectionId}); });
it("rejects malformed, unknown and extended cursors",()=>{ for(const value of ["!",Buffer.from(JSON.stringify({version:2,eventAt:area.eventAt,type:area.type,sourceId:areaId})).toString("base64url"),Buffer.from(JSON.stringify({version:1,eventAt:area.eventAt,type:area.type,sourceId:areaId,userId:"secret"})).toString("base64url")]) assert.throws(()=>decodeHistoryCursor(value),(error)=>error instanceof DashboardError&&error.code==="INVALID_CURSOR"); });
it("orders event time, type and source id deterministically",()=>{ const older={...area,eventAt:"2026-09-17T12:00:00.000Z"}; assert.deepEqual([older,collection,area].sort(compareHistory).map((item)=>item.id),[area.id,collection.id,older.id]); });

