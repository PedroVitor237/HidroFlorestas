import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionTokenPayload = {
  userId: string;
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
): string {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("A non-empty userId is required");
  }

  return jwt.sign({ userId }, secret, {
    algorithm: "HS256",
    expiresIn: AUTH_SESSION_TTL_SECONDS,
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

    return { userId: payload.userId };
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
