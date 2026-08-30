import { useState, useEffect, type FormEvent } from "react";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import { MessageBox } from "../../components/MessageBox/MessageBox";
import { MuralBoard } from "../../components/MuralBoard/MuralBoard";
import {
  obterSolicitacoes,
  atualizarStatusSolicitacao,
  atualizarTipoSolicitacao,
  type SolicitacaoAcesso,
  type StatusAcesso,
} from "../../services/authService";
import {
  obterEventos,
  adicionarEvento,
  atualizarEvento,
  removerEvento,
  removerVoluntarioDeEvento,
  type EventoGlobal,
  type VoluntarioInscrito,
} from "../../services/eventService";
import "./DashboardAdmin.css";

function navegarPara(caminho: string) {
  window.history.pushState({}, "", caminho);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function DashboardAdmin() {
  const [eventos, setEventos] = useState<EventoGlobal[]>([]);
  const [eventoInscritosAberto, setEventoInscritosAberto] = useState<
    number | null
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
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__kicker">
            Central de gestão · acesso restrito
          </p>
          <h1>Olá, administração.</h1>
          <p className="admin-page__intro">
            Uma visão geral para cuidar da operação e das pessoas que fazem a
            missão acontecer.
          </p>
        </div>
        <button
          className="admin-page__logout"
          type="button"
          onClick={() => {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            navegarPara("/login");
          }}
        >
          Sair
        </button>
      </header>

      <section
        className="admin-page__metrics"
        aria-label="Resumos da organização"
      >
        <article>
          <span>Estoque total</span>
          <strong>248</strong>
          <small>unidades cadastradas</small>
        </article>
        <article>
          <span>Doações no mês</span>
          <strong>R$ 4.230,50</strong>
          <small>27 registros manuais</small>
        </article>
        <article>
          <span>Voluntários</span>
          <strong>{totalVoluntarios || 1}</strong>
          <small>{pendentesVoluntarios} aguardando análise</small>
        </article>
        <article>
          <span>Colaboradores</span>
          <strong>{totalColaboradores || 1}</strong>
          <small>{pendentesColaboradores} solicitações pendentes</small>
        </article>
      </section>

      <section className="admin-page__grid" aria-label="Gestão operacional">
        <article className="admin-panel admin-panel--inventory">
          <p className="admin-page__kicker">Farmácia social</p>
          <h2>Medicamentos</h2>
          <p>
            Confira validade, lotes e níveis de estoque antes dos próximos
            atendimentos.
          </p>
          <button
            className="admin-page__button"
            type="button"
            onClick={() => navegarPara("/dashboard/medicamentos")}
          >
            Abrir cadastro de medicamentos
          </button>
        </article>
        <article className="admin-panel admin-panel--donations">
          <p className="admin-page__kicker">Financeiro</p>
          <h2>Doações</h2>
          <p>
            Registre manualmente cada contribuição com os dados de contato do
            doador.
          </p>
          <button
            className="admin-page__button"
            type="button"
            onClick={() => navegarPara("/dashboard/doacoes")}
          >
            Abrir cadastro de doações
          </button>
        </article>
      </section>

      <section className="admin-panel admin-panel--events">
        <div className="admin-panel__heading">
          <div>
            <p className="admin-page__kicker">Agenda da rua</p>
            <h2>Eventos e ações</h2>
          </div>
          <button
            className="admin-page__button"
            type="button"
            onClick={() => setFormularioAberto((aberto) => !aberto)}
          >
            {formularioAberto ? "Fechar" : "+ Criar evento"}
          </button>
        </div>
        {formularioAberto && (
          <form className="admin-event-form" onSubmit={criarEvento}>
            <label>
              Nome do evento *
              <input
                required
                placeholder="Ex.: Mutirão de atendimento de rua"
                value={novoEvento.titulo}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, titulo: e.target.value })
                }
              />
            </label>
            <label>
              Data *
              <input
                required
                type="date"
                value={novoEvento.data}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, data: e.target.value })
                }
              />
            </label>
            <label>
              Local da ação
              <input
                placeholder="Ex.: Vila Industrial, Campinas"
                value={novoEvento.local}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, local: e.target.value })
                }
              />
            </label>
            <label>
              Categoria
              <select
                value={novoEvento.category}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, category: e.target.value })
                }
              >
                <option value="Mutirão">Mutirão</option>
                <option value="Campanha">Campanha</option>
                <option value="Capacitação">Capacitação</option>
              </select>
            </label>
            <label>
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
              />
            </label>
            <label>
              Comentários / Descrição
              <textarea
                value={novoEvento.comentarios}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, comentarios: e.target.value })
                }
                placeholder="Orientações para a equipe e descrição do evento"
              />
            </label>
            <button className="admin-page__button" type="submit">
              {eventoEmEdicao ? "Atualizar evento" : "Salvar evento"}
            </button>
          </form>
        )}
        <div className="admin-events-layout">
          <EventCalendar
            events={eventos.map((evento) => ({
              id: evento.id,
              title: evento.titulo,
              date: evento.data,
              details: evento.comentarios || evento.description || "",
              meta: `${evento.category || "Evento"} · ${evento.local || "Campinas"}`,
            }))}
          />
          <div className="admin-events-list">
            {eventos.map((evento) => (
              <div className="admin-event" key={evento.id}>
                <div
                  className="admin-event__day"
                  aria-label={`Dia ${new Date(`${evento.data}T00:00:00`).getDate()}`}
                >
                  {new Date(`${evento.data}T00:00:00`).getDate()}
                </div>
                <div className="admin-event__details">
                  <strong>{evento.titulo}</strong>
                  <span>
                    {new Date(`${evento.data}T00:00:00`).toLocaleDateString(
                      "pt-BR",
                    )}{" "}
                    · {evento.category || "Mutirão"} ·{" "}
                    {evento.local || "Campinas"}
                  </span>
                  <p>
                    {evento.comentarios ||
                      evento.description ||
                      "Sem comentários registrados."}
                  </p>

                  <div style={{ marginTop: "10px" }}>
                    <button
                      type="button"
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        border: "1px solid #1a745a",
                        background:
                          eventoInscritosAberto === evento.id
                            ? "#1a745a"
                            : "#e6f4ea",
                        color:
                          eventoInscritosAberto === evento.id
                            ? "#ffffff"
                            : "#137333",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onClick={() =>
                        setEventoInscritosAberto((atual) =>
                          atual === evento.id ? null : evento.id,
                        )
                      }
                    >
                      👥 {evento.inscritosDetalhes?.length || 0} de{" "}
                      {evento.vagas || 6} voluntários inscritos
                      <span>
                        {eventoInscritosAberto === evento.id
                          ? "▲ Fechar lista"
                          : "▼ Ver detalhes"}
                      </span>
                    </button>
                  </div>

                  {eventoInscritosAberto === evento.id && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "14px",
                        borderRadius: "10px",
                        background: "#faf8f4",
                        border: "1px solid #e0dacf",
                        display: "grid",
                        gap: "10px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#211811",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Lista de Voluntários Confirmados (
                        {evento.inscritosDetalhes?.length || 0})
                      </h4>

                      {!evento.inscritosDetalhes ||
                      evento.inscritosDetalhes.length === 0 ? (
                        <p
                          style={{ margin: 0, fontSize: "12px", color: "#666" }}
                        >
                          Nenhum voluntário inscrito nesta ação até o momento.
                        </p>
                      ) : (
                        evento.inscritosDetalhes.map((voluntario, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              padding: "10px 12px",
                              background: "#ffffff",
                              borderRadius: "8px",
                              border: "1px solid #ece7de",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            <div style={{ display: "grid", gap: "3px" }}>
                              <strong
                                style={{ fontSize: "14px", color: "#000000" }}
                              >
                                👤 {voluntario.nome}
                              </strong>
                              <span style={{ fontSize: "12px", color: "#555" }}>
                                ✉️{" "}
                                <a
                                  href={`mailto:${voluntario.email}`}
                                  style={{
                                    color: "#1a745a",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {voluntario.email}
                                </a>
                              </span>
                              {voluntario.telefone && (
                                <span
                                  style={{ fontSize: "12px", color: "#555" }}
                                >
                                  📞{" "}
                                  <a
                                    href={`tel:${voluntario.telefone}`}
                                    style={{
                                      color: "#211811",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {voluntario.telefone}
                                  </a>
                                  {" · "}
                                  <a
                                    href={`https://wa.me/55${voluntario.telefone.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      color: "#1a745a",
                                      fontWeight: 700,
                                      textDecoration: "underline",
                                    }}
                                  >
                                    WhatsApp
                                  </a>
                                </span>
                              )}
                              {voluntario.sobre && (
                                <p
                                  style={{
                                    margin: "4px 0 0",
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                    color: "#666",
                                  }}
                                >
                                  "{voluntario.sobre}"
                                </p>
                              )}
                              {voluntario.dataInscricao && (
                                <small
                                  style={{
                                    fontSize: "10px",
                                    color: "#888",
                                    marginTop: "3px",
                                  }}
                                >
                                  Inscrito(a) em:{" "}
                                  {new Date(
                                    `${voluntario.dataInscricao}T00:00:00`,
                                  ).toLocaleDateString("pt-BR")}
                                </small>
                              )}
                            </div>

                            <button
                              type="button"
                              style={{
                                padding: "4px 8px",
                                borderRadius: "6px",
                                border: "1px solid #f8b4b4",
                                background: "#fde8e8",
                                color: "#b91c1c",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleRemoverVoluntario(
                                  evento.id,
                                  voluntario.email || voluntario.nome,
                                )
                              }
                            >
                              Remover da ação
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div className="admin-event__actions">
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
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluirEvento(evento.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção única de Gestão e Aprovação de Usuários (Voluntários e Colaboradores) */}
      <section
        className="admin-panel approval-panel"
        aria-label="Gestão de cadastros e acessos"
      >
        <div className="admin-panel__heading">
          <div>
            <p className="admin-page__kicker">Central de Cadastros</p>
            <h2>Aprovação e Gestão de Acessos</h2>
          </div>
          <span className="admin-badge">
            {solicitacoes.filter((s) => s.status === "pendente").length}{" "}
            pendentes
          </span>
        </div>
        <p className="approval-description">
          Avalie e aprove solicitações de cadastro. Você pode decidir se o
          usuário atuará como Voluntário ou Colaborador e definir sua permissão
          de acesso.
        </p>

        <ApprovalPanelContent
          items={solicitacoes}
          onAtualizarStatus={handleAtualizarStatus}
          onAtualizarTipo={handleAtualizarTipo}
        />
      </section>

      {/* Seção de Comunicação Interna e Mural da Equipe */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
          marginTop: "16px",
        }}
        aria-label="Comunicação e Mural"
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
  const [filtroTipo, setFiltroTipo] = useState<
    "todos" | "voluntario" | "colaborador"
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
          style={{
            marginTop: "14px",
            padding: "10px 16px",
            borderRadius: "10px",
            backgroundColor: "#e6f4ea",
            color: "#137333",
            fontWeight: 600,
            fontSize: "13px",
            border: "1px solid #ceead6",
          }}
        >
          ✓ {mensagemFeedback}
        </div>
      )}
      <div className="approval-filters">
        <div className="approval-summary" aria-label="Filtro por status">
          <button
            className={filtroStatus === "pendente" ? "ativo" : ""}
            type="button"
            onClick={() => setFiltroStatus("pendente")}
          >
            <strong>{contagens.pendente}</strong>
            <span>Pendentes</span>
          </button>
          <button
            className={filtroStatus === "aceito" ? "ativo" : ""}
            type="button"
            onClick={() => setFiltroStatus("aceito")}
          >
            <strong>{contagens.aceito}</strong>
            <span>Aceitos</span>
          </button>
          <button
            className={filtroStatus === "recusado" ? "ativo" : ""}
            type="button"
            onClick={() => setFiltroStatus("recusado")}
          >
            <strong>{contagens.recusado}</strong>
            <span>Recusados</span>
          </button>
          <button
            className={filtroStatus === "todos" ? "ativo" : ""}
            type="button"
            onClick={() => setFiltroStatus("todos")}
          >
            <strong>{contagens.todos}</strong>
            <span>Todos</span>
          </button>
        </div>

        <div className="approval-type-tabs">
          <span>Filtrar perfil:</span>
          <button
            type="button"
            className={filtroTipo === "todos" ? "ativo" : ""}
            onClick={() => setFiltroTipo("todos")}
          >
            Todos os perfis
          </button>
          <button
            type="button"
            className={filtroTipo === "voluntario" ? "ativo" : ""}
            onClick={() => setFiltroTipo("voluntario")}
          >
            Voluntários
          </button>
          <button
            type="button"
            className={filtroTipo === "colaborador" ? "ativo" : ""}
            onClick={() => setFiltroTipo("colaborador")}
          >
            Colaboradores
          </button>
        </div>
      </div>

      <label className="approval-search">
        Buscar pessoa
        <input
          type="search"
          placeholder="Nome, e-mail, telefone ou interesse"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
      </label>

      <div className="approval-list">
        {exibidos.length === 0 && (
          <p className="approval-empty">
            Nenhuma solicitação encontrada para os filtros selecionados.
          </p>
        )}
        {exibidos.map((registro) => (
          <div className="approval-item" key={registro.id}>
            <div className="approval-person">
              <strong>{registro.nome}</strong>
              <span>{registro.email}</span>
              <span>{registro.telefone}</span>
              {registro.sobre && (
                <p className="approval-sobre">"{registro.sobre}"</p>
              )}
              <small>
                Solicitado em{" "}
                {new Date(
                  `${registro.dataSolicitacao}T00:00:00`,
                ).toLocaleDateString("pt-BR")}
              </small>
            </div>

            <div className="approval-item__right">
              {/* Botões para o administrador decidir se a pessoa é Voluntário ou Colaborador */}
              <div
                className="approval-role-selector"
                title="Definir perfil da pessoa"
              >
                <span className="approval-role-label">Perfil:</span>
                <button
                  type="button"
                  className={`approval-role-btn ${registro.tipo === "voluntario" ? "ativo" : ""}`}
                  onClick={() =>
                    executarAtualizarTipo(
                      registro.id,
                      "voluntario",
                      registro.nome,
                    )
                  }
                >
                  Voluntário
                </button>
                <button
                  type="button"
                  className={`approval-role-btn ${registro.tipo === "colaborador" ? "ativo" : ""}`}
                  onClick={() =>
                    executarAtualizarTipo(
                      registro.id,
                      "colaborador",
                      registro.nome,
                    )
                  }
                >
                  Colaborador
                </button>
              </div>

              <span
                className={`approval-status approval-status--${registro.status}`}
              >
                {registro.status}
              </span>

              {/* Botões de Ação: Aceitar / Recusar / Reabrir */}
              <div className="approval-actions">
                {registro.status === "pendente" && (
                  <>
                    <button
                      type="button"
                      className="btn-accept"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "aceito",
                          registro.nome,
                        )
                      }
                    >
                      ✓ Aceitar
                    </button>
                    <button
                      type="button"
                      className="btn-reject"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "recusado",
                          registro.nome,
                        )
                      }
                    >
                      ✕ Recusar
                    </button>
                  </>
                )}

                {registro.status === "aceito" && (
                  <>
                    <button
                      type="button"
                      className="btn-reject"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "recusado",
                          registro.nome,
                        )
                      }
                    >
                      Mudar p/ Recusar
                    </button>
                    <button
                      type="button"
                      className="btn-reopen"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "pendente",
                          registro.nome,
                        )
                      }
                    >
                      Reabrir análise
                    </button>
                  </>
                )}

                {registro.status === "recusado" && (
                  <>
                    <button
                      type="button"
                      className="btn-accept"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "aceito",
                          registro.nome,
                        )
                      }
                    >
                      Aprovar acesso
                    </button>
                    <button
                      type="button"
                      className="btn-reopen"
                      onClick={() =>
                        executarAtualizarStatus(
                          registro.id,
                          "pendente",
                          registro.nome,
                        )
                      }
                    >
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
