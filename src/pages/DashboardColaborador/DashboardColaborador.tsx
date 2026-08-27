// src/pages/Dashboard/DashboardColaborador.tsx
import { useEffect, useState } from "react";
import { buscarDashboardColaborador } from "../../services/dashboardService";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import { MessageBox } from "../../components/MessageBox/MessageBox";
import type { UsuarioAutenticado } from "../../types/auth";
import type { DashboardColaboradorData } from "../../types/dashboard";
import "./DashboardColaborador.css";

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
  const [carregando, setCarregando] = useState(!dadosIniciais);
  const [erro, setErro] = useState<string | null>(null);
  const [estoqueAtualizado, setEstoqueAtualizado] = useState(248);
  const [salvandoEstoque, setSalvandoEstoque] = useState(false);

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
      <div className="dashboard-colaborador">
        <p className="dashboard-colaborador__estado" role="status">
          Carregando painel...
        </p>
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="dashboard-colaborador">
        <p
          className="dashboard-colaborador__estado dashboard-colaborador__estado--erro"
          role="alert"
        >
          {erro ?? "Não foi possível carregar o painel."}
        </p>
      </div>
    );
  }

  const { colaborador, estoque, doacoes, proximasAcoes } = dados;
  const nomeColaborador = usuario?.nome || colaborador.nome || "colaborador";

  return (
    <div className="dashboard-colaborador">
      <header className="dashboard-colaborador__header">
        <p className="dashboard-colaborador__eyebrow">Painel do colaborador</p>
        <h1 className="dashboard-colaborador__titulo">
          {saudacaoPorHorario()}, {nomeColaborador.split(" ")[0]}
        </h1>
      </header>

      <section aria-labelledby="secao-estoque">
        <h2 id="secao-estoque" className="dashboard-colaborador__secao-titulo">
          Estoque de medicamentos
        </h2>
        <div className="stat-grid">
          <div className="stat-card" data-tom="neutro">
            <span className="stat-card__valor">
              {estoque.totalMedicamentos}
            </span>
            <span className="stat-card__rotulo">Medicamentos cadastrados</span>
          </div>
          <div className="stat-card" data-tom="atencao">
            <span className="stat-card__valor">
              {estoque.proximosVencimento}
            </span>
            <span className="stat-card__rotulo">Próximos do vencimento</span>
          </div>
          <div className="stat-card" data-tom="critico">
            <span className="stat-card__valor">{estoque.vencidos}</span>
            <span className="stat-card__rotulo">Vencidos</span>
          </div>
          <div className="stat-card" data-tom="baixo">
            <span className="stat-card__valor">{estoque.estoqueBaixo}</span>
            <span className="stat-card__rotulo">Em estoque baixo</span>
          </div>
        </div>
        <form className="estoque-atualizacao" onSubmit={atualizarEstoque}>
          <label htmlFor="estoque-total">Atualizar total em estoque</label>
          <input
            id="estoque-total"
            type="number"
            min="0"
            value={estoqueAtualizado}
            onChange={(evento) =>
              setEstoqueAtualizado(Number(evento.target.value))
            }
          />
          <button className="dashboard-colaborador__botao" type="submit">
            {salvandoEstoque ? "Salvando..." : "Salvar estoque"}
          </button>
        </form>
      </section>

      <section aria-labelledby="secao-doacoes">
        <h2 id="secao-doacoes" className="dashboard-colaborador__secao-titulo">
          Doações do mês
        </h2>
        <div className="doacoes-card">
          <div>
            <span className="doacoes-card__valor">
              {formatarMoeda(doacoes.valorTotalMes)}
            </span>
            <span className="doacoes-card__rotulo">arrecadados este mês</span>
          </div>
          <div className="doacoes-card__divisor" aria-hidden="true" />
          <div>
            <span className="doacoes-card__valor">{doacoes.quantidadeMes}</span>
            <span className="doacoes-card__rotulo">
              {doacoes.quantidadeMes === 1
                ? "doação recebida"
                : "doações recebidas"}
            </span>
          </div>
        </div>
        <a
          className="dashboard-colaborador__link"
          href="/dashboard/doacoes"
          onClick={abrirDoacoes}
        >
          Ver gestão de doações
        </a>
      </section>

      <section aria-labelledby="secao-acoes">
        <div className="dashboard-colaborador__secao-cabecalho">
          <h2 id="secao-acoes" className="dashboard-colaborador__secao-titulo">
            Próximas ações
          </h2>
        </div>

        {proximasAcoes.length === 0 ? (
          <p className="dashboard-colaborador__vazio">
            Nenhuma ação agendada no momento.
          </p>
        ) : (
          <div className="carrossel-trilha">
            {proximasAcoes.map((acao) => {
              const { dia, mes } = formatarData(acao.data);
              return (
                <article className="acao-card" key={acao.id}>
                  <div className="acao-card__data">
                    <span className="acao-card__dia">{dia}</span>
                    <span className="acao-card__mes">{mes}</span>
                  </div>
                  <div className="acao-card__corpo">
                    <h3 className="acao-card__titulo">{acao.titulo}</h3>
                    <span className="acao-card__voluntarios">
                      {acao.voluntariosInscritos}{" "}
                      {acao.voluntariosInscritos === 1
                        ? "voluntário inscrito"
                        : "voluntários inscritos"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <EventCalendar
          events={proximasAcoes.map((acao) => ({
            id: acao.id,
            title: acao.titulo,
            date: acao.data,
            meta: `${acao.voluntariosInscritos} voluntários inscritos`,
          }))}
        />
      </section>
      <section aria-labelledby="secao-voluntarios">
        <h2
          id="secao-voluntarios"
          className="dashboard-colaborador__secao-titulo"
        >
          Voluntários nas ações
        </h2>
        <div className="voluntarios-resumo">
          <div>
            <strong>9</strong>
            <span>voluntários ativos</span>
          </div>
          <div>
            <strong>3</strong>
            <span>aguardando confirmação</span>
          </div>
          <div>
            <strong>18</strong>
            <span>inscrições nas próximas ações</span>
          </div>
        </div>
      </section>
      <MessageBox author="colaborador" />
    </div>
  );
}
