// src/services/dashboardService.ts
import type { DashboardColaboradorData } from "../types/dashboard";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export async function buscarDashboardColaborador(): Promise<DashboardColaboradorData> {
  const response = await fetch(`${API_BASE_URL}/api/colaborador/dashboard`, {
    method: "GET",
    // Envia o cookie httpOnly de sessão — o back identifica o colaborador por ele,
    // então não é necessário (nem seguro) passar o id do usuário na URL.
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar o painel. Tente novamente.");
  }

  return response.json();
}
