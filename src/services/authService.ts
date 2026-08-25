// src/services/authService.ts
import type { LoginCredentials, LoginResponse, ApiErrorPayload } from "../types/auth";

// Configure VITE_API_URL no .env do front. Nunca deixe a URL da API hardcoded
// nem aponte para http:// em produção — sempre https://.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export class AuthApiError extends Error {
  status: number;
  codigo?: ApiErrorPayload["codigo"];

  constructor(message: string, status: number, codigo?: ApiErrorPayload["codigo"]) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.codigo = codigo;
  }
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    // "include" garante que o cookie httpOnly com o token (definido pelo back)
    // seja enviado/recebido automaticamente. É por isso que o back NÃO deve
    // devolver o token no corpo do JSON — só via Set-Cookie.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  let data: LoginResponse & Partial<ApiErrorPayload>;
  try {
    data = await response.json();
  } catch {
    throw new AuthApiError("Resposta inválida do servidor.", response.status);
  }

  if (!response.ok) {
    throw new AuthApiError(
      data.mensagem ?? "Não foi possível entrar. Tente novamente.",
      response.status,
      data.codigo
    );
  }

  return data as LoginResponse;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

// Usado ao carregar a aplicação para checar se o cookie ainda é válido,
// sem precisar guardar nada sensível no localStorage.
export async function verificarSessao(): Promise<LoginResponse["usuario"] | null> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.usuario ?? null;
}
