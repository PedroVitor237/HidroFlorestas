import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

import { NextRequest } from "next/server";

import { config, proxy } from "../../src/proxy";

function request(pathname: string, token?: string) {
  return new NextRequest(`http://localhost${pathname}`, {
    headers: token ? { cookie: `auth_token=${token}` } : undefined,
  });
}

describe("optimistic auth proxy", () => {
  it("redirects missing cookies in both complete private trees", async () => {
    for (const pathname of [
      "/workspace",
      "/workspace/nested",
      "/dashboard",
      "/dashboard/nested",
    ]) {
      const response = await proxy(request(pathname));
      assert.equal(response.status, 307, pathname);
      assert.equal(response.headers.get("location"), "http://localhost/login");
    }
  });

  it("only passes arbitrary cookie presence optimistically", async () => {
    for (const pathname of ["/workspace", "/dashboard/nested"]) {
      const response = await proxy(request(pathname, "not-a-valid-jwt"));
      assert.equal(response.headers.get("x-middleware-next"), "1", pathname);
    }
  });

  it("keeps login public even when an arbitrary cookie is present", async () => {
    const response = await proxy(request("/login", "not-a-valid-jwt"));
    assert.equal(response.headers.get("x-middleware-next"), "1");
  });

  it("matches only the two protected route trees", () => {
    assert.deepEqual(config.matcher, [
      "/dashboard/:path*",
      "/workspace/:path*",
    ]);
  });

  it("contains no database or authoritative authentication dependency", async () => {
    const source = await readFile(new URL("../../src/proxy.ts", import.meta.url), "utf8");
    assert.doesNotMatch(source, /prisma|requireAuth|users\.service|auth\.core/i);
  });
});
