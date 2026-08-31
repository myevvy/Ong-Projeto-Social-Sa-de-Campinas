import { useState, useEffect, type FormEvent } from "react";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import { MessageBox } from "../../components/MessageBox/MessageBox";
import { MuralBoard } from "../../components/MuralBoard/MuralBoard";
import { LogoutButton } from "../../components/LogoutButton/LogoutButton";
import {
  obterSolicitacoes,
  atualizarStatusSolicitacao,
  atualizarTipoSolicitacao,
  type SolicitacaoAcesso,
  type StatusAcesso,
} from "../../services/authService";
import {
  Pill,
  HandCoins,
  ArrowRight,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Users,
  User,
  Mail,
  Phone,
  MessageCircle,
  UserX,
  Pencil,
  Trash2,
  Check,
  LogOut,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  obterEventos,
  adicionarEvento,
  atualizarEvento,
  removerEvento,
  removerVoluntarioDeEvento,
  type EventoGlobal,
  type VoluntarioInscrito,
} from "../../services/eventService";
import { VolunteerList } from "../../components/VolunteerList/VolunteerList";

function navegarPara(caminho: string) {
  window.history.pushState({}, "", caminho);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function DashboardAdmin() {
  const [eventos, setEventos] = useState<EventoGlobal[]>([]);
  const [eventoInscritosAberto, setEventoInscritosAberto] = useState
   < number | null
  >(null);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAcesso[]>([]);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    data: "",
    comentarios: "",
    local: "Centro de Campinas",
    category: "Mutirão",
    vagas: 6,
  });
  const [eventoEmEdicao, setEventoEmEdicao] = useState<number | null>(null);
  const [formularioAberto, setFormularioAberto] = useState(false);

  useEffect(() => {
    setSolicitacoes(obterSolicitacoes());
    setEventos(obterEventos());

    function atualizarEventosAoVivo() {
      setEventos(obterEventos());
    }
    window.addEventListener("ong_eventos_atualizados", atualizarEventosAoVivo);
    return () => {
      window.removeEventListener(
        "ong_eventos_atualizados",
        atualizarEventosAoVivo,
      );
    };
  }, []);

  const totalVoluntarios = solicitacoes.filter(
    (s) => s.tipo === "voluntario" && s.status === "aceito",
  ).length;
  const pendentesVoluntarios = solicitacoes.filter(
    (s) => s.tipo === "voluntario" && s.status === "pendente",
  ).length;

  const totalColaboradores = solicitacoes.filter(
    (s) => s.tipo === "colaborador" && s.status === "aceito",
  ).length;
  const pendentesColaboradores = solicitacoes.filter(
    (s) => s.tipo === "colaborador" && s.status === "pendente",
  ).length;

  function criarEvento(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!novoEvento.titulo.trim() || !novoEvento.data) return;

    if (eventoEmEdicao) {
      const atualizados = atualizarEvento(eventoEmEdicao, {
        titulo: novoEvento.titulo.trim(),
        data: novoEvento.data,
        comentarios: novoEvento.comentarios.trim(),
        local: novoEvento.local.trim(),
        category: novoEvento.category,
        vagas: Number(novoEvento.vagas) || 6,
      });
      setEventos(atualizados);
    } else {
      const atualizados = adicionarEvento({
        titulo: novoEvento.titulo.trim(),
        data: novoEvento.data,
        comentarios: novoEvento.comentarios.trim(),
        local: novoEvento.local.trim(),
        category: novoEvento.category,
        vagas: Number(novoEvento.vagas) || 6,
      });
      setEventos(atualizados);
    }
    setNovoEvento({
      titulo: "",
      data: "",
      comentarios: "",
      local: "Centro de Campinas",
      category: "Mutirão",
      vagas: 6,
    });
    setEventoEmEdicao(null);
    setFormularioAberto(false);
  }

  function excluirEvento(id: number) {
    const atualizados = removerEvento(id);
    setEventos(atualizados);
  }

  function handleRemoverVoluntario(eventoId: number, nomeOuEmail: string) {
    const atualizados = removerVoluntarioDeEvento(eventoId, nomeOuEmail);
    setEventos(atualizados);
  }

  function handleAtualizarStatus(id: number, status: StatusAcesso) {
    const atualizadas = atualizarStatusSolicitacao(id, status);
    setSolicitacoes(atualizadas);
  }

  function handleAtualizarTipo(id: number, tipo: "voluntario" | "colaborador") {
    const atualizadas = atualizarTipoSolicitacao(id, tipo);
    setSolicitacoes(atualizadas);
  }

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-8 md:px-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
            Central de gestão · acesso restrito
          </p>
          <h1 className="m-0 font-display text-[28px] font-semibold text-black md:text-[32px]">
            Olá, administração.
          </h1>
          <p className="m-0 mt-1.5 max-w-md font-body text-sm text-ink-soft">
            Uma visão geral para cuidar da operação e das pessoas que fazem a
            missão acontecer.
          </p>
        </div>
        <LogoutButton />
      </header>

      <section
        aria-label="Resumos da organização"
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        <article className="flex flex-col gap-1 rounded-md border border-black/10 bg-white p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Estoque total
          </span>
          <strong className="font-display text-2xl font-semibold text-black">
            248
          </strong>
          <small className="font-body text-xs text-ink-soft">
            unidades cadastradas
          </small>
        </article>
        <article className="flex flex-col gap-1 rounded-md border border-black/10 bg-white p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Doações no mês
          </span>
          <strong className="font-display text-2xl font-semibold text-black">
            R$ 4.230,50
          </strong>
          <small className="font-body text-xs text-ink-soft">
            27 registros manuais
          </small>
        </article>
        <article className="flex flex-col gap-1 rounded-md border border-volunteer/25 bg-volunteer-soft p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Voluntários
          </span>
          <strong className="font-display text-2xl font-semibold text-volunteer">
            {totalVoluntarios || 1}
          </strong>
          <small className="font-body text-xs text-ink-soft">
            {pendentesVoluntarios} aguardando análise
          </small>
        </article>
        <article className="flex flex-col gap-1 rounded-md border border-amber/25 bg-amber/10 p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Colaboradores
          </span>
          <strong className="font-display text-2xl font-semibold text-amber">
            {totalColaboradores || 1}
          </strong>
          <small className="font-body text-xs text-ink-soft">
            {pendentesColaboradores} solicitações pendentes
          </small>
        </article>
      </section>

      {/* medicamentos + doacoes */}
      <section
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        aria-label="Gestão operacional"
      >
        <article className="group flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-7 transition-all hover:border-black/20 hover:shadow-md">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Pill size={20} />
            </span>
            <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
              Farmácia social
            </p>
          </div>

          <h2 className="m-0 font-display text-[1.15rem] font-semibold text-black">
            Medicamentos
          </h2>

          <p className="m-0 flex-grow font-body text-sm text-ink-soft">
            Confira validade, lotes e níveis de estoque antes dos próximos
            atendimentos.
          </p>

          <button
            type="button"
            onClick={() => navegarPara("/dashboard/medicamentos")}
            className="mt-2 inline-flex items-center justify-between gap-2 rounded-pill border border-black/15 bg-white px-4 py-3 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5 active:scale-[0.98]"
          >
            Abrir cadastro de medicamentos
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </article>

        <article className="group flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-7 transition-all hover:border-black/20 hover:shadow-md">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <HandCoins size={20} />
            </span>
            <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
              Financeiro
            </p>
          </div>

          <h2 className="m-0 font-display text-[1.15rem] font-semibold text-black">
            Doações
          </h2>

          <p className="m-0 flex-grow font-body text-sm text-ink-soft">
            Registre manualmente cada contribuição com os dados de contato do
            doador.
          </p>

          <button
            type="button"
            onClick={() => navegarPara("/dashboard/doacoes")}
            className="mt-2 inline-flex items-center justify-between gap-2 rounded-pill border border-black/15 bg-white px-4 py-3 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5 active:scale-[0.98]"
          >
            Abrir cadastro de doações
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </article>
      </section>

      {/* acao de rua */}
      <section className="flex flex-col gap-5 rounded-xl border border-black/10 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
              Agenda da rua
            </p>
            <h2 className="m-0 font-display text-[1.15rem] font-semibold text-black">
              Eventos e ações
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setFormularioAberto((aberto) => !aberto)}
            className="inline-flex items-center gap-1.5 rounded-pill border bg-black px-4 py-2.5 font-body text-[13px] font-bold text-white transition-colors hover:bg-gold/10"
          >
            {formularioAberto ? (
              <>
                <X size={15} /> Fechar
              </>
            ) : (
              <>
                <Plus size={15} /> Criar evento
              </>
            )}
          </button>
        </div>

        {formularioAberto && (
          <form
            onSubmit={criarEvento}
            className="grid grid-cols-1 gap-4 rounded-lg border border-black/10 bg-parchment/40 p-6 md:grid-cols-2"
          >
            <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
              Nome do evento *
              <input
                required
                placeholder="Ex.: Mutirão de atendimento de rua"
                value={novoEvento.titulo}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, titulo: e.target.value })
                }
                className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
              />
            </label>

            <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
              Data *
              <input
                required
                type="date"
                value={novoEvento.data}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, data: e.target.value })
                }
                className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
              />
            </label>

            <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
              Local da ação
              <input
                placeholder="Ex.: Vila Industrial, Campinas"
                value={novoEvento.local}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, local: e.target.value })
                }
                className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
              />
            </label>

            <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
              Categoria
              <select
                value={novoEvento.category}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, category: e.target.value })
                }
                className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
              >
                <option value="Mutirão">Mutirão</option>
                <option value="Campanha">Campanha</option>
                <option value="Capacitação">Capacitação</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
              Vagas para voluntários
              <input
                type="number"
                min="1"
                value={novoEvento.vagas}
                onChange={(e) =>
                  setNovoEvento({
                    ...novoEvento,
                    vagas: Number(e.target.value),
                  })
                }
                className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
              />
            </label>

            <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black md:col-span-2">
              Comentários / Descrição
              <textarea
                value={novoEvento.comentarios}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, comentarios: e.target.value })
                }
                placeholder="Orientações para a equipe e descrição do evento"
                rows={3}
                className="resize-y rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-fit justify-self-center items-center rounded-pill bg-black px-5 py-3 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90 md:col-span-2"
            >
              {eventoEmEdicao ? "Atualizar evento" : "Salvar evento"}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <EventCalendar
            events={eventos.map((evento) => ({
              id: evento.id,
              title: evento.titulo,
              date: evento.data,
              details: evento.comentarios || evento.description || "",
              meta: `${evento.category || "Evento"} · ${evento.local || "Campinas"}`,
            }))}
          />

          <div className="flex flex-col gap-3">
            {eventos.map((evento) => {
              const dia = new Date(`${evento.data}T00:00:00`).getDate();
              const listaAberta = eventoInscritosAberto === evento.id;
              const totalInscritos = evento.inscritosDetalhes?.length || 0;

              return (
                <div
                  key={evento.id}
                  className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 md:flex-row"
                >
                  <div
                    aria-label={`Dia ${dia}`}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black font-display text-lg font-bold text-parchment"
                  >
                    {dia}
                  </div>

                  <div className="flex flex-1 flex-col gap-1">
                    <strong className="font-body text-sm font-bold text-black">
                      {evento.titulo}
                    </strong>
                    <span className="font-body text-xs text-ink-soft">
                      {new Date(`${evento.data}T00:00:00`).toLocaleDateString(
                        "pt-BR",
                      )}{" "}
                      · {evento.category || "Mutirão"} ·{" "}
                      {evento.local || "Campinas"}
                    </span>
                    <p className="m-0 font-body text-sm text-ink-soft">
                      {evento.comentarios ||
                        evento.description ||
                        "Sem comentários registrados."}
                    </p>

                    
<VolunteerList
  inscritos={evento.inscritosDetalhes || []}
  vagas={evento.vagas || 6}
  aberto={eventoInscritosAberto === evento.id}
  onToggle={() =>
    setEventoInscritosAberto((atual) =>
      atual === evento.id ? null : evento.id,
    )
  }
  onRemover={(nomeOuEmail) =>
    handleRemoverVoluntario(evento.id, nomeOuEmail)
  }
/>

                    <div className="mt-3 flex flex-wrap gap-2 border-t border-black/10 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setNovoEvento({
                            titulo: evento.titulo,
                            data: evento.data,
                            comentarios:
                              evento.comentarios || evento.description || "",
                            local: evento.local || "Centro de Campinas",
                            category: evento.category || "Mutirão",
                            vagas: evento.vagas || 6,
                          });
                          setEventoEmEdicao(evento.id);
                          setFormularioAberto(true);
                        }}
                        className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill border border-black/20 bg-white px-3 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5"
                      >
                        <Pencil size={14} className="shrink-0" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => excluirEvento(evento.id)}
                        className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill px-3 font-body text-[13px] font-bold text-error/70 transition-colors hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 size={14} className="shrink-0" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção única de Gestão e Aprovação de Usuários (Voluntários e Colaboradores) */}
      <section
        aria-label="Gestão de cadastros e acessos"
        className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
              Central de Cadastros
            </p>
            <h2 className="m-0 font-display text-[1.15rem] font-semibold text-black">
              Aprovação e Gestão de Acessos
            </h2>
          </div>
          <span className="inline-flex h-fit items-center rounded-pill bg-amber/15 px-3 py-1.5 font-body text-xs font-bold text-amber">
            {solicitacoes.filter((s) => s.status === "pendente").length}{" "}
            pendentes
          </span>
        </div>
        <p className="m-0 max-w-2xl font-body text-sm text-ink-soft">
          Avalie e aprove solicitações de cadastro. Você pode decidir se o
          usuário atuará como Voluntário ou Colaborador e definir sua
          permissão de acesso.
        </p>

        <ApprovalPanelContent
          items={solicitacoes}
          onAtualizarStatus={handleAtualizarStatus}
          onAtualizarTipo={handleAtualizarTipo}
        />
      </section>

      {/* Seção de Comunicação Interna e Mural da Equipe */}
      <section
        aria-label="Comunicação e Mural"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <MessageBox
          author="admin"
          usuarioNome="Coordenação Geral"
          usuarioEmail="admin@saudecampinas.org"
        />
        <MuralBoard
          tipoUsuario="admin"
          usuarioNome="Coordenação Geral"
          usuarioEmail="admin@saudecampinas.org"
        />
      </section>
    </main>
  );
}

