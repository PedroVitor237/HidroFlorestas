import assert from "node:assert/strict";
import { it } from "node:test";
import { LAND_USE_LABELS } from "../../src/components/ihfr-diagnosis/land-use-labels";

it("maps exactly the seven experimental enums to documented Portuguese labels", () => {
  assert.deepEqual(LAND_USE_LABELS, {
    FOREST: "Floresta", AGROFORESTRY: "Sistema agroflorestal (SAF)", CROPLAND: "Agricultura",
    PASTURE: "Pastagem", DEGRADED_PASTURE: "Pastagem degradada", BARE_SOIL: "Solo exposto", URBAN: "Área urbanizada",
  });
});
