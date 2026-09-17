import { getLaboratoryContext } from "@/components/workspace/laboratory-context";
import { AreaForm } from "@/components/areas/area-form";
export default async function NewArea({params}:{params:Promise<{laboratoryId:string}>}){const {laboratoryId}=await params;await getLaboratoryContext(laboratoryId,"CREATE_AREA",true);return <AreaForm laboratoryId={laboratoryId}/>;}
