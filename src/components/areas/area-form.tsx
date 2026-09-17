"use client";
import { useEffect, useReducer, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Crosshair, MapPin, Save } from "lucide-react";
import { AreaMap } from "./area-map";
import { pointReducer } from "./area-form-state";
export function AreaForm({ laboratoryId }: { laboratoryId: string }) {
  const router = useRouter();
  const [point, dispatch] = useReducer(pointReducer, {
    latitude: "",
    longitude: "",
    revision: 0,
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const inFlight = useRef(false);
  const locationRequest = useRef(0);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const latitude =
    point.latitude.trim() !== "" &&
    Number.isFinite(Number(point.latitude)) &&
    Math.abs(Number(point.latitude)) <= 90
      ? Number(point.latitude)
      : null;
  const longitude =
    point.longitude.trim() !== "" &&
    Number.isFinite(Number(point.longitude)) &&
    Math.abs(Number(point.longitude)) <= 180
      ? Number(point.longitude)
      : null;
  const select = (lat: string, lng: string) =>
    dispatch({ type: "edit", latitude: lat, longitude: lng });
  function locate() {
    if (locating) return;
    if (!navigator.geolocation) {
      setMessage(
        "Localização indisponível. Digite as coordenadas ou escolha no mapa.",
      );
      return;
    }
    setLocating(true);
    setMessage("");
    const request = ++locationRequest.current;
    const revision = point.revision;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!alive.current || request !== locationRequest.current) return;
        dispatch({
          type: "location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          revision,
        });
        setLocating(false);
        setMessage(
          "Revise as coordenadas antes de confirmar. Edições manuais posteriores são preservadas.",
        );
      },
      () => {
        if (!alive.current || request !== locationRequest.current) return;
        setLocating(false);
        setMessage(
          "Não foi possível obter sua localização. Seus dados foram preservados; use o mapa ou digite as coordenadas.",
        );
      },
      { timeout: 10000, maximumAge: 0 },
    );
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (latitude === null || longitude === null) {
      setMessage(
        "Informe latitude entre -90 e 90 e longitude entre -180 e 180.",
      );
      return;
    }
    const form = new FormData(event.currentTarget);
    const data = {
      name: form.get("name"),
      latitude,
      longitude,
      municipality: form.get("municipality"),
      state: form.get("state"),
      landType: form.get("landType"),
      description: form.get("description"),
    };
    inFlight.current = true;
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`/api/laboratories/${laboratoryId}/areas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) {
        setMessage(body.error?.message ?? "Não foi possível salvar a área.");
        return;
      }
      router.push(
        `/dashboard/laboratories/${laboratoryId}/areas/${body.area.id}`,
      );
      router.refresh();
    } catch {
      setMessage(
        "Falha de conexão. Confira a listagem antes de tentar novamente.",
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }
  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100";
  const labelClass = "block text-sm font-bold text-slate-700";
  return (
    <section className="space-y-6">
      <div className="flex items-start gap-3">
        <Link
          aria-label="Voltar às áreas"
          href={`/dashboard/laboratories/${laboratoryId}/areas`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-700 text-white hover:bg-amber-800"
        >
          <ArrowLeft size={22} />
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-green-700">
            Novo ponto
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Nova Área para Monitoramento
          </h1>
          <p className="mt-2 text-slate-500">
            Informe os dados e confirme um único ponto no mapa ou pelas
            coordenadas.
          </p>
        </div>
      </div>
      <form
        onSubmit={submit}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-5">
            <label className={labelClass}>
              Nome da área
              <input
                autoFocus
                required
                name="name"
                maxLength={100}
                placeholder="Ex.: Beira Rio"
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Latitude
                <input
                  aria-label="Latitude"
                  required
                  inputMode="decimal"
                  type="number"
                  min={-90}
                  max={90}
                  step="any"
                  placeholder="Ex.: -2.53073"
                  value={point.latitude}
                  onChange={(e) => select(e.target.value, point.longitude)}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Longitude
                <input
                  aria-label="Longitude"
                  required
                  inputMode="decimal"
                  type="number"
                  min={-180}
                  max={180}
                  step="any"
                  placeholder="Ex.: -44.30682"
                  value={point.longitude}
                  onChange={(e) => select(point.latitude, e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
            <button
              type="button"
              disabled={locating}
              onClick={locate}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-green-600 px-4 py-2.5 font-bold text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              <Crosshair size={18} />
              {locating ? "Obtendo localização…" : "Usar minha localização"}
            </button>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["municipality", "Município"],
                ["state", "UF"],
                ["landType", "Tipo de terreno"],
              ].map(([name, label]) => (
                <label key={name} className={labelClass}>
                  {label}{" "}
                  <span className="font-normal text-slate-400">(opcional)</span>
                  <input name={name} maxLength={100} className={inputClass} />
                </label>
              ))}
            </div>
            <label className={labelClass}>
              Descrição{" "}
              <span className="font-normal text-slate-400">(opcional)</span>
              <textarea
                name="description"
                maxLength={2000}
                rows={4}
                className={inputClass}
              />
            </label>
          </div>
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
              <MapPin className="text-green-600" size={18} /> Selecione o ponto
            </div>
            <AreaMap
              latitude={latitude}
              longitude={longitude}
              onSelect={(lat, lng) => select(String(lat), String(lng))}
            />
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Clique no mapa ou digite as coordenadas. Nada será salvo antes da
              confirmação.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
          <p
            role="status"
            aria-live="polite"
            className="mb-3 min-h-5 text-sm font-medium text-amber-800"
          >
            {message}
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/dashboard/laboratories/${laboratoryId}/areas`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 font-bold text-slate-700 hover:bg-white"
            >
              Cancelar
            </Link>
            <button
              disabled={submitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={18} />
              {submitting ? "Salvando…" : "Confirmar ponto e cadastrar"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
