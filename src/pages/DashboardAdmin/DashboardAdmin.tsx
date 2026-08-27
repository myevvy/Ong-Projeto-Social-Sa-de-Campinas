import { useState, type FormEvent } from "react";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import "./DashboardAdmin.css";

interface Evento {
  id: number;
  titulo: string;
  data: string;
  comentarios: string;
}

type StatusAcesso = "pendente" | "aceito" | "recusado";

interface SolicitacaoAcesso {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  status: StatusAcesso;
  dataSolicitacao: string;
}

const VOLUNTARIOS_INICIAIS: SolicitacaoAcesso[] = [
  {
    id: 1,
    nome: "Beatriz Santos",
    email: "beatriz.santos@email.com",
    telefone: "(19) 99124-3012",
    status: "pendente",
    dataSolicitacao: "2026-08-25",
  },
  {
    id: 2,
    nome: "Lucas Almeida",
    email: "lucas.almeida@email.com",
    telefone: "(19) 99812-6640",
    status: "pendente",
    dataSolicitacao: "2026-08-24",
  },
  {
    id: 3,
    nome: "Joana Ribeiro",
    email: "joana.ribeiro@email.com",
    telefone: "(19) 99200-1818",
    status: "pendente",
    dataSolicitacao: "2026-08-22",
  },
  {
    id: 4,
    nome: "Marcos Oliveira",
    email: "marcos.oliveira@email.com",
    telefone: "(19) 99771-4588",
    status: "aceito",
    dataSolicitacao: "2026-08-18",
  },
  {
    id: 5,
    nome: "Carla Mendes",
    email: "carla.mendes@email.com",
    telefone: "(19) 99110-7432",
    status: "recusado",
    dataSolicitacao: "2026-08-12",
  },
];

const COLABORADORES_INICIAIS: SolicitacaoAcesso[] = [
  {
    id: 6,
    nome: "Paulo Mendes",
    email: "paulo.mendes@saudecampinas.org",
    telefone: "(19) 99145-2201",
    status: "pendente",
    dataSolicitacao: "2026-08-26",
  },
  {
    id: 7,
    nome: "Renata Castro",
    email: "renata.castro@saudecampinas.org",
    telefone: "(19) 99631-9087",
    status: "pendente",
    dataSolicitacao: "2026-08-23",
  },
  {
    id: 8,
    nome: "André Martins",
    email: "andre.martins@saudecampinas.org",
    telefone: "(19) 99318-5502",
    status: "aceito",
    dataSolicitacao: "2026-08-15",
  },
  {
    id: 9,
    nome: "Fernanda Lima",
    email: "fernanda.lima@saudecampinas.org",
    telefone: "(19) 99820-4410",
    status: "recusado",
    dataSolicitacao: "2026-08-10",
  },
];

const EVENTOS_INICIAIS: Evento[] = [
  {
    id: 1,
    titulo: "Triagem e organização do estoque",
    data: "2026-09-14",
    comentarios: "Levar etiquetas e conferir os lotes recebidos.",
  },
  {
    id: 2,
    titulo: "Entrega de medicamentos",
    data: "2026-09-21",
    comentarios: "Confirmar transporte com a equipe até sexta-feira.",
  },
];

