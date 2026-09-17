import assert from "node:assert/strict";
import { it } from "node:test";
import { pointReducer } from "../../src/components/areas/area-form-state";
it("manual edits invalidate late geolocation and preserve the final point",()=>{
 const initial={latitude:"",longitude:"",revision:0};
 const edited=pointReducer(initial,{type:"edit",latitude:"-3",longitude:"-38"});
 assert.deepEqual(edited,{latitude:"-3",longitude:"-38",revision:1});
 assert.deepEqual(pointReducer(edited,{type:"location",latitude:5,longitude:10,revision:0}),edited);
 assert.deepEqual(pointReducer(edited,{type:"location",latitude:NaN,longitude:10,revision:1}),edited);
 assert.equal(pointReducer(initial,{type:"location",latitude:4,longitude:6,revision:0}).latitude,"4");
});
