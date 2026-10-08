import assert from "node:assert/strict";
import { describe, it } from "node:test";

import bcrypt from "bcrypt";

import {
  AuthService,
  type AuthServiceDependencies,
  type SignUpServiceDependencies,
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

describe("AuthService legacy repository adapter (explicit test injection)", () => {
  it("preserves ACTIVE/hash/public projection for the injected historical adapter; production uses atomic AccountService", async () => {
    const password = "participant-password";
    let created: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      image: string;
      password: string;
      status: string;
      role: "USER";
    } | null = null;
    const signUpDependencies: SignUpServiceDependencies = {
      getUserByEmail: async () => null,
      hashPassword: (plainText) => bcrypt.hash(plainText, 4),
      createUser: async (data) => {
        assert.deepEqual(Object.keys(data).sort(), [
          "email", "firstName", "lastName", "password", "status",
        ]);
        assert.equal(data.status, "ACTIVE");
        assert.notEqual(data.password, password);
        assert.equal(await bcrypt.compare(password, data.password), true);
        created = {
          id: "new-user",
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          image: "",
          password: data.password,
          status: data.status,
          role: "USER",
        };
        return created;
      },
      issueToken: () => "signup-token",
    };
    const service = new AuthService(
      dependencies({
        findCredentialUser: async () => created,
        comparePassword: bcrypt.compare,
      }),
      signUpDependencies,
    );

    const registration = await service.signUp({
      email: "new@example.test",
      firstName: "Ana",
      lastName: "Silva",
      password,
      status: "BLOCKED",
      role: "ADMIN",
    });

    assert.deepEqual(registration, {
      success: true,
      token: "signup-token",
      user: { firstName: "Ana", lastName: "Silva", image: "" },
    });
    assert.deepEqual(await service.signIn({
      email: "new@example.test",
      password,
    }), {
      success: true,
      token: "signed-token",
      user: { firstName: "Ana", lastName: "Silva", image: "" },
      destination: "/workspace",
    });
    assert.deepEqual(await service.signIn({
      email: "new@example.test",
      password: "incorrect-password",
    }), { success: false, reason: "INVALID_CREDENTIALS" });
  });
});

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
