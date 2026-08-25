// src/types/dashboard.ts
// Contrato de dados entre o front e o back para o painel do colaborador.

export interface ColaboradorInfo {
  nome: string;
}

export interface ResumoEstoque {
  totalMedicamentos: number;
  proximosVencimento: number;
  vencidos: number;
  estoqueBaixo: number;
}

export interface ResumoDoacoes {
  // valor em reais, ex: 4230.50
  valorTotalMes: number;
  quantidadeMes: number;
}

export interface ProximaAcao {
  id: string;
  titulo: string;
  // formato ISO 8601, ex: "2026-09-14"
  data: string;
  voluntariosInscritos: number;
}

export interface DashboardColaboradorData {
  colaborador: ColaboradorInfo;
  estoque: ResumoEstoque;
  doacoes: ResumoDoacoes;
  proximasAcoes: ProximaAcao[];
}
