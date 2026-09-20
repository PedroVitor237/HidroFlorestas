import Link from "next/link";
import { ArrowRight, ClipboardCheck, ShieldAlert, Users } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-6 text-white shadow-xl sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Controle global</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Visão geral administrativa</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-emerald-50 sm:text-lg">
          Gerencie contas, papéis globais e estados de acesso sem misturar essas operações com o trabalho dos laboratórios.
        </p>
        <Link href="/admin/users" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-emerald-950 shadow-sm hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900">
          Gerenciar usuários <ArrowRight size={19} aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="admin-capabilities" className="space-y-4">
        <div>
          <h2 id="admin-capabilities" className="text-2xl font-bold">Operações disponíveis</h2>
          <p className="mt-1 text-slate-600">Somente funcionalidades já implementadas pela administração de usuários.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/users" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800"><Users aria-hidden="true" /></span>
            <h3 className="mt-5 text-xl font-bold">Contas e acessos</h3>
            <p className="mt-2 leading-6 text-slate-600">Pesquise contas existentes, consulte detalhes e altere estado ou papel global com justificativa.</p>
            <span className="mt-5 inline-flex items-center gap-2 font-semibold text-emerald-800">Abrir gestão <ArrowRight size={18} aria-hidden="true" /></span>
          </Link>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-800"><ClipboardCheck aria-hidden="true" /></span>
            <h3 className="mt-5 text-xl font-bold">Rastreabilidade das alterações</h3>
            <p className="mt-2 leading-6 text-slate-600">As mudanças concluídas de papel e estado permanecem registradas no histórico funcional da conta.</p>
          </article>
        </div>
      </section>

      <aside className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
        <ShieldAlert className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-bold">Operações sensíveis e auditadas</h2>
          <p className="mt-1 text-sm leading-6">Confirme a conta e a justificativa antes de alterar acessos. A proteção do último administrador ativo e o controle de concorrência continuam aplicados pelo servidor.</p>
        </div>
      </aside>
    </div>
  );
}
