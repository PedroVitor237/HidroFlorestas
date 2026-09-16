import { notFound } from "next/navigation";

import { AreaAccessError } from "@/app/api/server/areas/area.authorization";
import { requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { areasService } from "@/app/api/server/services/areas.service";
import { CollectionForm } from "@/components/collections/collection-form";

export default async function NewCollectionPage({
  params,
}: {
  params: Promise<{ laboratoryId: string; areaId: string }>;
}) {
  const { laboratoryId, areaId } = await params;
  const principal = await requireAuth();
  const { area } = await areasService
    .detail(principal.id, laboratoryId, areaId)
    .catch((error) => {
      if (error instanceof AreaAccessError && error.code === "NOT_FOUND") notFound();
      throw error;
    });
  return (
    <CollectionForm
      context={{
        laboratory: area.laboratory,
        area: { id: area.id, name: area.name },
        readOnly: area.readOnly,
      }}
    />
  );
}
