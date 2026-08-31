import { useState, type FormEvent } from "react";
import type { UsuarioAutenticado } from "../../types/auth";
import { Kicker, Button, FormField } from "../../components";
import { Trash2, Pencil, Check, X, Mail, Phone } from "lucide-react";

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

interface DashboardDoacoesProps {
  usuario?: UsuarioAutenticado | null;
}

export default function DashboardDoacoes({ usuario }: DashboardDoacoesProps) {
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [doacaoEmEdicao, setDoacaoEmEdicao] = useState<number | null>(null);
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    telefone: "",
    valor: "",
    data: "",
  });
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

  function salvarDoacao(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const registro = {
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
      telefone: formulario.telefone.trim(),
      valor: Number(formulario.valor),
      data: formulario.data,
      status: "pendente" as StatusDoacao,
    };
    if (doacaoEmEdicao) {
      setDoacoes((atuais) =>
        atuais.map((doacao) =>
          doacao.id === doacaoEmEdicao ? { ...doacao, ...registro } : doacao,
        ),
      );
    } else {
      setDoacoes((atuais) => [...atuais, { ...registro, id: Date.now() }]);
    }
    setFormulario({ nome: "", email: "", telefone: "", valor: "", data: "" });
    setDoacaoEmEdicao(null);
    setFormularioAberto(false);
  }

  function editarDoacao(doacao: Doacao) {
    setFormulario({
      nome: doacao.nome,
      email: doacao.email,
      telefone: doacao.telefone,
      valor: String(doacao.valor),
      data: doacao.data,
    });
    setDoacaoEmEdicao(doacao.id);
    setFormularioAberto(true);
  }

  function atualizarStatus(id: number, status: StatusDoacao) {
    setDoacoes((atuais) =>
      atuais.map((doacao) =>
        doacao.id === id ? { ...doacao, status } : doacao,
      ),
    );
  }

  return (
    <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-8 md:px-10">
      {/* Voltar isolado, no topo, à esquerda — separado do botão de ação
          pra não parecer que são do mesmo grupo (um é navegação, o outro
          é ação da página). Mesmo padrão da página de Agenda. */}
      <a
        href="/dashboard/colaborador"
        onClick={(evento) => {
          evento.preventDefault();
          window.history.pushState(
            {},
            "",
            usuario?.tipoUsuario === "admin"
              ? "/dashboard/admin"
              : "/dashboard/colaborador",
          );
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        className="inline-flex w-fit items-center gap-1.5 font-body text-sm font-bold text-black"
      >
        <span aria-hidden="true">←</span> Voltar ao dashboard
      </a>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <Kicker>Financeiro · área restrita</Kicker>
          <h1 className="m-0 font-display text-[28px] font-semibold text-black md:text-[32px]">
            Gestão de doações
          </h1>
          <p className="m-0 max-w-md font-body text-sm text-ink-soft">
            Acompanhe entradas, valide contribuições e mantenha o impacto da
            ONG visível.
          </p>
            
        </div>
<Button
          variant={formularioAberto ? "outline" : "primary"}
          onClick={() => setFormularioAberto((aberto) => !aberto)}
          className="mt-15 px-3 py-1.5 font-body text-xs font-bold text-amber"
        >
          {formularioAberto ? "Fechar cadastro" : "+ Nova doação"}
        </Button>
      
      </header>

      {formularioAberto && (
        <form
          onSubmit={salvarDoacao}
          className="grid grid-cols-1 gap-4 rounded-lg border border-black/10 bg-white p-6 md:grid-cols-2"
        >
          <h2 className="m-0 font-display text-lg font-semibold text-black md:col-span-2">
            {doacaoEmEdicao ? "Editar doação" : "Registrar doação"}
          </h2>
          <FormField
            id="doacao-nome"
            label="Nome do doador"
            required
            value={formulario.nome}
            onChange={(e) =>
              setFormulario({ ...formulario, nome: e.target.value })
            }
          />
          <FormField
            id="doacao-email"
            label="E-mail"
            required
            type="email"
            value={formulario.email}
            onChange={(e) =>
              setFormulario({ ...formulario, email: e.target.value })
            }
          />
          <FormField
            id="doacao-telefone"
            label="Telefone"
            required
            value={formulario.telefone}
            onChange={(e) =>
              setFormulario({ ...formulario, telefone: e.target.value })
            }
          />
          <FormField
            id="doacao-valor"
            label="Valor (R$)"
            required
            min={0}
            step={0.01}
            type="number"
            value={formulario.valor}
            onChange={(e) =>
              setFormulario({ ...formulario, valor: e.target.value })
            }
          />
          <FormField
            id="doacao-data"
            label="Data"
            required
            type="date"
            value={formulario.data}
            onChange={(e) =>
              setFormulario({ ...formulario, data: e.target.value })
            }
          />
          <Button type="submit" variant="primary" className="self-end">
            Salvar registro
          </Button>
        </form>
      )}

      <section
        aria-label="Resumo mensal"
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        <div className="flex flex-col gap-1 rounded-md border border-black/10 bg-white p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Total arrecadado
          </span>
          <strong className="font-display text-2xl font-semibold text-black">
            {moeda(total)}
          </strong>
          <small className="font-body text-xs text-ink-soft">
            {meses[mesSelecionado]} de 2026
          </small>
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-volunteer/25 bg-volunteer-soft p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Doações aprovadas
          </span>
          <strong className="font-display text-2xl font-semibold text-volunteer">
            {aprovadas.length}
          </strong>
          <small className="font-body text-xs text-ink-soft">
            contribuições confirmadas
          </small>
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-error/25 bg-error/10 p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Doações recusadas
          </span>
          <strong className="font-display text-2xl font-semibold text-error">
            {recusadas.length}
          </strong>
          <small className="font-body text-xs text-ink-soft">
            decisões registradas
          </small>
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-amber/25 bg-amber/10 p-5">
          <span className="font-body text-[12.5px] text-ink-soft">
            Em análise
          </span>
          <strong className="font-display text-2xl font-semibold text-amber">
            {pendentes.length}
          </strong>
          <small className="font-body text-xs text-ink-soft">
            aguardando sua decisão
          </small>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-4 rounded-lg border border-black/10 bg-white p-6">
          <div className="flex flex-col gap-1">
            <Kicker>Visão mensal</Kicker>
            <h2 className="m-0 font-display text-lg font-semibold text-black">
              {meses[mesSelecionado]} 2026
            </h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="doacoes-mes"
              className="font-body text-[13px] font-bold text-black"
            >
              Selecionar mês
            </label>
            <select
              id="doacoes-mes"
              value={mesSelecionado}
              onChange={(evento) =>
                setMesSelecionado(Number(evento.target.value))
              }
              className="rounded-sm border border-black/[0.18] bg-white px-4 py-3.5 font-body text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
            >
              {meses.map((mes, indice) => (
                <option value={indice} key={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((dia, indice) => (
              <span
                key={`${dia}-${indice}`}
                className="font-mono text-[11px] font-semibold text-ink-soft"
              >
                {dia}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: 31 }, (_, indice) => indice + 1).map(
              (dia) => (
                <span
                  key={dia}
                  className={`rounded-sm py-1.5 font-body text-xs ${
                    diasComDoacao.has(dia)
                      ? "bg-volunteer-soft font-bold text-volunteer"
                      : "text-ink-soft"
                  }`}
                >
                  {dia}
                </span>
              ),
            )}
          </div>
          <p className="m-0 flex items-center gap-2 font-body text-xs text-ink-soft">
            <span className="h-2.5 w-2.5 rounded-full bg-volunteer-soft ring-1 ring-inset ring-volunteer" />
            Dia com doação registrada
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-black/10 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Kicker>Revisão</Kicker>
              <h2 className="m-0 font-display text-lg font-semibold text-black">
                Contribuições
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["aprovada", "pendente", "recusada"] as const).map(
                (status) => {
                  const labels: Record<StatusDoacao, string> = {
                    aprovada: `Aprovadas (${aprovadas.length})`,
                    pendente: `Pendentes (${pendentes.length})`,
                    recusada: `Recusadas (${recusadas.length})`,
                  };
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setAba(status)}
                      className={`rounded-pill px-4 py-2 font-body text-[13px] font-bold transition-colors ${
                        aba === status
                          ? "bg-black text-parchment"
                          : "border border-black/20 bg-white text-black"
                      }`}
                    >
                      {labels[status]}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {exibidas.length === 0 ? (
            <p className="font-body text-sm text-ink-soft">
              Nenhuma doação nesta categoria em{" "}
              {meses[mesSelecionado].toLocaleLowerCase()}.
            </p>
          ) : (
           <div className="flex flex-col gap-3">
  {exibidas.map((doacao) => (
    <article
      key={doacao.id}
      className="grid grid-cols-1 gap-4 rounded-md border border-black/10 p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
    >
      {/* Coluna 1 — dados do doador */}
      <div className="flex flex-col gap-1">
        <strong className="font-body text-sm font-bold text-black">
          {doacao.nome}
        </strong>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-body text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Mail size={12} className="shrink-0" />
            {doacao.email}
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone size={12} className="shrink-0" />
            {doacao.telefone}
          </span>
        </div>
      </div>

      {/* Coluna 2 — valor, separada por borda no desktop */}
      <div className="flex items-center justify-between gap-4 border-black/10 md:flex-col md:items-end md:justify-center md:border-l md:pl-4">
        <strong className="font-display text-lg font-semibold text-black">
          {moeda(doacao.valor)}
        </strong>
        <span className="font-body text-xs text-ink-soft">
          Dia {doacao.data.slice(8, 10)}
        </span>
      </div>

      {/* Coluna 3 — ações, separadas por borda no desktop */}
      <div className="flex flex-wrap items-center gap-2 border-black/10 md:border-l md:pl-4">
        {aba === "pendente" && (
          <>
            <button
              type="button"
              onClick={() => atualizarStatus(doacao.id, "aprovada")}
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill bg-volunteer px-3 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90"
            >
              <Check size={14} className="shrink-0" />
              Aceitar
            </button>
            <button
              type="button"
              onClick={() => atualizarStatus(doacao.id, "recusada")}
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill border border-error/40 px-3 font-body text-[13px] font-bold text-error transition-colors hover:bg-error/10"
            >
              <X size={14} className="shrink-0" />
              Recusar
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => editarDoacao(doacao)}
          className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill border border-black/20 bg-white px-3 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5"
        >
          <Pencil size={14} className="shrink-0" />
          <span className="hidden sm:inline">Editar</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setDoacoes((atuais) =>
              atuais.filter((item) => item.id !== doacao.id),
            )
          }
          className="ml-1 inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill px-3 font-body text-[13px] font-bold text-error/70 transition-colors hover:bg-error/10 hover:text-error"
          aria-label="Excluir doação"
          title="Excluir"
        >
          <Trash2 size={14} className="shrink-0" />
          <span className="hidden sm:inline">Excluir</span>
        </button>
      </div>
    </article>
  ))}
</div>
          )}
        </div>
      </section>
    </main>
  );
}