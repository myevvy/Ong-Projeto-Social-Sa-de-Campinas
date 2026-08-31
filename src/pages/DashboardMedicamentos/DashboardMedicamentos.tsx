import { useState, type FormEvent } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";


export interface MedicamentosProps {
  nome: string;
  quantidade: number;
  veiculo: string;
  viaAdm: string;
  dose: number;
  unidadeDose: string;
  validade: string;
}

interface DashboardMedicamentosProps {
  medicamentosIniciais?: MedicamentosProps[];
}

interface FormularioMedicamento {
  nome: string;
  quantidade: string;
  veiculo: string;
  viaAdm: string;
  dose: string;
  validade: string;
}

interface MedicamentoAgrupado {
  nome: string;
  lotes: MedicamentosProps[];
}

interface LoteEmEdicao {
  nome: string;
  validade: string;
}

type Confirmacao =
  | {
      tipo: "editar";
      original: LoteEmEdicao;
      medicamento: MedicamentosProps;
    }
  | {
      tipo: "excluir";
      lote: LoteEmEdicao;
    };

const FORMULARIO_VAZIO: FormularioMedicamento = {
  nome: "",
  quantidade: "",
  veiculo: "",
  viaAdm: "",
  dose: "",
  validade: "",
};

const VEICULOS = [
  "Comprimido",
  "Líquido",
  "Cápsula",
  "Pomada",
  "Gotas",
  "Frasco",
];
const VIAS_DE_ADMINISTRACAO = [
  "Oral",
  "Injetável",
  "Tópica",
  "Subcutânea",
  "Intravenosa",
];

function unidadePorVeiculo(veiculo: string): string {
  if (veiculo === "Líquido") return "mg/ml";
  if (veiculo === "Gotas") return "mg/gota";
  if (veiculo === "Pomada") return "mg/g";
  return "mg";
}

function mensagemDeValidade(validade: string): string {
  const hoje = new Date();
  const dataValidade = new Date(`${validade}T00:00:00`);
  const inicioHoje = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
  );
  const diferencaEmDias = Math.ceil(
    (dataValidade.getTime() - inicioHoje.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diferencaEmDias < 0)
    return `Vencido há ${Math.abs(diferencaEmDias)} dias`;
  if (diferencaEmDias === 0) return "Vence hoje";
  return `Vence em ${diferencaEmDias} dias`;
}

function formatarData(validade: string): string {
  return new Date(`${validade}T00:00:00`).toLocaleDateString("pt-BR");
}

function normalizarNome(nome: string): string {
  return nome.trim().toLocaleLowerCase("pt-BR");
}

function agruparMedicamentos(
  medicamentos: MedicamentosProps[],
): MedicamentoAgrupado[] {
  const grupos = new Map<string, MedicamentoAgrupado>();

  medicamentos.forEach((medicamento) => {
    const chaveNome = normalizarNome(medicamento.nome);
    const grupoAtual = grupos.get(chaveNome);

    if (!grupoAtual) {
      grupos.set(chaveNome, {
        nome: medicamento.nome,
        lotes: [{ ...medicamento }],
      });
      return;
    }

    const loteExistente = grupoAtual.lotes.find(
      (lote) => lote.validade === medicamento.validade,
    );

    if (loteExistente) {
      loteExistente.quantidade += medicamento.quantidade;
    } else {
      grupoAtual.lotes.push(medicamento);
    }
  });

  return Array.from(grupos.values());
}

// Classifica a urgência da validade para dar destaque visual sem alterar a lógica de dados
function statusValidade(validade: string): "vencido" | "proximo" | "ok" {
  const hoje = new Date();
  const dataValidade = new Date(`${validade}T00:00:00`);
  const inicioHoje = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
  );
  const diferencaEmDias = Math.ceil(
    (dataValidade.getTime() - inicioHoje.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diferencaEmDias < 0) return "vencido";
  if (diferencaEmDias <= 30) return "proximo";
  return "ok";
}

