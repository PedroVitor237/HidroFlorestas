import { redirect } from "next/navigation";

import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { AdminShell } from "@/components/admin-shell/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const principal = await requireAuth();

  if (principal.role !== "ADMIN") {
    redirect("/workspace");
  }

  return <AdminShell>{children}</AdminShell>;
}
