import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import {
  AuthBoundaryError,
  requireAuth,
} from "@/app/api/server/middlewares/auth.middleware";
import { collectionsService } from "@/app/api/server/services/collections.service";
import { environmentalDataService } from "@/app/api/server/services/environmental-data.service";
import type { EnvironmentalContext } from "@/types/environmental-data.type";
import { EnvironmentalDetail } from "./environmental-data-detail";
import { EnvironmentalForm } from "./environmental-data-form";

export async function EnvironmentalDataPage({
  params,
  registration = false,
}: {
  params: Promise<EnvironmentalContext>;
  registration?: boolean;
}) {
  const ids = await params;
  let collection;
  let data;

  try {
    const principal = await requireAuth();
    collection = (
      await collectionsService.detail(
        principal.id,
        ids.laboratoryId,
        ids.areaId,
        ids.collectionId,
      )
    ).collection;
    data = (await environmentalDataService.detail(principal.id, ids))
      .environmentalData;
  } catch (error) {
    if (error instanceof AuthBoundaryError && error.code === "UNAUTHORIZED") {
      redirect("/login");
    }
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : null;
    if (code === "NOT_FOUND") notFound();
    throw new Error("Não foi possível carregar os dados ambientais.");
  }

  const collectionPath = `/dashboard/laboratories/${ids.laboratoryId}/areas/${ids.areaId}/collections/${ids.collectionId}`;
  const basePath = `${collectionPath}/environmental-data`;

  return (
    <article
      aria-labelledby="environmental-title"
      className="mx-auto max-w-6xl space-y-6 px-1 pb-24 pt-4 sm:px-4 md:pb-4"
    >
      <Link
        href={collectionPath}
        className="inline-flex items-center gap-2 font-semibold text-amber-800 hover:underline"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Voltar à coleta
      </Link>
      <header>
        <p className="text-sm font-semibold text-green-700">
          Monitoramento ambiental
        </p>
        <h1
          id="environmental-title"
          className="mt-1 text-3xl font-bold tracking-tight text-slate-900"
        >
          {registration && !data
            ? "Registrar dados ambientais"
            : "Dados ambientais da coleta"}
        </h1>
        <p className="mt-2 text-slate-600">
          Observações de campo vinculadas à sua origem.
        </p>
      </header>
      <section
        aria-label="Origem da coleta"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
          <ClipboardList size={20} aria-hidden="true" />
          Coleta de origem
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Laboratório</dt>
            <dd className="font-semibold">{collection.laboratory.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Área</dt>
            <dd className="font-semibold">{collection.area.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Coleta</dt>
            <dd className="break-all">{collection.id}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ocorrência em campo</dt>
            <dd>{collection.occurredAt}</dd>
          </div>
        </dl>
      </section>
      {collection.readOnly && (
        <p
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-950"
        >
          Laboratório inativo — somente leitura.
        </p>
      )}
      {registration && !data && !collection.readOnly ? (
        <EnvironmentalForm
          apiPath={basePath.replace("/dashboard/", "/api/")}
          basePath={basePath}
        />
      ) : (
        <EnvironmentalDetail
          data={data}
          readOnly={collection.readOnly}
          basePath={basePath}
        />
      )}
    </article>
  );
}
