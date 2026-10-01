"use client";

export default function CollectionDetailError({ reset }: { reset: () => void }) {
  return (
    <section role="alert" className="space-y-4 p-6">
      <p>Não foi possível carregar a coleta.</p>
      <button type="button" onClick={reset} className="rounded-xl bg-green-700 px-4 py-2 font-bold text-white">Tentar novamente</button>
    </section>
  );
}
