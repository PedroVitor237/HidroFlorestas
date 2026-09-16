import { notFound, redirect } from "next/navigation";

import { AuthBoundaryError, requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { CollectionServiceError, collectionsService } from "@/app/api/server/services/collections.service";
import { CollectionDetail } from "@/components/collections/collection-detail";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ laboratoryId: string; areaId: string; collectionId: string }>;
}) {
  let collection;
  try {
    const principal = await requireAuth();
    const { laboratoryId, areaId, collectionId } = await params;
    const result = await collectionsService.detail(principal.id, laboratoryId, areaId, collectionId);
    collection = result.collection;
  } catch (error) {
    if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") redirect("/login");
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : null;
    if ((error instanceof CollectionServiceError || code === "NOT_FOUND") && code === "NOT_FOUND") notFound();
    throw new Error("Não foi possível carregar a coleta.");
  }
  return <CollectionDetail collection={collection} />;
}
