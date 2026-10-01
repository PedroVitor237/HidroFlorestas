export const MEASUREMENT_CONTRACT_VERSION = "ihfr-measurement-v1" as const;
export const WATER_SOURCES = ["RIVER_STREAM", "SPRING", "SHALLOW_WELL", "TUBULAR_WELL", "CISTERN", "OTHER"] as const;
export const WATER_AVAILABILITY = ["PERMANENT", "SEASONAL", "SCARCE"] as const;
export const SALINITY = ["NONE", "SUSPECTED", "CONFIRMED"] as const;
export const TEXTURES = ["SANDY", "MEDIUM", "CLAYEY"] as const;
export const LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;
export const EROSION = ["NONE", "LAMINAR", "RILLS_GULLIES"] as const;
export type EnvironmentalPayload = {
  water: { waterSourceType: typeof WATER_SOURCES[number]; hasSpring: boolean; wellDepthMeters: number | null; waterAvailability: typeof WATER_AVAILABILITY[number]; salinityIndicator: typeof SALINITY[number] | null };
  soil: { soilTexture: typeof TEXTURES[number]; infiltrationRateMmPerHour: number; compactionLevel: typeof LEVELS[number]; erosionSigns: typeof EROSION[number]; soilExposedPercent: number | null };
  vegetation: { vegetationCoverPercent: number; fragmentationLevel: typeof LEVELS[number]; hasRiparianApp: boolean | null; landscapeDegradation: typeof LEVELS[number] };
  terrain: { drainageDensityKmPerKm2: number | null; elevationMeters: number | null; slopePercent: number | null };
};
export type PublicEnvironmentalData = EnvironmentalPayload & {
  id: string; collectionId: string; measurementContractVersion: typeof MEASUREMENT_CONTRACT_VERSION; confirmedAt: string; readOnly: boolean;
};
export type EnvironmentalContext = { laboratoryId: string; areaId: string; collectionId: string };
