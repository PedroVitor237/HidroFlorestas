import Image from "next/image";
import Link from "next/link";
import defaultImage from "@/assets/dashboard/collects-default-img.png";
import { MapPinIcon } from "lucide-react";

export type CollectCardData = {
  id: string;
  localName: string;
  created: string;
  lastUpdate: string;
  status: "ACTIVE" | "INACTIVE";
  local_url: string;
  image: string | null;
};

type Props = {
  collect: CollectCardData;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR").replace(/\//g, ".");
}

export default function CollectCard({ collect }: Props) {
  const imageSrc = collect.image ?? defaultImage;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-video w-full">
        <Image
          src={imageSrc}
          alt={collect.localName}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-3 p-5">
        <h2 className="line-clamp-2 text-lg font-semibold">
          {collect.localName}
        </h2>

        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <strong>Data de início:</strong> {formatDate(collect.created)}
          </p>

          <p>
            <strong>Última coleta registrada:</strong>{" "}
            {formatDate(collect.lastUpdate)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status do monitoramento</span>

          <span
            className={`rounded-full px-4 py-1 text-xs font-bold text-white ${
              collect.status === "ACTIVE" ? "bg-blue-500" : "bg-orange-500"
            }`}
          >
            {collect.status === "ACTIVE" ? "ATIVO" : "INATIVO"}
          </span>
        </div>

        <Link
          href={collect.local_url}
          target="_blank"
          className=" flex items-center gap-2 text-sm font-medium text-amber-700 hover:underline"
        >
          <MapPinIcon size={16}/> Ver localização | Google Maps
        </Link>

        <Link
          href={`/dashboard/collects/area/${collect.id}`}
          className="block rounded-lg bg-green-600 py-3 text-center font-semibold text-white transition hover:bg-green-600"
        >
          Ver Detalhes
        </Link>
      </div>
    </article>
  );
}
