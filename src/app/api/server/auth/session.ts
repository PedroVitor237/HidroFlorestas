import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "auth_token";
export const VERIFICATION_COOKIE_NAME = "verification_token";
export const AUTH_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const VERIFICATION_SESSION_TTL_SECONDS = 30 * 60;
export const SESSION_ISSUER = "hidroflorestas";
export type SessionPurpose = "session" | "email-verification";

export type SessionTokenPayload = {
  userId: string;
  credentialVersion?: number;
  purpose?: SessionPurpose;
};

type RuntimeEnvironment = Record<string, string | undefined>;

export function readJwtSecret(
  environment: RuntimeEnvironment = process.env,
): string {
  const secret = environment.JWT_SECRET;
  if (typeof secret !== "string" || secret.trim().length === 0) {
    throw new Error("JWT_SECRET is required");
  }

  return secret;
}

export function signSessionToken(
    userId: string,
    secret = readJwtSecret(),
    credentialVersion = 0,
    purpose: SessionPurpose = "session",
): string {
  if (typeof userId !== "string" || !userId.trim() || !Number.isSafeInteger(credentialVersion) || credentialVersion < 0 || !["session", "email-verification"].includes(purpose)) {
    throw new Error("A non-empty userId is required");
  }

  return jwt.sign({ userId, credentialVersion, purpose }, secret, {
    algorithm: "HS256",
    issuer: SESSION_ISSUER,
    audience: purpose === "session" ? "hidroflorestas-session" : "hidroflorestas-verification",
    expiresIn: purpose === "session" ? AUTH_SESSION_TTL_SECONDS : VERIFICATION_SESSION_TTL_SECONDS,
  });
}

export function verifySessionToken(
  token: string,
  secret = readJwtSecret(),
): SessionTokenPayload | null {
  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string" ||
      payload.userId.trim().length === 0
    ) {
      return null;
    }

    if (!Number.isSafeInteger(payload.iat) || !Number.isSafeInteger(payload.exp) || payload.exp! <= payload.iat! || payload.exp! - payload.iat! > AUTH_SESSION_TTL_SECONDS || payload.iat! > Math.floor(Date.now() / 1000) + 30) return null;
    const legacy = payload.credentialVersion === undefined && payload.purpose === undefined && payload.iss === undefined && payload.aud === undefined;
    if (legacy) return { userId: payload.userId };
    if (!Number.isSafeInteger(payload.credentialVersion) || payload.credentialVersion < 0 || (payload.purpose !== "session" && payload.purpose !== "email-verification") || payload.iss !== SESSION_ISSUER || payload.aud !== (payload.purpose === "session" ? "hidroflorestas-session" : "hidroflorestas-verification") || (payload.purpose === "email-verification" && payload.exp! - payload.iat! > VERIFICATION_SESSION_TTL_SECONDS)) return null;
    return { userId: payload.userId, credentialVersion: payload.credentialVersion, purpose: payload.purpose };
  } catch {
    return null;
  }
}

export function getAuthCookieOptions(
  nodeEnvironment: string | undefined = process.env.NODE_ENV,
) {
  return {
    httpOnly: true,
    secure: nodeEnvironment === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: AUTH_SESSION_TTL_SECONDS,
  };
}

export function getVerificationCookieOptions(nodeEnvironment: string | undefined = process.env.NODE_ENV) {
  return { ...getAuthCookieOptions(nodeEnvironment), maxAge: VERIFICATION_SESSION_TTL_SECONDS };
}

export function getExpiredAuthCookieOptions(
  nodeEnvironment: string | undefined = process.env.NODE_ENV,
) {
  return {
    httpOnly: true,
    secure: nodeEnvironment === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}
