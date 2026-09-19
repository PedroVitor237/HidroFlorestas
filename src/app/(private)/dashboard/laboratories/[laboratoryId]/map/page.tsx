import { getLaboratoryContext } from "@/components/workspace/laboratory-context";
import { TerritorialMapView } from "@/components/territorial-map/territorial-map-view";

export default async function TerritorialMapPage({ params }: { params: Promise<{ laboratoryId: string }> }) {
  const { laboratoryId } = await params;
  await getLaboratoryContext(laboratoryId);
  return <main className="min-w-0"><TerritorialMapView key={laboratoryId} laboratoryId={laboratoryId}/></main>;
}
