import type { SignInInput } from "./auth.contracts";
import type { SessionTokenPayload } from "./session";

export type CredentialUser = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  password: string;
  status: string;
  role: "USER" | "ADMIN" | "DEVELOPER" | "MODERATOR";
};

export type CurrentIdentity = Omit<CredentialUser, "password">;

export type AuthenticatedPrincipal = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  role: "USER" | "ADMIN" | "DEVELOPER" | "MODERATOR";
};

type CredentialDependencies = {
  findCredentialUser: (email: string) => Promise<CredentialUser | null>;
  comparePassword: (plainText: string, hash: string) => Promise<boolean>;
  issueToken: (userId: string) => string;
};

type SessionDependencies = {
  verifyToken: (token: string) => SessionTokenPayload | null;
  findCurrentIdentity: (id: string) => Promise<CurrentIdentity | null>;
};

export type CredentialAuthenticationResult =
  | {
      success: true;
      token: string;
      principal: AuthenticatedPrincipal;
    }
  | { success: false; reason: "INVALID_CREDENTIALS" | "INTERNAL_ERROR" };

export type SessionAuthenticationResult =
  | { success: true; principal: AuthenticatedPrincipal }
  | { success: false; reason: "UNAUTHENTICATED" | "INTERNAL_ERROR" };

function toPrincipal(user: CurrentIdentity): AuthenticatedPrincipal {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
    role: user.role,
  };
}

export async function authenticateCredentials(
  input: SignInInput,
  dependencies: CredentialDependencies,
): Promise<CredentialAuthenticationResult> {
  try {
    const user = await dependencies.findCredentialUser(input.email);
    if (!user) {
      return { success: false, reason: "INVALID_CREDENTIALS" };
    }

    const passwordMatches = await dependencies.comparePassword(
      input.password,
      user.password,
    );
    if (!passwordMatches || user.status !== "ACTIVE") {
      return { success: false, reason: "INVALID_CREDENTIALS" };
    }

    const principal = toPrincipal(user);
    const token = dependencies.issueToken(user.id);
    return { success: true, token, principal };
  } catch {
    return { success: false, reason: "INTERNAL_ERROR" };
  }
}

export async function authenticateSession(
  token: string | undefined,
  dependencies: SessionDependencies,
): Promise<SessionAuthenticationResult> {
  if (!token) {
    return { success: false, reason: "UNAUTHENTICATED" };
  }

  try {
    const payload = dependencies.verifyToken(token);
    if (!payload) {
      return { success: false, reason: "UNAUTHENTICATED" };
    }

    const user = await dependencies.findCurrentIdentity(payload.userId);
    if (!user || user.status !== "ACTIVE") {
      return { success: false, reason: "UNAUTHENTICATED" };
    }

    return { success: true, principal: toPrincipal(user) };
  } catch {
    return { success: false, reason: "INTERNAL_ERROR" };
  }
}
