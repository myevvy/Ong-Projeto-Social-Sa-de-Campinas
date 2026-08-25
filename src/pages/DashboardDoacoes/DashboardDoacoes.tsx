import { useState } from "react";
import "./DashboardDoacoes.css";

type StatusDoacao = "aprovada" | "pendente" | "recusada";
interface Doacao {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  valor: number;
  data: string;
  status: StatusDoacao;
}

const DOACOES_INICIAIS: Doacao[] = [
  {
    id: 1,
    nome: "Ana Paula Mendes",
    email: "ana.mendes@email.com",
    telefone: "(19) 99123-4567",
    valor: 850,
    data: "2026-08-04",
    status: "aprovada",
  },
  {
    id: 2,
    nome: "Instituto Bem Viver",
    email: "contato@bemviver.org",
    telefone: "(19) 3234-1000",
    valor: 650,
    data: "2026-08-12",
    status: "aprovada",
  },
  {
    id: 3,
    nome: "Carlos Eduardo Lima",
    email: "carlos.lima@email.com",
    telefone: "(19) 99876-1122",
    valor: 500,
    data: "2026-08-18",
    status: "pendente",
  },
  {
    id: 4,
    nome: "Mariana Souza",
    email: "mariana.souza@email.com",
    telefone: "(19) 99221-8833",
    valor: 120,
    data: "2026-08-22",
    status: "pendente",
  },
  {
    id: 5,
    nome: "Rafael Nogueira",
    email: "rafael.nogueira@email.com",
    telefone: "(19) 99771-2244",
    valor: 300,
    data: "2026-08-25",
    status: "recusada",
  },
];

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function DashboardDoacoes() {
  const [doacoes, setDoacoes] = useState(DOACOES_INICIAIS);
  const [mesSelecionado, setMesSelecionado] = useState(7);
  const [aba, setAba] = useState<StatusDoacao>("aprovada");
  const doacoesDoMes = doacoes.filter(
    (doacao) => Number(doacao.data.slice(5, 7)) - 1 === mesSelecionado,
  );
  const aprovadas = doacoesDoMes.filter(
    (doacao) => doacao.status === "aprovada",
  );
  const pendentes = doacoesDoMes.filter(
    (doacao) => doacao.status === "pendente",
  );
  const recusadas = doacoesDoMes.filter(
    (doacao) => doacao.status === "recusada",
  );
  const exibidas =
    aba === "aprovada" ? aprovadas : aba === "pendente" ? pendentes : recusadas;
  const total = aprovadas.reduce((soma, doacao) => soma + doacao.valor, 0);
  const diasComDoacao = new Set(
    doacoesDoMes.map((doacao) => Number(doacao.data.slice(8, 10))),
  );

  function atualizarStatus(id: number, status: StatusDoacao) {
    setDoacoes((atuais) =>
      atuais.map((doacao) =>
        doacao.id === id ? { ...doacao, status } : doacao,
      ),
    );
  }

  return (
    <main className="doacoes-page">
      <header className="doacoes-page__header">
        <div>
          <p className="doacoes-page__eyebrow">Financeiro · área restrita</p>
          <h1>Gestão de doações</h1>
          <p>
            Acompanhe entradas, valide contribuições e mantenha o impacto da ONG
            visível.
          </p>
        </div>
        <a
          className="doacoes-page__voltar"
          href="/dashboard/colaborador"
          onClick={(evento) => {
            evento.preventDefault();
            window.history.pushState({}, "", "/dashboard/colaborador");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
        >
          Voltar ao dashboard
        </a>
      </header>

      <section className="doacoes-resumo" aria-label="Resumo mensal">
        <div>
          <span>Total arrecadado</span>
          <strong>{moeda(total)}</strong>
          <small>{meses[mesSelecionado]} de 2026</small>
        </div>
        <div>
          <span>Doações aprovadas</span>
          <strong>{aprovadas.length}</strong>
          <small>contribuições confirmadas</small>
        </div>
        <div>
          <span>Doações recusadas</span>
          <strong>{recusadas.length}</strong>
          <small>decisões registradas</small>
        </div>
        <div>
          <span>Em análise</span>
          <strong>{pendentes.length}</strong>
          <small>aguardando sua decisão</small>
        </div>
      </section>

      <section className="doacoes-layout">
        <div className="calendario-panel">
          <div className="calendario-panel__topo">
            <div>
              <p className="doacoes-page__eyebrow">Visão mensal</p>
              <h2>{meses[mesSelecionado]} 2026</h2>
            </div>
            <select
              aria-label="Selecionar mês"
              value={mesSelecionado}
              onChange={(evento) =>
                setMesSelecionado(Number(evento.target.value))
              }
            >
              {meses.map((mes, indice) => (
                <option value={indice} key={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
          <div className="calendario__semana">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((dia, indice) => (
              <span key={`${dia}-${indice}`}>{dia}</span>
            ))}
          </div>
          <div className="calendario__dias">
            {Array.from({ length: 31 }, (_, indice) => indice + 1).map(
              (dia) => (
                <span
                  className={diasComDoacao.has(dia) ? "tem-doacao" : ""}
                  key={dia}
                >
                  {dia}
                </span>
              ),
            )}
          </div>
          <p className="calendario-legenda">
            <i /> Dia com doação registrada
          </p>
        </div>

        <div className="lista-panel">
          <div className="lista-panel__topo">
            <div>
              <p className="doacoes-page__eyebrow">Revisão</p>
              <h2>Contribuições</h2>
            </div>
            <div className="doacoes-tabs">
              <button
                className={aba === "aprovada" ? "ativo" : ""}
                onClick={() => setAba("aprovada")}
                type="button"
              >
                Aprovadas ({aprovadas.length})
              </button>
              <button
                className={aba === "pendente" ? "ativo" : ""}
                onClick={() => setAba("pendente")}
                type="button"
              >
                Pendentes ({pendentes.length})
              </button>
              <button
                className={aba === "recusada" ? "ativo" : ""}
                onClick={() => setAba("recusada")}
                type="button"
              >
                Recusadas ({recusadas.length})
              </button>
            </div>
          </div>
          {exibidas.length === 0 ? (
            <p className="lista-vazia">
              Nenhuma doação nesta categoria em{" "}
              {meses[mesSelecionado].toLocaleLowerCase()}.
            </p>
          ) : (
            <div className="doacoes-lista">
              {exibidas.map((doacao) => (
                <article className="doacao-item" key={doacao.id}>
                  <div className="doacao-item__principal">
                    <strong>{doacao.nome}</strong>
                    <span>{doacao.email}</span>
                    <span>{doacao.telefone}</span>
                  </div>
                  <div className="doacao-item__valor">
                    <strong>{moeda(doacao.valor)}</strong>
                    <span>
                      {doacao.data.slice(8, 10)} de{" "}
                      {meses[mesSelecionado].toLocaleLowerCase()}
                    </span>
                  </div>
                  {aba === "pendente" && (
                    <div className="doacao-item__acoes">
                      <button
                        type="button"
                        onClick={() => atualizarStatus(doacao.id, "aprovada")}
                      >
                        Aceitar
                      </button>
                      <button
                        type="button"
                        onClick={() => atualizarStatus(doacao.id, "recusada")}
                      >
                        Recusar
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
