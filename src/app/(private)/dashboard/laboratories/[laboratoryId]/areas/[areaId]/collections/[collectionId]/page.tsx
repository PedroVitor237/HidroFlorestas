import { notFound, redirect } from "next/navigation";

import { AuthBoundaryError, requireAuth } from "@/app/api/server/middlewares/auth.middleware";
import { CollectionServiceError, collectionsService } from "@/app/api/server/services/collections.service";
import { CollectionDetail } from "@/components/collections/collection-detail";
import { ExperimentalDiagnosisSummary } from "@/components/ihfr-diagnosis/experimental-diagnosis-summary";
import { NoCurrentDiagnosis } from "@/components/ihfr-diagnosis/no-current-diagnosis";
import { ihfrDiagnosisService } from "@/app/api/server/services/ihfr-diagnosis.service";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ laboratoryId: string; areaId: string; collectionId: string }>;
}) {
  let collection;
  let diagnosis;
  try {
    const principal = await requireAuth();
    const { laboratoryId, areaId, collectionId } = await params;
    const result = await collectionsService.detail(principal.id, laboratoryId, areaId, collectionId);
    collection = result.collection;
    diagnosis = await ihfrDiagnosisService.readCurrent(principal.id, { laboratoryId, areaId, collectionId });
  } catch (error) {
    if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") redirect("/login");
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : null;
    if ((error instanceof CollectionServiceError || code === "NOT_FOUND") && code === "NOT_FOUND") notFound();
    throw new Error("Não foi possível carregar a coleta.");
  }
  return <div className="space-y-6"><CollectionDetail collection={collection} />{diagnosis ? <ExperimentalDiagnosisSummary diagnosis={diagnosis} /> : <NoCurrentDiagnosis />}</div>;
}
