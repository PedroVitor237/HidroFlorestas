import assert from "node:assert/strict";
import { describe, it } from "node:test";

import bcrypt from "bcrypt";

import {
  AuthService,
  type AuthServiceDependencies,
} from "../../src/app/api/server/services/auth.service";

const baseUser = {
  id: "user-1",
  firstName: "Ana",
  lastName: "Silva",
  image: "avatar.png",
  password: "stored-hash",
  status: "ACTIVE",
  role: "USER" as const,
};

function dependencies(
  overrides: Partial<AuthServiceDependencies> = {},
): AuthServiceDependencies {
  return {
    findCredentialUser: async () => baseUser,
    comparePassword: async () => true,
    issueToken: () => "signed-token",
    ...overrides,
  };
}

describe("AuthService.signIn", () => {
  it("uses bcrypt-compatible comparison and returns only public user fields", async () => {
    const hash = await bcrypt.hash("correct-password", 4);
    const service = new AuthService(
      dependencies({
        findCredentialUser: async () => ({ ...baseUser, password: hash }),
        comparePassword: bcrypt.compare,
      }),
    );

    const result = await service.signIn({
      email: "active@example.test",
      password: "correct-password",
    });

    assert.deepEqual(result, {
      success: true,
      token: "signed-token",
      user: {
        firstName: "Ana",
        lastName: "Silva",
        image: "avatar.png",
      },
      destination: "/workspace",
    });
    assert.deepEqual(Object.keys(result.success ? result.user : {}).sort(), [
      "firstName",
      "image",
      "lastName",
    ]);
  });

  it("routes only a successfully authenticated global ADMIN to the admin area", async () => {
    for (const role of ["ADMIN", "USER", "DEVELOPER", "MODERATOR"] as const) {
      const service = new AuthService(
        dependencies({ findCredentialUser: async () => ({ ...baseUser, role }) }),
      );
      const result = await service.signIn({
        email: `${role.toLowerCase()}@example.test`,
        password: "correct-password",
      });

      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.destination, role === "ADMIN" ? "/admin" : "/workspace");
      }
    }
  });

  it("returns the same failure for an absent user and an incorrect password", async () => {
    const absent = new AuthService(
      dependencies({ findCredentialUser: async () => null }),
    );
    const wrongPassword = new AuthService(
      dependencies({ comparePassword: async () => false }),
    );

    assert.deepEqual(
      await absent.signIn({ email: "missing@example.test", password: "secret" }),
      { success: false, reason: "INVALID_CREDENTIALS" },
    );
    assert.deepEqual(
      await wrongPassword.signIn({
        email: "active@example.test",
        password: "wrong",
      }),
      { success: false, reason: "INVALID_CREDENTIALS" },
    );
  });

  it("accepts only exact ACTIVE and uniformly rejects the other states", async () => {
    for (const status of ["PENDING", "BLOCKED", "INACTIVE", "active"]) {
      const service = new AuthService(
        dependencies({
          findCredentialUser: async () => ({ ...baseUser, status }),
        }),
      );

      assert.deepEqual(
        await service.signIn({
          email: `${status}@example.test`,
          password: "correct-password",
        }),
        { success: false, reason: "INVALID_CREDENTIALS" },
      );
    }
  });

  it("turns repository, comparison, and token failures into internal errors", async () => {
    for (const overrides of [
      {
        findCredentialUser: async () => {
          throw new Error("database detail");
        },
      },
      {
        comparePassword: async () => {
          throw new Error("bcrypt detail");
        },
      },
      {
        issueToken: () => {
          throw new Error("secret detail");
        },
      },
    ]) {
      const service = new AuthService(dependencies(overrides));
      assert.deepEqual(
        await service.signIn({
          email: "active@example.test",
          password: "correct-password",
        }),
        { success: false, reason: "INTERNAL_ERROR" },
      );
    }
  });
});
