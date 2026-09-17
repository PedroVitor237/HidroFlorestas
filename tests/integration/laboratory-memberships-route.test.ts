import assert from "node:assert/strict";
import { it } from "node:test";
import { createMembershipChangeHandler } from "../../src/app/api/laboratories/[laboratoryId]/memberships/[membershipId]/route";
import { createMembershipListHandler } from "../../src/app/api/laboratories/[laboratoryId]/memberships/route";
import { AreaAccessError } from "../../src/app/api/server/areas/area.authorization";
const principal = { id: "server-identity", firstName: "Test", lastName: "User", image: "", isAdmin: false };
const route = { params: Promise.resolve({ laboratoryId: "lab", membershipId: "membership" }) };
it("rejects forged identity and OWNER transitions before writes", async () => {
 let writes = 0;
 const handler = createMembershipChangeHandler({ requireAuth: async () => principal, service: { change: async () => { writes++; throw Error('not expected'); } } });
 for (const body of [{ role: "OWNER", expectedRole: "MEMBER" }, { role: "ADMIN", expectedRole: "MEMBER", userId: "forged" }]) {
 const response = await handler(new Request("http://localhost", { method: "PATCH", body: JSON.stringify(body) }), route);
 assert.equal(response.status, 400); assert.equal(response.headers.get("cache-control"), "no-store"); }
 assert.equal(writes, 0);
});
it("maps access errors and sanitizes internal failures on both routes", async () => {
 for (const [error,status] of [[new AreaAccessError("NOT_FOUND"),404],[new AreaAccessError("READ_ONLY"),409],[new AreaAccessError("FORBIDDEN"),403],[new Error("private database stack"),500]] as const) {
 const deps = { requireAuth: async () => principal, service: { list: async () => { throw error; }, change: async () => { throw error; } } };
 const responses = [await createMembershipListHandler(deps)(new Request("http://localhost"),route), await createMembershipChangeHandler(deps)(new Request("http://localhost",{method:"PATCH",body:JSON.stringify({expectedRole:"MEMBER",role:"ADMIN"})}),route)];
 for (const response of responses) { assert.equal(response.status,status); assert.equal(response.headers.get("cache-control"),"no-store"); assert.equal((await response.text()).includes("private database"),false); }
 }
});
