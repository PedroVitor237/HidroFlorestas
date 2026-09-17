import { getLaboratoryContext } from "@/components/workspace/laboratory-context";
import { AreaList } from "@/components/areas/area-list";
export default async function AreasPage({params}:{params:Promise<{laboratoryId:string}>}) {const {laboratoryId}=await params;await getLaboratoryContext(laboratoryId);return <AreaList key={laboratoryId} laboratoryId={laboratoryId}/>;}
