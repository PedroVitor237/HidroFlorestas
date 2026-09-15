export type PointState={latitude:string;longitude:string;revision:number};
export type PointAction={type:"edit";latitude:string;longitude:string}|{type:"location";latitude:number;longitude:number;revision:number};
export function pointReducer(state:PointState,action:PointAction):PointState{
 if(action.type==="edit")return {latitude:action.latitude,longitude:action.longitude,revision:state.revision+1};
 if(action.revision!==state.revision||!Number.isFinite(action.latitude)||!Number.isFinite(action.longitude)||Math.abs(action.latitude)>90||Math.abs(action.longitude)>180)return state;
 return {latitude:String(action.latitude),longitude:String(action.longitude),revision:state.revision+1};
}
