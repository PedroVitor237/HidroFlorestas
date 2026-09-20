import { redirect } from "next/navigation";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { UserAdministrationPage } from "@/components/user-administration/user-administration-page";

export default async function AdminUsersPage(){
 const principal=await requireAuth();
 if(principal.role!=="ADMIN") redirect("/workspace");
 return <UserAdministrationPage />;
}
