import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyEnvironmentalForm, formToPayload, prepareSubmission } from "../../src/components/environmental-data/environmental-data-form-state";
test('empty form has no inferred values and identifies required fields',()=>{assert.throws(()=>formToPayload(emptyEnvironmentalForm()));});
test('zero/false/null remain distinct and retry retains key only for identical payload',()=>{
 const form=emptyEnvironmentalForm();Object.assign(form,{'water.waterSourceType':'RIVER_STREAM','water.hasSpring':'false','water.waterAvailability':'PERMANENT','soil.soilTexture':'SANDY','soil.infiltrationRateMmPerHour':'0','soil.compactionLevel':'LOW','soil.erosionSigns':'NONE','vegetation.vegetationCoverPercent':'0','vegetation.fragmentationLevel':'LOW','vegetation.landscapeDegradation':'LOW'});
 const payload=formToPayload(form);assert.equal(payload.water.hasSpring,false);assert.equal(payload.soil.infiltrationRateMmPerHour,0);assert.equal(payload.vegetation.hasRiparianApp,null);
 const a=prepareSubmission(payload,null,()=> 'first');assert.equal(prepareSubmission(payload,a,()=> 'second').key,'first');
 payload.water.hasSpring=true;assert.equal(prepareSubmission(payload,a,()=> 'second').key,'second');
 form['soil.infiltrationRateMmPerHour']='0x10';assert.throws(()=>formToPayload(form));
});
