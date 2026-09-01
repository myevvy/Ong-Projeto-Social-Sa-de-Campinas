// src/services/dashboardService.ts
import type { DashboardColaboradorData } from "../types/dashboard";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function buscarDashboardColaborador(): Promise<DashboardColaboradorData> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/pagFunc`, {
    method: "GET",
    headers,
  });

  if (response.status === 401) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar o painel. Tente novamente.");
  }

  return response.json();
}
