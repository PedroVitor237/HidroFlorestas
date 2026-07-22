"use client";

import Image from "next/image";
import Logo from "@/assets/logo/logo.png";
import { useAuth } from "@/contexts/auth.context";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarIcon,
  CircleCheckBigIcon,
  FlaskConicalIcon,
  MapPinIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export default function Workspace() {
  const [temLab, setTemLab] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div>
          <div className="mt-2 flex items-center flex-col justify-center">
            <Image src={Logo} alt="HidroFlorestas" width={150} />
            <h1 className="text-center mt-3 text-gray-900 font-bold text-2xl leading-snug md:text-4xl">
              <span className="text-amber-700">
                Olá, {user?.firstName || "usuário"}! 👋
              </span>
              <br />
              {temLab ? 'Acesse seu' : 'Bem-vindo ao'} Ambiente de Análises
              <br />
              <span className="text-blue-500 font-black">HIDRO</span>
              <span
                className="text-green-600 font-black"
                onClick={() => setTemLab(!temLab)}
              >
                FLORESTAS
              </span>
            </h1>
          </div>
        </div>
        {/* SEM LAB */}

        {!temLab && (
          <div className="mt-10 rounded-[30px] bg-white p-10 shadow-sm border border-slate-200">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800">
                Você ainda não participa de um laboratório.
              </h2>

              <p className="mt-3 text-slate-500 max-w-xl mx-auto">
                Entre em um laboratório existente ou crie um novo para começar a
                utilizar todos os recursos da plataforma.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <button onClick={() => window.location.href = '/dashboard'} className="group rounded-3xl bg-green-600 p-5 text-white transition hover:-translate-y-2 hover:bg-green-700">
                <UsersIcon className="mx-auto mb-5" size={45} />

                <h3 className="text-2xl font-bold">Entrar em um laboratório</h3>

                <p className="mt-3 text-green-100">
                  Solicite participação em um laboratório já existente.
                </p>
              </button>

              <button onClick={() => setTemLab(!temLab)} className="group rounded-3xl bg-blue-600 p-5 text-white transition hover:-translate-y-2 hover:bg-blue-700">
                <FlaskConicalIcon className="mx-auto mb-5" size={45} />

                <h3 className="text-2xl font-bold">Criar laboratório</h3>

                <p className="mt-3 text-blue-100">
                  Seja responsável por um novo laboratório IHFR.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* CARD */}

        {temLab && (
          <div className="mt-10 rounded-[30px] bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex flex-col xl:flex-row gap-10">
                {/* ESQUERDA */}

                <div className="flex-1">
                  <div className="flex gap-5">
                    <div className="h-20 w-20 rounded-3xl bg-linear-to-br from-blue-600 to-green-600 text-white flex items-center justify-center shadow-lg">
                      <FlaskConicalIcon size={38} />
                    </div>

                    <div>
                      <span className="uppercase tracking-widest text-xs text-blue-600 font-bold">
                        Laboratório IHFR
                      </span>

                      <h2 className="mt-2 text-4xl font-black text-slate-800">
                        Itapecuru-Mirim
                      </h2>

                      <div className="mt-4 flex flex-wrap gap-5 text-slate-500">
                        <div className="flex items-center gap-2">
                          <MapPinIcon size={18} />
                          Maranhão
                        </div>

                        <div className="flex items-center gap-2">
                          <UserIcon size={18} />
                          João Silva
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATS */}

                <div className="grid flex-1 grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="rounded-2xl bg-slate-100 p-6">
                    <CalendarIcon className="text-blue-600" />

                    <p className="mt-4 text-sm text-slate-500">Criado em</p>

                    <h3 className="text-2xl font-bold mt-1">10/04/2026</h3>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-6">
                    <UsersIcon className="text-blue-600" />

                    <p className="mt-4 text-sm text-slate-500">Integrantes</p>

                    <h3 className="text-2xl font-bold mt-1">12</h3>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-6">
                    <CircleCheckBigIcon className="text-green-600" />

                    <p className="mt-4 text-sm text-slate-500">Status</p>

                    <span className="mt-2 inline-flex rounded-full bg-green-600 px-4 py-2 text-white font-semibold">
                      Ativo
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-end">
                <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-300 px-7 py-4 font-semibold hover:bg-slate-100 transition">
                  <SettingsIcon size={20} />
                  Configurações
                </button>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-green-600 to-green-500 px-8 py-4 font-bold text-white shadow-lg hover:scale-[1.02] transition"
                >
                  ACESSAR LABORATÓRIO
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
