import { useEffect, useState } from "react";
import { buscarDashboardColaborador } from "../../services/dashboardService";
import { obterEventos, type EventoGlobal } from "../../services/eventService";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import { MessageBox } from "../../components/MessageBox/MessageBox";
import { MuralBoard } from "../../components/MuralBoard/MuralBoard";
import { Kicker, DatePill, Button, FormField } from "../../components";
import type { UsuarioAutenticado } from "../../types/auth";
import type { DashboardColaboradorData } from "../../types/dashboard";

function saudacaoPorHorario(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(dataIso: string): { dia: string; mes: string } {
  const data = new Date(`${dataIso}T00:00:00`);
  const dia = data.toLocaleDateString("pt-BR", { day: "2-digit" });
  const mes = data
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  return { dia, mes };
}

type StatTone = "neutro" | "atencao" | "critico" | "baixo";

const TONE_CARD_CLASSES: Record<StatTone, string> = {
  neutro: "bg-white border border-black/10",
  atencao: "bg-amber/10 border border-amber/25",
  critico: "bg-error/10 border border-error/25",
  baixo: "bg-gold/10 border border-gold/25",
};

const TONE_VALUE_CLASSES: Record<StatTone, string> = {
  neutro: "text-black",
  atencao: "text-amber",
  critico: "text-error",
  baixo: "text-[#b5872f]",
};

function StatCard({
  tone,
  value,
  label,
}: {
  tone: StatTone;
  value: number | string;
  label: string;
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-md p-4 ${TONE_CARD_CLASSES[tone]}`}
    >
      <span
        className={`font-display text-xl font-semibold ${TONE_VALUE_CLASSES[tone]}`}
      >
        {value}
      </span>
      <span className="font-body text-[12px] leading-tight text-ink-soft">
        {label}
      </span>
    </div>
  );
}

// Wrapper padrão de card de seção — evita repetir bg/border/padding em cada bloco
function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="rounded-lg border border-black/10 bg-white p-6"
    >
      <h2
        id={id}
        className="m-0 mb-4 font-display text-lg font-semibold text-black"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

interface DashboardColaboradorProps {
  dadosIniciais?: DashboardColaboradorData;
  usuario?: UsuarioAutenticado | null;
}

export default function DashboardColaborador({
  dadosIniciais,
  usuario,
}: DashboardColaboradorProps) {
  const [dados, setDados] = useState<DashboardColaboradorData | null>(
    dadosIniciais ?? null,
  );
  const [eventosCompartilhados, setEventosCompartilhados] = useState<
    EventoGlobal[]
  >([]);
  const [acaoInscritosAberta, setAcaoInscritosAberta] = useState<number | null>(
    null,
  );
  const [carregando, setCarregando] = useState(!dadosIniciais);
  const [erro, setErro] = useState<string | null>(null);
  const [estoqueAtualizado, setEstoqueAtualizado] = useState(248);
  const [salvandoEstoque, setSalvandoEstoque] = useState(false);

  useEffect(() => {
    setEventosCompartilhados(obterEventos());

    function atualizarEventos() {
      setEventosCompartilhados(obterEventos());
    }
    window.addEventListener("ong_eventos_atualizados", atualizarEventos);
    return () => {
      window.removeEventListener("ong_eventos_atualizados", atualizarEventos);
    };
  }, []);

  useEffect(() => {
    if (dadosIniciais) return;
    let ativo = true;
    buscarDashboardColaborador()
      .then((resposta) => {
        if (ativo) setDados(resposta);
      })
      .catch((err) => {
        if (ativo)
          setErro(
            err instanceof Error ? err.message : "Erro ao carregar o painel.",
          );
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [dadosIniciais]);

  function abrirDoacoes(evento: React.MouseEvent<HTMLAnchorElement>) {
    evento.preventDefault();
    window.history.pushState({}, "", "/dashboard/doacoes");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function atualizarEstoque(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setSalvandoEstoque(true);
    window.setTimeout(() => setSalvandoEstoque(false), 400);
  }

  if (carregando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6">
        <p role="status" className="font-body text-sm text-ink-soft">
          Carregando painel...
        </p>
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6">
        <p role="alert" className="font-body text-sm text-error">
          {erro ?? "Não foi possível carregar o painel."}
        </p>
      </div>
    );
  }

  const { colaborador, estoque, doacoes, proximasAcoes } = dados;
  const nomeColaborador = usuario?.nome || colaborador.nome || "colaborador";

  return (
    // max-w limita a largura útil — é isso que resolve o "muito largo".
    // Sem isso, em monitor grande cada seção estica até a borda da tela.
    <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-8 md:px-10">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <Kicker>Painel do colaborador</Kicker>
          <h1 className="m-0 font-display text-[26px] font-semibold text-black md:text-[32px]">
            {saudacaoPorHorario()}, {nomeColaborador.split(" ")[0]}
          </h1>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-pill border border-black px-4 py-2 font-body text-xs font-bold text-black transition hover:bg-black hover:text-white"
          onClick={() => {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            window.location.assign("/login");
          }}
        >
          Sair
        </button>
      </header>

      {/* Grid 2 colunas no desktop: conteúdo principal (2/3) + lateral (1/3).
      É o que dá a "cara de dashboard organizado" em vez de tudo empilhado. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <SectionCard id="secao-estoque" title="Estoque de medicamentos">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                tone="neutro"
                value={estoque.totalMedicamentos}
                label="Cadastrados"
              />
              <StatCard
                tone="atencao"
                value={estoque.proximosVencimento}
                label="Perto de vencer"
              />
              <StatCard
                tone="critico"
                value={estoque.vencidos}
                label="Vencidos"
              />
              <StatCard
                tone="baixo"
                value={estoque.estoqueBaixo}
                label="Estoque baixo"
              />
            </div>
            <form
              onSubmit={atualizarEstoque}
              className="mt-5 flex flex-wrap items-end gap-3 border-t border-black/10 pt-5"
            >
              <FormField
                id="estoque-total"
                label="Atualizar total em estoque"
                type="number"
                min={0}
                value={estoqueAtualizado}
                onChange={(evento) =>
                  setEstoqueAtualizado(Number(evento.target.value))
                }
              />
              <Button type="submit" variant="dark">
                {salvandoEstoque ? "Salvando..." : "Salvar estoque"}
              </Button>
            </form>
          </SectionCard>

          <SectionCard id="secao-acoes" title="Próximas ações">
            {eventosCompartilhados.length === 0 ? (
              <p className="font-body text-sm text-ink-soft">
                Nenhuma ação agendada no momento.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {eventosCompartilhados.map((acao) => {
                  const { dia, mes } = formatarData(acao.data);
                  const inscritos = acao.voluntariosInscritos || 0;
                  const aberto = acaoInscritosAberta === acao.id;

                  return (
                    <div
                      key={acao.id}
                      className="rounded-md border border-black/10 p-3.5 bg-white transition"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <DatePill label={`${dia} ${mes.toUpperCase()}`} />
                          <div className="flex flex-col gap-0.5">
                            <h3 className="m-0 font-display text-[15px] font-semibold text-black">
                              {acao.titulo}
                            </h3>
                            <span className="font-body text-xs text-ink-soft">
                              {acao.local || "Campinas"} · {inscritos}{" "}
                              {inscritos === 1 ? "voluntário" : "voluntários"}{" "}
                              inscritos
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="cursor-pointer rounded-pill border border-[#1a745a] px-3 py-1 font-body text-xs font-bold text-[#1a745a] hover:bg-[#e6f4ea] transition"
                          onClick={() =>
                            setAcaoInscritosAberta((atual) =>
                              atual === acao.id ? null : acao.id,
                            )
                          }
                        >
                          👥 {inscritos} voluntários{" "}
                          {aberto ? "▲ Fechar" : "▼ Ver equipe"}
                        </button>
                      </div>

                      {aberto && (
                        <div className="mt-3.5 pt-3 border-t border-black/10 flex flex-col gap-2 bg-[#faf8f4] p-3 rounded-md">
                          <h4 className="m-0 text-xs font-bold uppercase tracking-wider text-ink-soft">
                            Voluntários que confirmaram presença (
                            {acao.inscritosDetalhes?.length || 0}):
                          </h4>

                          {!acao.inscritosDetalhes ||
                          acao.inscritosDetalhes.length === 0 ? (
                            <p className="m-0 text-xs text-ink-soft italic">
                              Nenhum voluntário inscrito nesta ação ainda.
                            </p>
                          ) : (
                            acao.inscritosDetalhes.map((vol, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-start flex-wrap gap-2 p-2 bg-white rounded border border-black/5 text-xs"
                              >
                                <div>
                                  <strong className="text-black font-semibold block">
                                    👤 {vol.nome}
                                  </strong>
                                  <span className="text-ink-soft block">
                                    ✉️{" "}
                                    <a
                                      href={`mailto:${vol.email}`}
                                      className="text-[#1a745a] underline"
                                    >
                                      {vol.email}
                                    </a>
                                  </span>
                                  {vol.sobre && (
                                    <p className="m-0 mt-1 italic text-ink-soft">
                                      "{vol.sobre}"
                                    </p>
                                  )}
                                </div>
                                {vol.telefone && (
                                  <div className="text-right">
                                    <span className="font-mono text-black font-semibold block">
                                      📞 {vol.telefone}
                                    </span>
                                    <a
                                      href={`https://wa.me/55${vol.telefone.replace(/\D/g, "")}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[#1a745a] font-bold underline text-[11px]"
                                    >
                                      Chamar no WhatsApp →
                                    </a>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-5">
              <EventCalendar
                events={eventosCompartilhados.map((acao) => ({
                  id: acao.id,
                  title: acao.titulo,
                  date: acao.data,
                  meta: `${acao.local || "Campinas"} · ${acao.voluntariosInscritos || 0} voluntários`,
                }))}
              />
            </div>
          </SectionCard>
        </div>

        {/* Coluna lateral: cards mais curtos e independentes — o que antes
        eram 2 seções full-width viram blocos compactos lado a lado
        com o conteúdo principal, aproveitando a largura da tela. */}
        <div className="flex flex-col gap-6">
          <SectionCard id="secao-doacoes" title="Doações do mês">
            <div className="flex flex-col gap-4 rounded-md bg-black p-5">
              <div>
                <span className="block font-display text-xl font-semibold text-parchment">
                  {formatarMoeda(doacoes.valorTotalMes)}
                </span>
                <span className="font-body text-xs text-[#c8c8c3]">
                  arrecadados este mês
                </span>
              </div>
              <div>
                <span className="block font-display text-xl font-semibold text-parchment">
                  {doacoes.quantidadeMes}
                </span>
                <span className="font-body text-xs text-[#c8c8c3]">
                  {doacoes.quantidadeMes === 1
                    ? "doação recebida"
                    : "doações recebidas"}
                </span>
              </div>
            </div>
            <a
              href="/dashboard/doacoes"
              onClick={abrirDoacoes}
              className="mt-3 inline-block font-body text-sm font-bold text-black underline underline-offset-2"
            >
              Ver gestão de doações →
            </a>
          </SectionCard>

          <SectionCard id="secao-voluntarios" title="Voluntários">
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="font-body text-sm text-ink-soft">Ativos</span>
                <strong className="font-display text-lg font-semibold text-black">
                  9
                </strong>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-body text-sm text-ink-soft">
                  Aguardando confirmação
                </span>
                <strong className="font-display text-lg font-semibold text-black">
                  3
                </strong>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-body text-sm text-ink-soft">
                  Inscrições nas próximas <br /> ações
                </span>
                <strong className="font-display text-lg font-semibold text-black">
                  18
                </strong>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MessageBox
          author="colaborador"
          usuarioNome={usuario?.nome || "Colaborador(a)"}
          usuarioEmail={usuario?.email || "carlos.colab@saudecampinas.org"}
        />
        <MuralBoard
          tipoUsuario="colaborador"
          usuarioNome={usuario?.nome || "Colaborador(a)"}
          usuarioEmail={usuario?.email || "carlos.colab@saudecampinas.org"}
        />
      </div>
    </div>
  );
}
