import { getLaboratoryContext } from "@/components/workspace/laboratory-context";
import { LaboratoryMemberships } from "@/components/laboratories/laboratory-memberships";
export default async function MembersPage({params}:{params:Promise<{laboratoryId:string}>}) {const {laboratoryId}=await params;await getLaboratoryContext(laboratoryId,"MANAGE_ROLES");return <LaboratoryMemberships laboratoryId={laboratoryId}/>;}
