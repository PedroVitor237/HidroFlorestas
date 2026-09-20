export type VerifiedManifest = Readonly<Record<string, unknown>>;

export function loadActiveIHFRManifest(): VerifiedManifest {
  throw new Error("IHFR_MANIFEST_LOADER_NOT_IMPLEMENTED");
}

export function loadHistoricalIHFRManifest(): VerifiedManifest {
  throw new Error("IHFR_HISTORICAL_MANIFEST_LOADER_NOT_IMPLEMENTED");
}
