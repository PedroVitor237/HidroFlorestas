import type { IHFRLandUseType } from "@/types/ihfr-diagnosis.type";

/** Presentation only, from ADR-0001 §7. No new field classification criteria. */
export const LAND_USE_LABELS: Record<IHFRLandUseType, string> = {
  FOREST: "Floresta",
  AGROFORESTRY: "Sistema agroflorestal (SAF)",
  CROPLAND: "Agricultura",
  PASTURE: "Pastagem",
  DEGRADED_PASTURE: "Pastagem degradada",
  BARE_SOIL: "Solo exposto",
  URBAN: "Área urbanizada",
};
