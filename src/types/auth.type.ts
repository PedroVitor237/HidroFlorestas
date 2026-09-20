export type PublicUserDto = {
  firstName: string;
  lastName: string;
  image: string;
};

export type AuthFailureCode =
  | "INVALID_REQUEST"
  | "INVALID_CREDENTIALS"
  | "UNAUTHENTICATED"
  | "INTERNAL_ERROR";

export type AuthSuccess = {
  success: true;
  user: PublicUserDto;
  destination?: AuthenticatedDestination;
};

export type AuthenticatedDestination = "/admin" | "/workspace";

export type LogoutSuccess = {
  success: true;
};

export type AuthFailure = {
  success: false;
  code: AuthFailureCode;
  message: string;
};

export type AuthEnvelope = AuthSuccess | LogoutSuccess | AuthFailure;

const AUTH_FAILURE_CODES = new Set<AuthFailureCode>([
  "INVALID_REQUEST",
  "INVALID_CREDENTIALS",
  "UNAUTHENTICATED",
  "INTERNAL_ERROR",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actualKeys = Object.keys(value).sort();
  const expectedKeys = [...keys].sort();

  return (
    actualKeys.length === expectedKeys.length &&
    actualKeys.every((key, index) => key === expectedKeys[index])
  );
}

function parsePublicUser(value: unknown): PublicUserDto | null {
  if (!isRecord(value) || !hasExactKeys(value, ["firstName", "lastName", "image"])) {
    return null;
  }

  if (
    typeof value.firstName !== "string" ||
    typeof value.lastName !== "string" ||
    typeof value.image !== "string"
  ) {
    return null;
  }

  return {
    firstName: value.firstName,
    lastName: value.lastName,
    image: value.image,
  };
}

export function parseAuthEnvelope(value: unknown): AuthEnvelope | null {
  if (!isRecord(value) || typeof value.success !== "boolean") {
    return null;
  }

  if (value.success === true) {
    if (hasExactKeys(value, ["success"])) {
      return { success: true };
    }

    const hasUserOnly = hasExactKeys(value, ["success", "user"]);
    const hasDestination = hasExactKeys(value, ["success", "user", "destination"]);
    if (!hasUserOnly && !hasDestination) {
      return null;
    }

    const user = parsePublicUser(value.user);
    if (!user) return null;

    if (hasDestination) {
      if (value.destination !== "/admin" && value.destination !== "/workspace") {
        return null;
      }
      return { success: true, user, destination: value.destination };
    }

    return { success: true, user };
  }

  if (
    !hasExactKeys(value, ["success", "code", "message"]) ||
    typeof value.code !== "string" ||
    !AUTH_FAILURE_CODES.has(value.code as AuthFailureCode) ||
    typeof value.message !== "string"
  ) {
    return null;
  }

  return {
    success: false,
    code: value.code as AuthFailureCode,
    message: value.message,
  };
}
