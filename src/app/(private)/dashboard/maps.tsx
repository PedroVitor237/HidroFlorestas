type Props = {
  title: string;
  colorClasses: {
    text: string;
    bg: string;
  };
};

function StatePoint({ title, colorClasses }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colorClasses.bg}`}></div>
      <span className={`${colorClasses.text} text-sm md:text-base font-semibold`}>{title}</span>
    </div>
  );
}

export default function GeneralDashboardMap() {
  return (
    <div>
      <div className="w-full h-115 flex items-center justify-center bg-gray-300 rounded-2xl">
        <h1 className="text-2xl font-medium text-center text-gray-400">
          Mapa Geral de Todas as Coletas
        </h1>
      </div>
      <p className="text-gray-600 mt-2 text-sm md:text-base">
        Os pontos marcados no mapa acima mostram as áreas monitoradas cadastrada
        pela equipe.
      </p>

      <div className="flex md:items-center gap-3 md:gap-6 mt-4">
        <StatePoint
          title="Baixo Risco"
          colorClasses={{ text: "text-green-500", bg: "bg-green-500" }}
        />
        <StatePoint
          title="Médio Risco"
          colorClasses={{ text: "text-yellow-500", bg: "bg-yellow-500" }}
        />
        <StatePoint
          title="Alto Risco"
          colorClasses={{ text: "text-red-500", bg: "bg-red-500" }}
        />
      </div>
    </div>
  );
}
