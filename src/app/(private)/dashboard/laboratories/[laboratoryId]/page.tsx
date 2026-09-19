import { getLaboratoryContext } from "@/components/workspace/laboratory-context";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { DashboardHistory } from "@/components/dashboard/dashboard-history";
export default async function LaboratoryDashboardPage({ params }: { params: Promise<{ laboratoryId: string }> }) { const { laboratoryId } = await params; await getLaboratoryContext(laboratoryId); return <main className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"><DashboardSummary key={`summary-${laboratoryId}`} laboratoryId={laboratoryId}/><DashboardHistory key={`history-${laboratoryId}`} laboratoryId={laboratoryId}/></main>; }
