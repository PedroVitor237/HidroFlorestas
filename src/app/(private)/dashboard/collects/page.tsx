"use client";
import HeaderScreen from "@/components/header-screen";
import { PlusIcon } from "lucide-react";
import CollectsGrid from "./collects-grid";

export default function DashBoard() {
  return (
    <div>
      <HeaderScreen
        backButton
        title="Áreas Monitoradas"
        description="Gerencie áreas de monitoramento ambiental, registre coletas de campo e visualize diagnósticos IHFR."
        actionsButtons={[
          {
            action: () => alert("Nova Área"),
            title: "Nova Área",
            tailwindBgColor: "bg-green-600",
            icon: <PlusIcon size={20} />,
          },
        ]}
      />
      <br /> <br />
      <CollectsGrid />
    </div>
  );
}
