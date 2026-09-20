export type LegacyAuthorityCounts = {
  adminTrue: number;
  nonAdminFalse: number;
  adminFalse: number;
  nonAdminTrue: number;
};

export function evaluateLegacyAuthorityPreflight(counts: LegacyAuthorityCounts) {
  for (const value of Object.values(counts)) {
    if (!Number.isInteger(value) || value < 0) throw new Error("INVALID_PREFLIGHT_COUNT");
  }
  return {
    ok: counts.adminFalse === 0 && counts.nonAdminTrue === 0,
    contradictoryCount: counts.adminFalse + counts.nonAdminTrue,
  };
}