function navegarPara(caminho: string) {
  window.history.pushState({}, "", caminho);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function DashboardAdmin() {
  const [eventos, setEventos] = useState(EVENTOS_INICIAIS);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    data: "",
    comentarios: "",
  });
  const [eventoEmEdicao, setEventoEmEdicao] = useState<number | null>(null);
  const [formularioAberto, setFormularioAberto] = useState(false);

  function criarEvento(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!novoEvento.titulo.trim() || !novoEvento.data) return;
    if (eventoEmEdicao) {
      setEventos((atuais) =>
        atuais.map((item) =>
          item.id === eventoEmEdicao
            ? { ...item, ...novoEvento, titulo: novoEvento.titulo.trim() }
            : item,
        ),
      );
    } else {
      setEventos((atuais) => [
        ...atuais,
        {
          id: Date.now(),
          titulo: novoEvento.titulo.trim(),
          data: novoEvento.data,
          comentarios: novoEvento.comentarios.trim(),
        },
      ]);
    }
    setNovoEvento({ titulo: "", data: "", comentarios: "" });
    setEventoEmEdicao(null);
    setFormularioAberto(false);
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
          onClick={() => navegarPara("/login")}
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
          <span>Novos voluntários</span>
          <strong>12</strong>
          <small>4 aguardando análise</small>
        </article>
        <article>
          <span>Colaboradores</span>
          <strong>8</strong>
          <small>2 solicitações pendentes</small>
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
              Nome do evento
              <input
                required
                value={novoEvento.titulo}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, titulo: e.target.value })
                }
              />
            </label>
            <label>
              Data
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
              Comentários do evento
              <textarea
                value={novoEvento.comentarios}
                onChange={(e) =>
                  setNovoEvento({ ...novoEvento, comentarios: e.target.value })
                }
                placeholder="Orientações para a equipe"
              />
            </label>
            <button className="admin-page__button" type="submit">
              Salvar evento
            </button>
          </form>
        )}
        <div className="admin-events-layout">
          <EventCalendar
            events={eventos.map((evento) => ({
              id: evento.id,
              title: evento.titulo,
              date: evento.data,
              details: evento.comentarios,
              meta: "Evento administrativo",
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
                    )}
                  </span>
                  <p>{evento.comentarios || "Sem comentários registrados."}</p>
                </div>
                <div className="admin-event__actions">
                  <button
                    type="button"
                    onClick={() => {
                      setNovoEvento({
                        titulo: evento.titulo,
                        data: evento.data,
                        comentarios: evento.comentarios,
                      });
                      setEventoEmEdicao(evento.id);
                      setFormularioAberto(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEventos((atuais) =>
                        atuais.filter((item) => item.id !== evento.id),
                      )
                    }
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-page__grid" aria-label="Solicitações de acesso">
        <ApprovalPanel
          title="Novos voluntários"
          description="Gerencie quem quer atuar diretamente nas ações da ONG."
          initialItems={VOLUNTARIOS_INICIAIS}
        />
        <ApprovalPanel
          title="Novos colaboradores"
          description="Gerencie acessos de quem apoia a operação e a gestão."
          initialItems={COLABORADORES_INICIAIS}
        />
      </section>
    </main>
  );
}

function ApprovalPanel({
  title,
  description,
  initialItems,
}: {
  title: string;
  description: string;
  initialItems: SolicitacaoAcesso[];
}) {
  const [registros, setRegistros] = useState(initialItems);
  const [filtro, setFiltro] = useState<StatusAcesso>("pendente");
  const [busca, setBusca] = useState("");
  const contagens = {
    pendente: registros.filter((registro) => registro.status === "pendente")
      .length,
    aceito: registros.filter((registro) => registro.status === "aceito").length,
    recusado: registros.filter((registro) => registro.status === "recusado")
      .length,
  };
  const exibidos = registros.filter((registro) => {
    const texto =
      `${registro.nome} ${registro.email} ${registro.telefone}`.toLocaleLowerCase();
    return (
      registro.status === filtro && texto.includes(busca.toLocaleLowerCase())
    );
  });

  function atualizarStatus(id: number, status: StatusAcesso) {
    setRegistros((atuais) =>
      atuais.map((registro) =>
        registro.id === id ? { ...registro, status } : registro,
      ),
    );
  }

  return (
    <article className="admin-panel approval-panel">
      <div className="admin-panel__heading">
        <div>
          <p className="admin-page__kicker">Acessos</p>
          <h2>{title}</h2>
        </div>
        <span className="admin-badge">{contagens.pendente} pendentes</span>
      </div>
      <p className="approval-description">{description}</p>
      <div className="approval-summary" aria-label={`Resumo de ${title}`}>
        <button
          className={filtro === "pendente" ? "ativo" : ""}
          type="button"
          onClick={() => setFiltro("pendente")}
        >
          <strong>{contagens.pendente}</strong>
          <span>Pendentes</span>
        </button>
        <button
          className={filtro === "aceito" ? "ativo" : ""}
          type="button"
          onClick={() => setFiltro("aceito")}
        >
          <strong>{contagens.aceito}</strong>
          <span>Aceitos</span>
        </button>
        <button
          className={filtro === "recusado" ? "ativo" : ""}
          type="button"
          onClick={() => setFiltro("recusado")}
        >
          <strong>{contagens.recusado}</strong>
          <span>Recusados</span>
        </button>
      </div>
      <label className="approval-search">
        Buscar pessoa
        <input
          type="search"
          placeholder="Nome, e-mail ou telefone"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
      </label>
      <div className="approval-list">
        {exibidos.length === 0 && (
          <p className="approval-empty">
            Nenhum registro encontrado nesta categoria.
          </p>
        )}
        {exibidos.map((registro) => (
          <div className="approval-item" key={registro.id}>
            <div className="approval-person">
              <strong>{registro.nome}</strong>
              <span>{registro.email}</span>
              <span>{registro.telefone}</span>
              <small>
                Solicitado em{" "}
                {new Date(
                  `${registro.dataSolicitacao}T00:00:00`,
                ).toLocaleDateString("pt-BR")}
              </small>
            </div>
            <div className="approval-item__right">
              <span
                className={`approval-status approval-status--${registro.status}`}
              >
                {registro.status}
              </span>
              {registro.status === "pendente" && (
                <div>
                  <button
                    type="button"
                    onClick={() => atualizarStatus(registro.id, "aceito")}
                  >
                    Aceitar
                  </button>
                  <button
                    type="button"
                    onClick={() => atualizarStatus(registro.id, "recusado")}
                  >
                    Recusar
                  </button>
                </div>
              )}
              {registro.status !== "pendente" && (
                <button
                  type="button"
                  onClick={() => atualizarStatus(registro.id, "pendente")}
                >
                  Reabrir análise
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
