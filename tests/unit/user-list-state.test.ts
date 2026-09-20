import assert from "node:assert/strict";
import { it } from "node:test";
import { adminUserQuery, mergeUniquePage } from "../../src/components/user-administration/user-list-state";

it("normalizes list filters and keeps the opaque cursor in the request", () => {
  assert.equal(adminUserQuery({ search: "  Ana  ", role: "ADMIN", status: "ACTIVE", cursor: "opaque" }).toString(), "limit=25&search=Ana&role=ADMIN&status=ACTIVE&cursor=opaque");
});

it("appends pages without duplicate account controls", () => {
  assert.deepEqual(mergeUniquePage([{ id: "1", value: "old" }], [{ id: "1", value: "new" }, { id: "2", value: "next" }]), [{ id: "1", value: "new" }, { id: "2", value: "next" }]);
});