function ApprovalPanelContent({
  items,
  onAtualizarStatus,
  onAtualizarTipo,
}: {
  items: SolicitacaoAcesso[];
  onAtualizarStatus: (id: number, status: StatusAcesso) => void;
  onAtualizarTipo: (id: number, tipo: "voluntario" | "colaborador") => void;
}) {
  const [filtroStatus, setFiltroStatus] = useState<StatusAcesso | "todos">(
    "pendente",
  );
  const [filtroTipo, setFiltroTipo] = useState
    <"todos" | "voluntario" | "colaborador"
  >("todos");
  const [busca, setBusca] = useState("");
  const [mensagemFeedback, setMensagemFeedback] = useState<string | null>(null);

  function executarAtualizarStatus(
    id: number,
    status: StatusAcesso,
    nome: string,
  ) {
    onAtualizarStatus(id, status);
    const textoStatus =
      status === "aceito"
        ? "aprovado(a)"
        : status === "recusado"
          ? "recusado(a)"
          : "reaberto(a) para análise";
    setMensagemFeedback(
      `Status de ${nome} alterado para "${textoStatus}" com sucesso.`,
    );
    window.setTimeout(() => setMensagemFeedback(null), 4000);
  }

  function executarAtualizarTipo(
    id: number,
    tipo: "voluntario" | "colaborador",
    nome: string,
  ) {
    onAtualizarTipo(id, tipo);
    setMensagemFeedback(
      `Perfil de ${nome} alterado para "${tipo === "voluntario" ? "Voluntário" : "Colaborador"}".`,
    );
    window.setTimeout(() => setMensagemFeedback(null), 4000);
  }

  const contagens = {
    todos: items.length,
    pendente: items.filter((r) => r.status === "pendente").length,
    aceito: items.filter((r) => r.status === "aceito").length,
    recusado: items.filter((r) => r.status === "recusado").length,
  };

  const exibidos = items.filter((registro) => {
    const matchStatus =
      filtroStatus === "todos" || registro.status === filtroStatus;
    const matchTipo = filtroTipo === "todos" || registro.tipo === filtroTipo;
    const texto =
      `${registro.nome} ${registro.email} ${registro.telefone} ${registro.sobre || ""}`.toLowerCase();
    const matchBusca = texto.includes(busca.toLowerCase());
    return matchStatus && matchTipo && matchBusca;
  });

  return (
    <>
      {mensagemFeedback && (
        <div
          role="status"
          className="inline-flex w-fit items-center gap-1.5 rounded-md border border-volunteer/25 bg-volunteer-soft px-4 py-2.5 font-body text-[13px] font-semibold text-volunteer"
        >
          <Check size={14} />
          {mensagemFeedback}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div
          aria-label="Filtro por status"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {(
            [
              { key: "pendente", label: "Pendentes" },
              { key: "aceito", label: "Aceitos" },
              { key: "recusado", label: "Recusados" },
              { key: "todos", label: "Todos" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFiltroStatus(item.key)}
              className={`flex flex-col items-center gap-0.5 rounded-md border px-3 py-3 transition-colors ${
                filtroStatus === item.key
                  ? "border-black bg-black text-parchment"
                  : "border-black/15 bg-white text-black hover:bg-black/5"
              }`}
            >
              <strong className="font-display text-lg font-semibold">
                {contagens[item.key]}
              </strong>
              <span className="font-body text-xs">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-[13px] font-bold text-black">
            Filtrar perfil:
          </span>
          <button
            type="button"
            onClick={() => setFiltroTipo("todos")}
            className={`rounded-pill px-3.5 py-1.5 font-body text-[13px] font-bold transition-colors ${
              filtroTipo === "todos"
                ? "bg-black text-parchment"
                : "border border-black/20 bg-white text-black hover:bg-black/5"
            }`}
          >
            Todos os perfis
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo("voluntario")}
            className={`rounded-pill px-3.5 py-1.5 font-body text-[13px] font-bold transition-colors ${
              filtroTipo === "voluntario"
                ? "bg-volunteer text-parchment"
                : "border border-volunteer/30 bg-volunteer-soft text-volunteer hover:opacity-90"
            }`}
          >
            Voluntários
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo("colaborador")}
            className={`rounded-pill px-3.5 py-1.5 font-body text-[13px] font-bold transition-colors ${
              filtroTipo === "colaborador"
                ? "bg-amber text-parchment"
                : "border border-amber/30 bg-amber/10 text-amber hover:opacity-90"
            }`}
          >
            Colaboradores
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
        Buscar pessoa
        <div className="flex items-center gap-2 rounded-sm border border-black/[0.18] bg-white px-4 py-3 focus-within:outline focus-within:outline-2 focus-within:outline-amber focus-within:outline-offset-1">
          <Search size={15} className="shrink-0 text-black/40" />
          <input
            type="search"
            placeholder="Nome, e-mail, telefone ou interesse"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            className="w-full border-none bg-transparent font-body text-sm font-normal text-black outline-none"
          />
        </div>
      </label>

      <div className="flex flex-col gap-3">
        {exibidos.length === 0 && (
          <p className="m-0 font-body text-sm text-ink-soft">
            Nenhuma solicitação encontrada para os filtros selecionados.
          </p>
        )}
        {exibidos.map((registro) => (
          <div
            key={registro.id}
            className="flex flex-col gap-4 rounded-lg border border-black/10 p-4 lg:flex-row lg:items-start lg:justify-between"
          >
            <div className="flex flex-col gap-0.5">
              <strong className="font-body text-sm font-bold text-black">
                {registro.nome}
              </strong>
              <span className="font-body text-xs text-ink-soft">
                {registro.email}
              </span>
              <span className="font-body text-xs text-ink-soft">
                {registro.telefone}
              </span>
              {registro.sobre && (
                <p className="m-0 mt-1 max-w-md font-body text-xs italic text-ink-soft">
                  "{registro.sobre}"
                </p>
              )}
              <small className="mt-1 font-body text-[10px] text-black/40">
                Solicitado em{" "}
                {new Date(
                  `${registro.dataSolicitacao}T00:00:00`,
                ).toLocaleDateString("pt-BR")}
              </small>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div
                title="Definir perfil da pessoa"
                className="flex items-center gap-2"
              >
                <span className="font-body text-xs font-bold text-black/50">
                  Perfil:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    executarAtualizarTipo(
                      registro.id,
                      "voluntario",
                      registro.nome,
                    )
                  }
                  className={`rounded-pill px-3 py-1.5 font-body text-xs font-bold transition-colors ${
                    registro.tipo === "voluntario"
                      ? "bg-volunteer text-parchment"
                      : "border border-black/15 bg-white text-black hover:bg-black/5"
                  }`}
                >
                  Voluntário
                </button>
                <button
                  type="button"
                  onClick={() =>
                    executarAtualizarTipo(
                      registro.id,
                      "colaborador",
                      registro.nome,
                    )
                  }
                  className={`rounded-pill px-3 py-1.5 font-body text-xs font-bold transition-colors ${
                    registro.tipo === "colaborador"
                      ? "bg-amber text-parchment"
                      : "border border-black/15 bg-white text-black hover:bg-black/5"
                  }`}
                >
                  Colaborador
                </button>
              </div>

              <span
                className={`rounded-pill px-3 py-1 font-body text-xs font-bold capitalize ${
                  registro.status === "aceito"
                    ? "bg-volunteer-soft text-volunteer"
                    : registro.status === "recusado"
                      ? "bg-error/10 text-error"
                      : "bg-amber/15 text-amber"
                }`}
              >
                {registro.status}
              </span>

              <div className="flex flex-wrap gap-2">
                {registro.status === "pendente" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "aceito",
                          registro.nome,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-pill bg-volunteer px-3.5 py-2 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90"
                    >
                      <Check size={14} />
                      Aceitar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "recusado",
                          registro.nome,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-pill border border-error/40 px-3.5 py-2 font-body text-[13px] font-bold text-error transition-colors hover:bg-error/10"
                    >
                      <X size={14} />
                      Recusar
                    </button>
                  </>
                )}

                {registro.status === "aceito" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "recusado",
                          registro.nome,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-pill border border-error/40 px-3.5 py-2 font-body text-[13px] font-bold text-error transition-colors hover:bg-error/10"
                    >
                      <X size={14} />
                      Mudar p/ Recusar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "pendente",
                          registro.nome,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-pill border border-black/20 bg-white px-3.5 py-2 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5"
                    >
                      <RotateCcw size={14} />
                      Reabrir análise
                    </button>
                  </>
                )}

                {registro.status === "recusado" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "aceito",
                          registro.nome,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-pill bg-volunteer px-3.5 py-2 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90"
                    >
                      <Check size={14} />
                      Aprovar acesso
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "pendente",
                          registro.nome,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-pill border border-black/20 bg-white px-3.5 py-2 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5"
                    >
                      <RotateCcw size={14} />
                      Reabrir análise
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}