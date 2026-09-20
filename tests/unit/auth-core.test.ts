import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  authenticateCredentials,
  authenticateSession,
  type AuthenticatedPrincipal,
  type CredentialUser,
  type CurrentIdentity,
} from "../../src/app/api/server/auth/auth.core";

const credentialUser: CredentialUser = {
  id: "user-1",
  firstName: "Ana",
  lastName: "Silva",
  image: "avatar.png",
  password: "stored-hash",
  status: "ACTIVE",
  role: "ADMIN",
  isAdmin: true,
};

const identity: CurrentIdentity = {
  id: credentialUser.id,
  firstName: credentialUser.firstName,
  lastName: credentialUser.lastName,
  image: credentialUser.image,
  status: credentialUser.status,
  role: credentialUser.role,
  isAdmin: credentialUser.isAdmin,
};

const principal: AuthenticatedPrincipal = {
  id: "user-1",
  firstName: "Ana",
  lastName: "Silva",
  image: "avatar.png",
  role: "ADMIN",
  isAdmin: true,
};

describe("authentication core", () => {
  it("authenticates credentials only after password and strict ACTIVE checks", async () => {
    const calls: string[] = [];
    const result = await authenticateCredentials(
      { email: "active@example.test", password: "secret" },
      {
        findCredentialUser: async () => {
          calls.push("find");
          return credentialUser;
        },
        comparePassword: async () => {
          calls.push("compare");
          return true;
        },
        issueToken: (userId) => {
          calls.push(`issue:${userId}`);
          return "signed-token";
        },
      },
    );

    assert.deepEqual(calls, ["find", "compare", "issue:user-1"]);
    assert.deepEqual(result, {
      success: true,
      token: "signed-token",
      principal,
    });
  });

  it("uses one credential failure for absent users and wrong passwords", async () => {
    const absent = await authenticateCredentials(
      { email: "missing@example.test", password: "secret" },
      {
        findCredentialUser: async () => null,
        comparePassword: async () => true,
        issueToken: () => "must-not-run",
      },
    );
    const wrongPassword = await authenticateCredentials(
      { email: "active@example.test", password: "wrong" },
      {
        findCredentialUser: async () => credentialUser,
        comparePassword: async () => false,
        issueToken: () => "must-not-run",
      },
    );

    assert.deepEqual(absent, { success: false, reason: "INVALID_CREDENTIALS" });
    assert.deepEqual(wrongPassword, {
      success: false,
      reason: "INVALID_CREDENTIALS",
    });
  });

  it("rejects every status except exact ACTIVE without issuing a token", async () => {
    for (const status of ["PENDING", "BLOCKED", "INACTIVE", "active"]) {
      let issued = false;
      const result = await authenticateCredentials(
        { email: "user@example.test", password: "secret" },
        {
          findCredentialUser: async () => ({ ...credentialUser, status }),
          comparePassword: async () => true,
          issueToken: () => {
            issued = true;
            return "token";
          },
        },
      );

      assert.deepEqual(result, {
        success: false,
        reason: "INVALID_CREDENTIALS",
      });
      assert.equal(issued, false);
    }
  });

  it("converts dependency failures to an internal failure", async () => {
    const result = await authenticateCredentials(
      { email: "active@example.test", password: "secret" },
      {
        findCredentialUser: async () => {
          throw new Error("database detail");
        },
        comparePassword: async () => true,
        issueToken: () => "token",
      },
    );

    assert.deepEqual(result, { success: false, reason: "INTERNAL_ERROR" });
  });

  it("restores a session only for a valid token and a current ACTIVE user", async () => {
    const result = await authenticateSession("token", {
      verifyToken: () => ({ userId: "user-1" }),
      findCurrentIdentity: async (id) => {
        assert.equal(id, "user-1");
        return identity;
      },
    });

    assert.deepEqual(result, { success: true, principal });
  });

  it("rejects absent/invalid tokens, orphan users, and every ineligible state", async () => {
    const absent = await authenticateSession(undefined, {
      verifyToken: () => ({ userId: "user-1" }),
      findCurrentIdentity: async () => identity,
    });
    const invalid = await authenticateSession("token", {
      verifyToken: () => null,
      findCurrentIdentity: async () => identity,
    });
    const orphan = await authenticateSession("token", {
      verifyToken: () => ({ userId: "missing" }),
      findCurrentIdentity: async () => null,
    });

    for (const result of [absent, invalid, orphan]) {
      assert.deepEqual(result, { success: false, reason: "UNAUTHENTICATED" });
    }

    for (const status of ["PENDING", "BLOCKED", "INACTIVE"]) {
      assert.deepEqual(
        await authenticateSession("token", {
          verifyToken: () => ({ userId: "user-1" }),
          findCurrentIdentity: async () => ({ ...identity, status }),
        }),
        { success: false, reason: "UNAUTHENTICATED" },
      );
    }
  });

  it("fails closed on verification and repository errors", async () => {
    const verificationFailure = await authenticateSession("token", {
      verifyToken: () => {
        throw new Error("missing secret");
      },
      findCurrentIdentity: async () => identity,
    });
    const repositoryFailure = await authenticateSession("token", {
      verifyToken: () => ({ userId: "user-1" }),
      findCurrentIdentity: async () => {
        throw new Error("database detail");
      },
    });

    assert.deepEqual(verificationFailure, {
      success: false,
      reason: "INTERNAL_ERROR",
    });
    assert.deepEqual(repositoryFailure, {
      success: false,
      reason: "INTERNAL_ERROR",
    });
  });
});
