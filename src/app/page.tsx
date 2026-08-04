import React from "react";
import {
  Droplets,
  Trees,
  Activity,
  Cpu,
  MapPin,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Sprout,
  CheckCircle2,
  Building2,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* ---------------- NAVBAR ---------------- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-600 to-blue-500 p-2.5 rounded-xl text-white shadow-md">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
                Hidro<span className="text-green-600">Florestas</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                Startup de Base Científica
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a
              href="#solucao"
              className="hover:text-green-600 transition-colors"
            >
              A Solução
            </a>
            <a
              href="#pilares"
              className="hover:text-green-600 transition-colors"
            >
              Tecnologia
            </a>
            <a
              href="#impacto"
              className="hover:text-green-600 transition-colors"
            >
              Impacto Social
            </a>
            <a
              href="#equipe"
              className="hover:text-green-600 transition-colors"
            >
              Equipe
            </a>
          </nav>

          <a
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Acessar MVP
          </a>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-green-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-700/10 border border-amber-700/20 text-amber-700 text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                Itapecuru-Mirim, Maranhão
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Soluções Inteligentes para{" "}
                <span className="text-blue-500">Segurança Hídrica</span> e{" "}
                <span className="text-green-600">Restauração Florestal</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                Unimos ciência, inteligência artificial e Soluções Baseadas na
                Natureza para mitigar a salinização de poços, aumentar a recarga
                de aquíferos e promover a resiliência produtiva no Maranhão.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <a
                  href="#solucao"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-green-600/20 transition-all text-base"
                >
                  Conhecer Nossas Soluções
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="#projeto"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 transition-all text-base shadow-sm"
                >
                  Saiba mais sobre o Projeto
                </a>
              </div>

              {/* Tag IFMA */}
              <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-500 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>
                  Projeto apoiado pelo **IFMA Campus Itapecuru-Mirim** (Edital
                  PRPGI Nº 180/2025)
                </span>
              </div>
            </div>

            {/* Visual Card / Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-green-600 via-amber-700 to-blue-500 opacity-30 blur-xl"></div>
                <div className="relative bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Índice Analítico
                      </span>
                      <h3 className="text-lg font-bold text-slate-800">
                        IHFR Territorial
                      </h3>
                    </div>
                    <span className="bg-blue-500/10 text-blue-500 font-bold text-xs px-3 py-1 rounded-full border border-blue-500/20">
                      MVP Ativo
                    </span>
                  </div>

                  {/* Dashboard Mock */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-700/10 text-amber-700 rounded-lg">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Risco de Salinização
                          </p>
                          <p className="text-sm font-bold text-slate-800">
                            Moderado a Alto
                          </p>
                        </div>
                      </div>
                      <span className="text-amber-700 font-bold text-sm">
                        Formação Itapecuru
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600/10 text-green-600 rounded-lg">
                          <Trees className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Recomendação Manejo
                          </p>
                          <p className="text-sm font-bold text-slate-800">
                            SAF Regenerativo
                          </p>
                        </div>
                      </div>
                      <span className="text-green-600 font-bold text-sm">
                        Prioridade Alta
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                          <Droplets className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Infiltração de Água
                          </p>
                          <p className="text-sm font-bold text-slate-800">
                            Restrição Pedológica
                          </p>
                        </div>
                      </div>
                      <span className="text-blue-500 font-bold text-sm">
                        Recarga Lenta
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      **Camada Assistiva de IA (LLM):** Diagnóstico
                      interpretativo automatizado para traduzir dados técnicos
                      em ações comunitárias.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PROBLEMA / CONTEXTO ---------------- */}
      <section
        id="problema"
        className="py-16 bg-white border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
              O Paradoxo Hídrico do Médio Itapecuru
            </h2>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              Chuva abundante, mas escassez de água potável e solo degradado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-700/10 text-amber-700 rounded-xl flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Desafios Geológicos
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A Formação Itapecuru possui sedimentos argilosos de baixa
                permeabilidade. Solos adensados dificultam a infiltração natural
                e causam encharcamento e rebaixamento do lençol freático.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Salinização de Poços
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A degradação das áreas de recarga e a concentração capilar de
                sais em aquíferos rasos resultam na inutilização de poços
                comunitários por salinização progressiva.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-600/10 text-green-600 rounded-xl flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Falta de Diagnóstico Local
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Inexistência de ferramentas acessíveis e de baixo custo para que
                comunidades rurais e quilombolas possam medir a infiltração e
                planejar a recuperação do solo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRÊS PILARES (SOLUÇÃO) ---------------- */}
      <section id="pilares" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-green-600">
              Nossa Solução
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Tecnologia, Diagnóstico e Restauração em uma Só Plataforma
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pilar 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="p-3 bg-blue-500 text-white rounded-xl w-fit mb-6 shadow-md shadow-blue-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Plataforma Digital & IHFR
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  MVP digital que integra dados geológicos, pedológicos e de
                  satélite para calcular o **Índice HidroFlorestal de Risco
                  (IHFR)**, gerando diagnósticos automatizados.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Mapas
                  preliminares de risco hídrico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Camada
                  assistiva de IA (LLM)
                </li>
              </ul>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="p-3 bg-amber-700 text-white rounded-xl w-fit mb-6 shadow-md shadow-amber-700/20">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Kit de Diagnóstico Simplificado
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Tecnologia social de baixo custo e alta replicabilidade para
                  medição direta no campo: taxa de infiltração, compactação,
                  salinidade e qualidade básica da água.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" /> Autonomia
                  para a comunidade
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" /> Teste de
                  campo sem laboratório
                </li>
              </ul>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="p-3 bg-green-600 text-white rounded-xl w-fit mb-6 shadow-md shadow-green-600/20">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Restauração Produtiva (SBN)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Tradução de diagnósticos em Soluções Baseadas na Natureza:
                  implantação de Sistemas Agroflorestais (SAFs), florestas de
                  infiltração e manejo regenerativo.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />{" "}
                  Descompactação biogênica
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />{" "}
                  Recuperação do ciclo hidrológico
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- IMPACTO & ODS ---------------- */}
      <section
        id="impacto"
        className="py-16 bg-white border-t border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-green-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                  Justiça Territorial & Sustentabilidade
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Impacto direto em mais de 70 comunidades quilombolas e rurais
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Apenas na Bacia do Rio Itapecuru, mais de 10 mil usuários
                  potenciais sofrem com a falta de água potável e a degradação
                  dos solos. A HidroFlorestas democratiza o conhecimento
                  científico para garantir a segurança alimentar e hídrica.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <span className="text-2xl font-black text-green-400">
                    ODS 6
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    Água Potável e Saneamento
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <span className="text-2xl font-black text-blue-400">
                    ODS 13
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    Ação Contra a Mudança Global do Clima
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <span className="text-2xl font-black text-amber-400">
                    ODS 15
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    Vida Terrestre e Manejo do Solo
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <span className="text-2xl font-black text-slate-200">
                    ODS 10
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    Redução das Desigualdades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- EQUIPE / PROJETO ---------------- */}
      <section id="equipe" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Liderança Científica
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Desenvolvido por Pesquisadores do IFMA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Coordenador */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-green-600/10 text-green-600 rounded-xl shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-green-600 uppercase">
                  Coordenador do Projeto
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Fabio Mesquita de Souza
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Doutorado em Recursos Florestais / Engenharia Florestal
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  DERI-ITA | IFMA Campus Itapecuru-Mirim
                </p>
              </div>
            </div>

            {/* Equipe Multidisciplinar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-500 uppercase">
                  Corpo Técnico e Estudantes
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Equipe Multidisciplinar
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Iolanda S. Carmo, Humberto M. Silva
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Bolsistas: Arthur Gabryel, Ana Clara Cunha, Horacio Bizerra
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Droplets className="text-green-600" /> HidroFlorestas
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Startup de base científica focada em segurança hídrica,
                diagnóstico ambiental e restauração produtiva no Maranhão.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Apoio Institucional
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instituto Federal do Maranhão (IFMA)
                <br />
                Pró-Reitoria de Pesquisa, Pós-Graduação e Inovação (PRPGI)
                <br />
                Fábrica de Inovação - Campus Itapecuru-Mirim
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Contato
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                E-mail: fabio.souza@ifma.edu.br
                <br />
                Unidade Proponente: ITA / DERI-ITA
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Execução
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Início: 01/03/2026
                <br />
                Término: 31/10/2026
                <br />
                Edital PRPGI Nº 180/2025
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            &copy; 2026 HidroFlorestas. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
