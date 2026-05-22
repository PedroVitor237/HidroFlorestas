"use client";
import HeaderScreen from "@/components/header-screen";
import { PlusIcon } from "lucide-react";
import GeneralDashboardMap from "./maps";
import ActivityHistory from "./activity-history";

export default function DashBoard() {
  return (
    <div>
      <HeaderScreen
        backButton={false}
        title="Atividade e Gerenciamento"
        description="Acesse histórico de atividade, relatórios gerais e comunicados"
        actionsButtons={[
            {action:() => alert('Nova Coleta'), title: 'Nova Coleta', tailwindBgColor: 'bg-green-600', icon: <PlusIcon size={20}/>},
        ]}
      />

      <GeneralDashboardMap />
      <br/> <br/>
      <ActivityHistory />
    </div>
  );
}
