import { useState, type FormEvent } from "react";
import "./DashboardMedicamentos.css";

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
    <div className="dashboard-medicamentos">
      <a href="/dashboard/colaborador" onClick={voltarParaDashboard}>
        Voltar para o dashboard
      </a>
      <header className="dashboard-medicamentos__header">
        <div>
          <p className="dashboard-medicamentos__eyebrow">Controle de estoque</p>
          <h1>Medicamentos</h1>
          <p className="dashboard-medicamentos__intro">
            Cadastre e acompanhe os itens disponíveis para atendimento.
          </p>
        </div>
        <button
          className="dashboard-medicamentos__primary-button"
          type="button"
          onClick={() => setFormularioAberto((estadoAtual) => !estadoAtual)}
        >
          {formularioAberto ? "Fechar cadastro" : "+ Adicionar medicamento"}
        </button>
      </header>

      {formularioAberto && (
        <form className="medicamento-form" onSubmit={criarMedicamento}>
          <div className="medicamento-form__heading">
            <div>
              <p className="dashboard-medicamentos__eyebrow">Novo registro</p>
              <h2>Adicionar medicamento</h2>
            </div>
            <span className="medicamento-form__required">
              * campos obrigatórios
            </span>
          </div>
          <label className="medicamento-form__field">
            Nome
            <input
              type="text"
              value={formulario.nome}
              onChange={(evento) => atualizarCampo("nome", evento.target.value)}
              required
            />
          </label>
          <label className="medicamento-form__field">
            Quantidade
            <input
              type="number"
              min="0"
              value={formulario.quantidade}
              onWheel={impedirAlteracaoPorScroll}
              onChange={(evento) =>
                atualizarCampo("quantidade", evento.target.value)
              }
              required
            />
          </label>
          <label className="medicamento-form__field">
            Veículo
            <select
              value={formulario.veiculo}
              onChange={(evento) =>
                atualizarCampo("veiculo", evento.target.value)
              }
              required
            >
              <option value="">Selecione o veículo</option>
              {VEICULOS.map((veiculo) => (
                <option key={veiculo} value={veiculo}>
                  {veiculo}
                </option>
              ))}
            </select>
          </label>
          <label className="medicamento-form__field">
            Via de Administração
            <select
              value={formulario.viaAdm}
              onChange={(evento) =>
                atualizarCampo("viaAdm", evento.target.value)
              }
              required
            >
              <option value="">Selecione a via</option>
              {VIAS_DE_ADMINISTRACAO.map((via) => (
                <option key={via} value={via}>
                  {via}
                </option>
              ))}
            </select>
          </label>
          <label className="medicamento-form__field">
            Dose ({unidadePorVeiculo(formulario.veiculo)})
            <input
              type="number"
              min="0"
              step="any"
              value={formulario.dose}
              onWheel={impedirAlteracaoPorScroll}
              onChange={(evento) => atualizarCampo("dose", evento.target.value)}
              required
            />
            <small>
              Unidade definida pelo veículo selecionado:{" "}
              {unidadePorVeiculo(formulario.veiculo)}
            </small>
          </label>
          <label className="medicamento-form__field">
            Validade
            <input
              type="date"
              value={formulario.validade}
              onChange={(evento) =>
                atualizarCampo("validade", evento.target.value)
              }
              required
            />
          </label>
          <button className="medicamento-form__submit" type="submit">
            Salvar medicamento
          </button>
        </form>
      )}

      <section
        className="medicamentos-section"
        aria-labelledby="medicamentos-cadastrados"
      >
        <div className="medicamentos-section__heading">
          <div>
            <p className="dashboard-medicamentos__eyebrow">Inventário</p>
            <h2 id="medicamentos-cadastrados">Medicamentos cadastrados</h2>
          </div>
          <span className="medicamentos-section__count">
            {quantidadeTotal} unidades · {medicamentosAgrupados.length} tipos
          </span>
        </div>
        <div className="medicamentos-list">
          {medicamentosAgrupados.map((grupo) => (
            <div className="medicamento-card" key={normalizarNome(grupo.nome)}>
              <div className="medicamento-card__header">
                <h2>{grupo.nome}</h2>
                <span>
                  {grupo.lotes.length}{" "}
                  {grupo.lotes.length === 1 ? "validade" : "validades"}
                </span>
              </div>
              <p className="medicamento-card__total">
                Total em estoque:{" "}
                {grupo.lotes.reduce(
                  (total, lote) => total + lote.quantidade,
                  0,
                )}{" "}
                unidades
              </p>
              <div className="medicamento-card__lotes">
                {grupo.lotes.map((lote) => (
                  <div className="medicamento-lote" key={lote.validade}>
                    <div className="medicamento-lote__heading">
                      <strong>{lote.quantidade} unidades</strong>
                      <span>{formatarData(lote.validade)}</span>
                    </div>
                    <p>Veículo: {lote.veiculo}</p>
                    <p>Via: {lote.viaAdm}</p>
                    <p>
                      Dose: {lote.dose} {lote.unidadeDose}
                    </p>
                    <small>{mensagemDeValidade(lote.validade)}</small>
                    <div className="medicamento-lote__actions">
                      <button type="button" onClick={() => editarLote(lote)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="medicamento-lote__delete"
                        onClick={() => solicitarExclusao(lote)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {medicamentosAgrupados.length === 0 && (
            <p className="medicamentos-list__empty">
              Nenhum medicamento cadastrado. Adicione o primeiro item acima.
            </p>
          )}
        </div>
      </section>

      {confirmacao && (
        <div className="confirmacao-overlay" role="presentation">
          <div
            className="confirmacao-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmacao-titulo"
          >
            <p className="dashboard-medicamentos__eyebrow">Confirmação</p>
            <h2 id="confirmacao-titulo">
              {confirmacao.tipo === "editar"
                ? "Salvar alterações?"
                : "Excluir este lote?"}
            </h2>
            <p>
              {confirmacao.tipo === "editar"
                ? "As informações deste lote serão atualizadas no estoque."
                : "Esta ação removerá todas as unidades deste lote e não poderá ser desfeita."}
            </p>
            <div className="confirmacao-modal__actions">
              <button type="button" onClick={() => setConfirmacao(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className={
                  confirmacao.tipo === "excluir"
                    ? "confirmacao-modal__confirm--danger"
                    : "confirmacao-modal__confirm"
                }
                onClick={confirmarAcao}
              >
                {confirmacao.tipo === "editar"
                  ? "Salvar alterações"
                  : "Excluir lote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
