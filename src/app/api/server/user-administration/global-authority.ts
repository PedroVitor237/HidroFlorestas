import type { AuthenticatedPrincipal } from "../auth/auth.core";

export class GlobalAuthorityError extends Error {
  constructor(public readonly code: "ADMIN_AUTHORITY_REQUIRED") {
    super(code);
    this.name = "GlobalAuthorityError";
  }
}

export function requireGlobalAdmin(principal: AuthenticatedPrincipal) {
  if (principal.role !== "ADMIN") {
    throw new GlobalAuthorityError("ADMIN_AUTHORITY_REQUIRED");
  }
  return principal;
}
