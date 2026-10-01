import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  authenticatedDestination,
  parseSignInInput,
  serializePublicUser,
} from "../../src/app/api/server/auth/auth.contracts";
import { parseAuthEnvelope } from "../../src/types/auth.type";

describe("authentication contracts", () => {
  it("accepts only email and password, trims email, and preserves the password", () => {
    const result = parseSignInInput({
      email: "  active@example.test  ",
      password: " password with spaces ",
    });

    assert.deepEqual(result, {
      success: true,
      data: {
        email: "active@example.test",
        password: " password with spaces ",
      },
    });
  });

  it("accepts the approved minimum email syntax", () => {
    for (const email of ["a@b.co", "name+tag@example.com", "x@y.example.br"]) {
      assert.equal(
        parseSignInInput({ email, password: "secret" }).success,
        true,
        email,
      );
    }
  });

  it("rejects non-objects, arrays, unexpected keys, wrong types, and whitespace", () => {
    const invalidInputs: unknown[] = [
      null,
      [],
      "credentials",
      {},
      { email: "a@b.co" },
      { password: "secret" },
      { email: 1, password: "secret" },
      { email: "a@b.co", password: 1 },
      { email: "a@b.co", password: "secret", role: "ADMIN" },
      { email: "   ", password: "secret" },
      { email: "a@b.co", password: "   " },
    ];

    for (const input of invalidInputs) {
      assert.deepEqual(parseSignInInput(input), {
        success: false,
        failure: {
          success: false,
          code: "INVALID_REQUEST",
          message: "Informe um email e uma senha válidos.",
        },
      });
    }
  });

  it("rejects email forms outside the approved syntax", () => {
    for (const email of [
      "plainaddress",
      "@example.com",
      "user@",
      "user@example",
      "user @example.com",
      "user@exam ple.com",
    ]) {
      assert.equal(
        parseSignInInput({ email, password: "secret" }).success,
        false,
        email,
      );
    }
  });

  it("serializes an exact public allowlist without sensitive fields", () => {
    const internalUser = {
      id: "internal-id",
      email: "private@example.test",
      firstName: "Ana",
      lastName: "Silva",
      image: "avatar.png",
      password: "hash",
      status: "ACTIVE",
      role: "ADMIN",

      createdAt: new Date(),
      updatedAt: new Date(),
      token: "secret-token",
      confirmationKey: "private-key",
      collectionAreaId: "private-area",
    };
    const serialized = serializePublicUser(internalUser);

    assert.deepEqual(serialized, {
      firstName: "Ana",
      lastName: "Silva",
      image: "avatar.png",
    });
    assert.deepEqual(Object.keys(serialized).sort(), [
      "firstName",
      "image",
      "lastName",
    ]);
  });

  it("does not widen the IMP-001 public DTO for collection registration", () => {
    const internal = {
      firstName: "Ana", lastName: "Silva", image: "", id: "internal", email: "private@example.test",
      password: "hash", status: "ACTIVE", role: "USER",
      confirmationKey: "private", collectionAreaId: "private",
    };
    const serialized = serializePublicUser(internal);
    assert.deepEqual(serialized, { firstName: "Ana", lastName: "Silva", image: "" });
  });

  it("parses only exact public auth envelopes", () => {
    assert.deepEqual(
      parseAuthEnvelope({
        success: true,
        user: { firstName: "Ana", lastName: "Silva", image: "" },
      }),
      {
        success: true,
        user: { firstName: "Ana", lastName: "Silva", image: "" },
      },
    );
    assert.deepEqual(
      parseAuthEnvelope({
        success: true,
        user: { firstName: "Ana", lastName: "Silva", image: "" },
        destination: "/admin",
      }),
      {
        success: true,
        user: { firstName: "Ana", lastName: "Silva", image: "" },
        destination: "/admin",
      },
    );
    assert.equal(
      parseAuthEnvelope({
        success: true,
        user: { firstName: "Ana", lastName: "Silva", image: "" },
        destination: "/dashboard/admin/users",
      }),
      null,
    );
    assert.deepEqual(
      parseAuthEnvelope({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Faça login novamente.",
      }),
      {
        success: false,
        code: "UNAUTHENTICATED",
        message: "Faça login novamente.",
      },
    );
    assert.equal(
      parseAuthEnvelope({
        success: true,
        user: {
          firstName: "Ana",
          lastName: "Silva",
          image: "",
          role: "ADMIN",
        },
      }),
      null,
    );
  });

  it("derives a closed post-login destination from the global role", () => {
    assert.equal(authenticatedDestination("ADMIN"), "/admin");
    for (const role of ["USER", "DEVELOPER", "MODERATOR"] as const) {
      assert.equal(authenticatedDestination(role), "/workspace");
    }
  });
});
