export interface MedicamentoItem {
  id?: number;
  nome: string;
  quantidade: number;
  veiculo: string;
  viaAdm: string;
  dose: number;
  unidadeDose: string;
  validade: string;
  lote?: string;
  vencido?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const STORAGE_KEY_MEDICAMENTOS = "ong_medicamentos_cache";

export function normalizarMedicamento(
  raw: Record<string, unknown>,
): MedicamentoItem {
  const nome = String(raw.nome_remedio || raw.nome || "Medicamento sem nome");
  const quantidade = Number(raw.quantidade ?? 0);
  const veiculo = String(raw.apresentacao || raw.veiculo || "Comprimido");
  const viaAdm = String(raw.via_adm || raw.viaAdm || "Oral");
  const dose = Number(raw.dose ?? 500);
  const unidadeDose = String(raw.unidadeDose || "mg");
  const dataVal =
    raw.data_validade || raw.validade || new Date().toISOString().split("T")[0];
  const validade = String(dataVal).split("T")[0];

  const hoje = new Date().toISOString().split("T")[0];
  const estaVencido = Boolean(raw.vencido) || validade < hoje;

  return {
    id: raw.ID_remedio
      ? Number(raw.ID_remedio)
      : raw.id
        ? Number(raw.id)
        : undefined,
    nome,
    quantidade,
    veiculo,
    viaAdm,
    dose,
    unidadeDose,
    validade,
    lote: raw.lote ? String(raw.lote) : undefined,
    vencido: estaVencido,
  };
}

export async function buscarMedicamentosApi(): Promise<MedicamentoItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/remedio`, {
      method: "GET",
    });

    if (!res.ok) {
      return obterMedicamentosCache();
    }

    const dados = await res.json();
    const listaRaw = Array.isArray(dados.mensagem)
      ? dados.mensagem
      : Array.isArray(dados)
        ? dados
        : [];

    const normalizados = listaRaw.map(normalizarMedicamento);
    salvarMedicamentosCache(normalizados);
    return normalizados;
  } catch {
    return obterMedicamentosCache();
  }
}

export function obterMedicamentosCache(): MedicamentoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEDICAMENTOS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizarMedicamento);
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function salvarMedicamentosCache(lista: MedicamentoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MEDICAMENTOS, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent("ong_medicamentos_atualizados"));
  } catch (error) {
    console.error("Erro ao salvar cache de medicamentos:", error);
  }
}

/**
 * Deriva a lista de "faltando agora" a partir do estoque geral — não existe
 * (ainda) um campo de prioridade no back, então usamos como critério os
 * itens com MENOR quantidade em estoque (mais perto de acabar).
 * Ignora vencidos (esses são problema de descarte, não de falta) e limita
 * a `maximo` itens pra caber no card da página de Doação.
 */
export function itensFaltandoAgora(
  medicamentos: MedicamentoItem[],
  { limite = 15, maximo = 6 }: { limite?: number; maximo?: number } = {},
): MedicamentoItem[] {
  return medicamentos
    .filter((item) => !item.vencido && item.quantidade <= limite)
    .sort((a, b) => a.quantidade - b.quantidade)
    .slice(0, maximo);
}
