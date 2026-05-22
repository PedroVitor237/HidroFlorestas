"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import UserProfile from "@/components/user-profile";
import WhiteBox from "@/components/white-box";

type ActivityLog = {
  id: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  log: {
    title: string;
    date: string;
    referenceId: string;
  };
};

const MOCK_LOGS: ActivityLog[] = [
  {
    id: 1,
    user: {
      id: "1",
      email: "pedro@gmail.com",
      firstName: "Pedro",
      lastName: "Brito",
    },
    log: {
      title: "Adicionou uma nova coleta",
      date: "2026-03-02",
      referenceId: "100",
    },
  },
  {
    id: 2,
    user: {
      id: "2",
      email: "pedrovitor@gmail.com",
      firstName: "Pedro",
      lastName: "Vitor",
    },
    log: {
      title: "Adicionou uma nova área de monitoramento",
      date: "2026-03-01",
      referenceId: "101",
    },
  },
  {
    id: 3,
    user: {
      id: "3",
      email: "lucas@gmail.com",
      firstName: "Lucas",
      lastName: "Silva",
    },
    log: {
      title: "Atualizou uma coleta",
      date: "2026-02-27",
      referenceId: "102",
    },
  },
  {
    id: 4,
    user: {
      id: "4",
      email: "mariana@gmail.com",
      firstName: "Mariana",
      lastName: "Costa",
    },
    log: {
      title: "Criou uma nova análise",
      date: "2026-02-25",
      referenceId: "103",
    },
  },
  {
    id: 5,
    user: {
      id: "5",
      email: "joao@gmail.com",
      firstName: "João",
      lastName: "Mendes",
    },
    log: {
      title: "Editou dados do dashboard",
      date: "2026-02-20",
      referenceId: "104",
    },
  },
  {
    id: 6,
    user: {
      id: "6",
      email: "aline@gmail.com",
      firstName: "Aline",
      lastName: "Rocha",
    },
    log: {
      title: "Adicionou uma nova coleta",
      date: "2026-02-19",
      referenceId: "105",
    },
  },
];

const ITEMS_PER_PAGE = 5;

export default function ActivityHistory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter((item) => {
      const fullName =
        `${item.user.firstName} ${item.user.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        item.user.email.toLowerCase().includes(search.toLowerCase()) ||
        item.log.title.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : item.log.title.toLowerCase().includes(filter);

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <WhiteBox>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-semibold text-zinc-800">
            Histórico de Atividades
          </h2>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-zinc-400"
              >
                <option value="all">Todos</option>
                <option value="coleta">Coletas</option>
                <option value="área">Áreas</option>
                <option value="análise">Análises</option>
              </select>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="text"
                placeholder="Buscar por usuário, email ou atividade"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-zinc-400 md:w-[320px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-zinc-100">
          {paginatedLogs.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-4 py-5 lg:grid-cols-[320px_1fr_120px_170px] lg:items-center"
            >
              <div className="flex items-center gap-3">
                <UserProfile
                  image={item.user.image}
                  lyrics={`${item.user.firstName.charAt(
                    0,
                  )}${item.user.lastName.charAt(0)}`}
                />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-zinc-800">
                    {item.user.firstName} {item.user.lastName}
                  </p>

                  <p className="truncate text-sm text-zinc-500">
                    {item.user.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium text-zinc-700">{item.log.title}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  {new Date(item.log.date).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <Link
                  href={`/dashboard/collects/area/${item.log.referenceId}`}
                  className="font-medium text-sky-600 transition hover:text-sky-700"
                >
                  Ver dashboard
                </Link>
              </div>
            </div>
          ))}

          {!paginatedLogs.length && (
            <div className="flex h-40 items-center justify-center text-zinc-500">
              Nenhuma atividade encontrada.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
            <p className="text-sm text-zinc-500">
              Página {page} de {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
                disabled={page === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </WhiteBox>
  );
}
