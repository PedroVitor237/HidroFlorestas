import type {
  AuthenticatedDestination,
  AuthFailure,
  PublicUserDto,
} from "@/types/auth.type";
import { normalizeEmail } from "../accounts/contracts";

export type SignInInput = {
  email: string;
  password: string;
};

export type PublicUserSource = {
  firstName: string;
  lastName: string;
  image: string;
};

export const PUBLIC_AUTH_MESSAGES = {
  invalidRequest: "Informe um email e uma senha válidos.",
  invalidCredentials: "Email ou senha inválidos.",
  unauthenticated: "Não autenticado. Faça login novamente.",
  internalError: "Não foi possível concluir a solicitação.",
} as const;

function failure(code: AuthFailure["code"], message: string): AuthFailure {
  return { success: false, code, message };
}

export function invalidRequestFailure(): AuthFailure {
  return failure("INVALID_REQUEST", PUBLIC_AUTH_MESSAGES.invalidRequest);
}

export function invalidCredentialsFailure(): AuthFailure {
  return failure("INVALID_CREDENTIALS", PUBLIC_AUTH_MESSAGES.invalidCredentials);
}

export function unauthenticatedFailure(): AuthFailure {
  return failure("UNAUTHENTICATED", PUBLIC_AUTH_MESSAGES.unauthenticated);
}

export function internalErrorFailure(): AuthFailure {
  return failure("INTERNAL_ERROR", PUBLIC_AUTH_MESSAGES.internalError);
}

type ParseSignInResult =
  | { success: true; data: SignInInput }
  | { success: false; failure: AuthFailure };

export function parseSignInInput(input: unknown): ParseSignInResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { success: false, failure: invalidRequestFailure() };
  }

  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) {
    return { success: false, failure: invalidRequestFailure() };
  }

  const value = input as Record<string, unknown>;
  const keys = Object.keys(value).sort();
  if (keys.length !== 2 || keys[0] !== "email" || keys[1] !== "password") {
    return { success: false, failure: invalidRequestFailure() };
  }

  if (typeof value.email !== "string" || typeof value.password !== "string") {
    return { success: false, failure: invalidRequestFailure() };
  }

  let email: string;
  try { email = normalizeEmail(value.email).factual; } catch { return { success: false, failure: invalidRequestFailure() }; }
  if (value.password.trim().length === 0 || value.password.length > 4096) {
    return { success: false, failure: invalidRequestFailure() };
  }

  return {
    success: true,
    data: { email, password: value.password },
  };
}

export function serializePublicUser(source: PublicUserSource): PublicUserDto {
  return {
    firstName: source.firstName,
    lastName: source.lastName,
    image: source.image,
  };
}

export function authenticatedDestination(
  role: "USER" | "ADMIN" | "DEVELOPER" | "MODERATOR",
): Exclude<AuthenticatedDestination, "/verify-email"> {
  return role === "ADMIN" ? "/admin" : "/workspace";
}
