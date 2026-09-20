import { redirect } from "next/navigation";

import { authenticatedDestination } from "@/app/api/server/auth/auth.contracts";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  let principal;
  try {
    principal = await requireAuth();
  } catch {
    return children;
  }

  redirect(authenticatedDestination(principal.role));
}