export default function DashboardMedicamentos({
  medicamentosIniciais = [],
}: DashboardMedicamentosProps) {
  const [medicamentos, setMedicamentos] =
    useState<MedicamentosProps[]>(medicamentosIniciais);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [formulario, setFormulario] =
    useState<FormularioMedicamento>(FORMULARIO_VAZIO);
  const [loteEmEdicao, setLoteEmEdicao] = useState<LoteEmEdicao | null>(null);
  const [confirmacao, setConfirmacao] = useState<Confirmacao | null>(null);
  const [medicamentoAdicionado, setMedicamentoAdicionado] = useState
 < string | null
>(null);
  const medicamentosAgrupados = agruparMedicamentos(medicamentos);
  const quantidadeTotal = medicamentos.reduce(
    (total, medicamento) => total + medicamento.quantidade,
    0,
  );

  function atualizarCampo(campo: keyof FormularioMedicamento, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
  }

  function impedirAlteracaoPorScroll(
    evento: React.WheelEvent<HTMLInputElement>,
  ) {
    evento.currentTarget.blur();
  }

  function criarMedicamento(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novoMedicamento: MedicamentosProps = {
      nome: formulario.nome.trim(),
      quantidade: Number(formulario.quantidade),
      veiculo: formulario.veiculo.trim(),
      viaAdm: formulario.viaAdm.trim(),
      dose: Number(formulario.dose),
      unidadeDose: unidadePorVeiculo(formulario.veiculo),
      validade: formulario.validade,
    };

    if (loteEmEdicao) {
      setConfirmacao({
        tipo: "editar",
        original: loteEmEdicao,
        medicamento: novoMedicamento,
      });
      return;
    }

    setMedicamentos((listaAtual) => [...listaAtual, novoMedicamento]);
    setMedicamentoAdicionado(novoMedicamento.nome);
    fecharFormulario();
  }

  function editarLote(lote: MedicamentosProps) {
    setFormulario({
      nome: lote.nome,
      quantidade: String(lote.quantidade),
      veiculo: lote.veiculo,
      viaAdm: lote.viaAdm,
      dose: String(lote.dose),
      validade: lote.validade,
    });
    setLoteEmEdicao({ nome: lote.nome, validade: lote.validade });
    setFormularioAberto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function solicitarExclusao(lote: MedicamentosProps) {
    setConfirmacao({
      tipo: "excluir",
      lote: { nome: lote.nome, validade: lote.validade },
    });
  }

  function fecharFormulario() {
    setFormulario(FORMULARIO_VAZIO);
    setLoteEmEdicao(null);
    setFormularioAberto(false);
  }

  function confirmarAcao() {
    if (!confirmacao) return;

    if (confirmacao.tipo === "excluir") {
      setMedicamentos((listaAtual) =>
        listaAtual.filter(
          (medicamento) =>
            !(
              normalizarNome(medicamento.nome) ===
                normalizarNome(confirmacao.lote.nome) &&
              medicamento.validade === confirmacao.lote.validade
            ),
        ),
      );
    } else {
      setMedicamentos((listaAtual) => [
        ...listaAtual.filter(
          (medicamento) =>
            !(
              normalizarNome(medicamento.nome) ===
                normalizarNome(confirmacao.original.nome) &&
              medicamento.validade === confirmacao.original.validade
            ),
        ),
        confirmacao.medicamento,
      ]);
      fecharFormulario();
    }

    setConfirmacao(null);
  }

  function voltarParaDashboard() {
    window.history.pushState({}, "", "/dashboard/colaborador");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-8 md:px-10">
      
        <a href="/dashboard/colaborador"
        onClick={voltarParaDashboard}
        className="inline-flex w-fit items-center gap-1.5 font-body text-sm font-bold text-black underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
      >
        <span aria-hidden="true">←</span> Voltar para o dashboard
      </a>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
            Controle de estoque
          </p>
          <h1 className="m-0 font-display text-[28px] font-semibold text-black md:text-[32px]">
            Medicamentos
          </h1>
          <p className="m-0 mt-1.5 max-w-md font-body text-sm text-ink-soft">
            Cadastre e acompanhe os itens disponíveis para atendimento.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormularioAberto((estadoAtual) => !estadoAtual)}
          aria-expanded={formularioAberto}
          className="inline-flex items-center gap-1.5 rounded-pill bg-black  px-4 py-2.5 font-body text-[13px] font-bold text-white mt-15 border transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
        >
          {formularioAberto ? (
            <>
              <X size={15} aria-hidden="true" /> Fechar cadastro
            </>
          ) : (
            "+ Adicionar medicamento"
          )}
        </button>
      </header>

      {formularioAberto && (
        <form
          onSubmit={criarMedicamento}
          aria-labelledby="novo-registro-titulo"
          className="grid grid-cols-1 gap-4 rounded-lg border border-black/10 bg-white p-6 md:grid-cols-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 md:col-span-2">
            <div>
              <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
                Novo registro
              </p>
              <h2
                id="novo-registro-titulo"
                className="m-0 font-display text-lg font-semibold text-black"
              >
                Adicionar medicamento
              </h2>
            </div>
            <span className="font-body text-xs text-ink-soft">
              * campos obrigatórios
            </span>
          </div>

          <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
            Nome *
            <input
              type="text"
              value={formulario.nome}
              onChange={(evento) =>
                atualizarCampo("nome", evento.target.value)
              }
              required
              className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
            />
          </label>

          <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
            Quantidade *
            <input
              type="number"
              min="0"
              value={formulario.quantidade}
              onWheel={impedirAlteracaoPorScroll}
              onChange={(evento) =>
                atualizarCampo("quantidade", evento.target.value)
              }
              required
              className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
            />
          </label>

          <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
            Veículo *
            <select
              value={formulario.veiculo}
              onChange={(evento) =>
                atualizarCampo("veiculo", evento.target.value)
              }
              required
              className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
            >
              <option value="">Selecione o veículo</option>
              {VEICULOS.map((veiculo) => (
                <option key={veiculo} value={veiculo}>
                  {veiculo}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
            Via de administração *
            <select
              value={formulario.viaAdm}
              onChange={(evento) =>
                atualizarCampo("viaAdm", evento.target.value)
              }
              required
              className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
            >
              <option value="">Selecione a via</option>
              {VIAS_DE_ADMINISTRACAO.map((via) => (
                <option key={via} value={via}>
                  {via}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
            Dose ({unidadePorVeiculo(formulario.veiculo)}) *
            <input
              type="number"
              min="0"
              step="any"
              value={formulario.dose}
              onWheel={impedirAlteracaoPorScroll}
              onChange={(evento) =>
                atualizarCampo("dose", evento.target.value)
              }
              required
              className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
            />
            <small className="font-body text-xs font-normal text-ink-soft">
              Unidade definida pelo veículo selecionado:{" "}
              {unidadePorVeiculo(formulario.veiculo)}
            </small>
          </label>

          <label className="flex flex-col gap-1.5 font-body text-[13px] font-bold text-black">
            Validade *
            <input
              type="date"
              value={formulario.validade}
              onChange={(evento) =>
                atualizarCampo("validade", evento.target.value)
              }
              required
              className="rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm font-normal text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-fit items-center justify-self-center rounded-pill bg-black px-5 py-3 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 md:col-span-2"
          >
            Salvar medicamento
          </button>
        </form>
      )}

      <section
        aria-labelledby="medicamentos-cadastrados"
        className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
              Inventário
            </p>
            <h2
              id="medicamentos-cadastrados"
              className="m-0 font-display text-[1.15rem] font-semibold text-black"
            >
              Medicamentos cadastrados
            </h2>
          </div>
          <span className="rounded-pill border border-gold px-3 py-1.5 font-body text-xs font-bold text-gold">
            {quantidadeTotal} unidades · {medicamentosAgrupados.length} tipos
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {medicamentosAgrupados.map((grupo) => (
            <div
              key={normalizarNome(grupo.nome)}
              className="flex flex-col gap-3 rounded-lg border border-black/10 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="m-0 font-display text-base font-semibold text-black">
                  {grupo.nome}
                </h2>
                <span className="rounded-pill bg-gold/15 px-2.5 py-1 font-body text-[11px] font-bold text-gold">
                  {grupo.lotes.length}{" "}
                  {grupo.lotes.length === 1 ? "validade" : "validades"}
                </span>
              </div>
              <p className="m-0 font-body text-sm text-ink-soft">
                Total em estoque:{" "}
                <strong className="font-bold text-black">
                  {grupo.lotes.reduce(
                    (total, lote) => total + lote.quantidade,
                    0,
                  )}{" "}
                  unidades
                </strong>
              </p>

              <div className="flex flex-col gap-2.5">
                {grupo.lotes.map((lote) => {
                  const status = statusValidade(lote.validade);
                  return (
                    <div
                      key={lote.validade}
                      className={`flex flex-col gap-1 rounded-md border p-3.5 ${
                        status === "vencido"
                          ? "border-error/30 bg-error/5"
                          : status === "proximo"
                            ? "border-amber/30 bg-amber/5"
                            : "border-black/10 bg-parchment/40"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="font-body text-sm font-bold text-black">
                          {lote.quantidade} unidades
                        </strong>
                        <span className="font-body text-xs text-ink-soft">
                          {formatarData(lote.validade)}
                        </span>
                      </div>
                      <p className="m-0 font-body text-xs text-ink-soft">
                        Veículo: {lote.veiculo}
                      </p>
                      <p className="m-0 font-body text-xs text-ink-soft">
                        Via: {lote.viaAdm}
                      </p>
                      <p className="m-0 font-body text-xs text-ink-soft">
                        Dose: {lote.dose} {lote.unidadeDose}
                      </p>
                      <small
                        className={`font-body text-xs font-bold ${
                          status === "vencido"
                            ? "text-error"
                            : status === "proximo"
                              ? "text-amber"
                              : "text-ink-soft"
                        }`}
                      >
                        {mensagemDeValidade(lote.validade)}
                      </small>
                      <div className="mt-2 flex flex-wrap gap-2 border-t border-black/10 pt-2.5">
                        <button
                          type="button"
                          onClick={() => editarLote(lote)}
                          aria-label={`Editar lote de ${lote.quantidade} unidades de ${grupo.nome}, validade ${formatarData(lote.validade)}`}
                          className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill border border-black/20 bg-white px-3 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                        >
                          <Pencil size={14} className="shrink-0" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => solicitarExclusao(lote)}
                          aria-label={`Excluir lote de ${lote.quantidade} unidades de ${grupo.nome}, validade ${formatarData(lote.validade)}`}
                          className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-pill px-3 font-body text-[13px] font-bold text-error/70 transition-colors hover:bg-error/10 hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                        >
                          <Trash2 size={14} className="shrink-0" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {medicamentosAgrupados.length === 0 && (
            <p className="m-0 rounded-md border border-dashed border-black/15 px-4 py-8 text-center font-body text-sm text-ink-soft md:col-span-2">
              Nenhum medicamento cadastrado. Adicione o primeiro item acima.
            </p>
          )}
        </div>
      </section>

      {confirmacao && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmacao-titulo"
            className="flex w-full max-w-sm flex-col gap-3 rounded-xl bg-white p-6"
          >
            <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-black/50">
              Confirmação
            </p>
            <h2
              id="confirmacao-titulo"
              className="m-0 font-display text-lg font-semibold text-black"
            >
              {confirmacao.tipo === "editar"
                ? "Salvar alterações?"
                : "Excluir este lote?"}
            </h2>
            <p className="m-0 font-body text-sm text-ink-soft">
              {confirmacao.tipo === "editar"
                ? "As informações deste lote serão atualizadas no estoque."
                : "Esta ação removerá todas as unidades deste lote e não poderá ser desfeita."}
            </p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmacao(null)}
                autoFocus
                className="inline-flex items-center rounded-pill border border-black/20 bg-white px-4 py-2.5 font-body text-[13px] font-bold text-black transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarAcao}
                className={`inline-flex items-center rounded-pill px-4 py-2.5 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 ${
                  confirmacao.tipo === "excluir" ? "bg-error" : "bg-black"
                }`}
              >
                {confirmacao.tipo === "editar"
                  ? "Salvar alterações"
                  : "Excluir lote"}
              </button>
            </div>
          </div>
        </div>
          )}
         {medicamentoAdicionado && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sucesso-titulo"
            className="flex w-full max-w-sm flex-col items-center gap-3 rounded-xl bg-white p-6 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-volunteer-soft text-volunteer">
              <Check size={22} />
            </span>
            <h2
              id="sucesso-titulo"
              className="m-0 font-display text-lg font-semibold text-black"
            >
              Medicamento adicionado!
            </h2>
            <p className="m-0 font-body text-sm text-ink-soft">
              <strong className="text-black">{medicamentoAdicionado}</strong>{" "}
              foi salvo no estoque com sucesso.
            </p>
            <button
              type="button"
              onClick={() => setMedicamentoAdicionado(null)}
              autoFocus
              className="mt-2 inline-flex items-center rounded-pill bg-black px-5 py-2.5 font-body text-sm font-bold text-parchment transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
     
    </div>
  );
}