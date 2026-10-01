import { createRoot } from "react-dom/client";
import { useSyncExternalStore } from "react";
import { AuthProvider, AuthSessionRestorer, useAuth } from "@/contexts/auth.context";
import WorkspaceLayout from "@/app/(private)/workspace/layout";
import TopBar from "@/components/top-bar";
import Sidebar from "@/components/sidebar";
import { AdminShell } from "@/components/admin-shell/admin-shell";
import LogoutPage from "@/app/logout/page";
import { CollectionForm } from "@/components/collections/collection-form";
import { CollectionDetail } from "@/components/collections/collection-detail";
import { IHFRDiagnosisManagement } from "@/components/ihfr-diagnosis/ihfr-diagnosis-management";

const subscribe = (callback: () => void) => { window.addEventListener("popstate", callback); return () => window.removeEventListener("popstate", callback); };
const snapshot = () => window.location.pathname;
const laboratoryId = "00000000-0000-4000-8000-000000000411";
const areaId = "00000000-0000-4000-8000-000000000421";
const collectionId = "00000000-0000-4000-8000-000000000431";
const context = { laboratory: { id: laboratoryId, name: "Laboratório teste", status: "ACTIVE" as const }, area: { id: areaId, name: "Área teste" }, readOnly: false };
function SessionStatus() {
  const { user } = useAuth();
  return <p data-testid="session">{user ? "Sessão ativa" : "Sem sessão"}</p>;
}
function App() {
  const path = useSyncExternalStore(subscribe, snapshot);
  if (path === "/logout") return <><SessionStatus /><LogoutPage /></>;
  if (path === "/login") return <><h1>Login</h1><SessionStatus /></>;
  if (path === "/workspace") return <><AuthSessionRestorer /><WorkspaceLayout><SessionStatus /><h1>Workspace teste</h1></WorkspaceLayout></>;
  if (path === "/admin") return <><AuthSessionRestorer /><AdminShell><SessionStatus /><h1>Administração teste</h1></AdminShell></>;
  if (path === "/diagnosis") return <IHFRDiagnosisManagement context={{ laboratoryId, areaId, collectionId }} initialDiagnosis={null} />;
  if (path === "/collection") return <CollectionForm context={context} />;
  if (path.endsWith(`/collections/${collectionId}`)) {
    // Only a stubbed API projection is supplied by the test, no real DB access.
    const value = sessionStorage.getItem("test-occurredAt") ?? "";
    return <CollectionDetail collection={{ id: collectionId, occurredAt: value, confirmedAt: "2026-10-01T12:00:00Z", ...context }} />;
  }
  return <><AuthSessionRestorer /><TopBar showProfile /><div className="flex"><Sidebar canAdmin /><main><h1>Laboratório teste</h1><SessionStatus /></main></div></>;
}

createRoot(document.getElementById("root")!).render(<AuthProvider><App /></AuthProvider>);
