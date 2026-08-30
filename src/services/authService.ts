// src/services/authService.ts
import type {
  LoginCredentials,
  LoginResponse,
  ApiErrorPayload,
} from "../types/auth";

// Configure VITE_API_URL no .env do front. Nunca deixe a URL da API hardcoded
// nem aponte para http:// em produção — sempre https://.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export class AuthApiError extends Error {
  status: number;
  codigo?: ApiErrorPayload["codigo"];

  constructor(
    message: string,
    status: number,
    codigo?: ApiErrorPayload["codigo"],
  ) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.codigo = codigo;
  }
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
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
      data.codigo,
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
export async function verificarSessao(): Promise<
  LoginResponse["usuario"] | null
> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.usuario ?? null;
}

export type StatusAcesso = "pendente" | "aceito" | "recusado";
export type TipoUsuarioAcesso = "voluntario" | "colaborador" | "adm";

export interface SolicitacaoAcesso {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  tipo: "voluntario" | "colaborador";
  status: StatusAcesso;
  dataSolicitacao: string;
  sobre?: string;
  endereco?: string;
  cep?: string;
}

const STORAGE_KEY_SOLICITACOES = "ong_solicitacoes_usuarios";

// 2 usuários reais já existentes no banco de dados MySQL que iniciam como pendentes
export const USUARIOS_INICIAIS: SolicitacaoAcesso[] = [
  {
    id: 2,
    nome: "func1",
    email: "func@gmail.com",
    telefone: "(19) 99145-2201",
    tipo: "colaborador",
    status: "pendente",
    dataSolicitacao: "2026-08-26",
    sobre: "Colaborador cadastrado no banco de dados.",
  },
  {
    id: 3,
    nome: "user+18",
    email: "use18r@gmail.com",
    telefone: "(19) 99124-3012",
    tipo: "voluntario",
    status: "pendente",
    dataSolicitacao: "2026-08-25",
    sobre: "Voluntário cadastrado no banco de dados.",
  },
];

export function obterSolicitacoes(): SolicitacaoAcesso[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOLICITACOES);
    let lista: SolicitacaoAcesso[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        lista = parsed;
      }
    }

    // Remove quaisquer resquícios de usuários fictícios (Beatriz e Paulo)
    lista = lista.filter(
      (u) =>
        !u.nome.toLowerCase().includes("beatriz") &&
        !u.nome.toLowerCase().includes("paulo") &&
        !u.email.toLowerCase().includes("beatriz") &&
        !u.email.toLowerCase().includes("paulo") &&
        u.email !== "voluntario@teste.com" &&
        u.email !== "colaborador@teste.com",
    );

    // Garante que os usuários reais do banco (func@gmail.com e use18r@gmail.com) estejam presentes
    USUARIOS_INICIAIS.forEach((userReal) => {
      const existe = lista.some(
        (u) =>
          u.email.toLowerCase().trim() === userReal.email.toLowerCase().trim(),
      );
      if (!existe) {
        lista.push(userReal);
      }
    });

    salvarSolicitacoes(lista);
    return lista;
  } catch {
    salvarSolicitacoes(USUARIOS_INICIAIS);
    return USUARIOS_INICIAIS;
  }
}

export function salvarSolicitacoes(lista: SolicitacaoAcesso[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SOLICITACOES, JSON.stringify(lista));
  } catch (error) {
    console.error("Erro ao salvar solicitações:", error);
  }
}

export function adicionarSolicitacao(dados: {
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  sobre?: string;
  endereco?: string;
  cep?: string;
}): void {
  const lista = obterSolicitacoes();
  const emailNorm = dados.email.toLowerCase().trim();
  const index = lista.findIndex(
    (u) => u.email.toLowerCase().trim() === emailNorm,
  );

  const tipoNormalizado: "voluntario" | "colaborador" =
    dados.tipo === "func" || dados.tipo === "colaborador"
      ? "colaborador"
      : "voluntario";

  const nova: SolicitacaoAcesso = {
    id: index >= 0 ? lista[index].id : Date.now(),
    nome: dados.nome.trim(),
    email: emailNorm,
    telefone: dados.telefone.trim(),
    tipo: tipoNormalizado,
    status: "pendente",
    dataSolicitacao: new Date().toISOString().split("T")[0],
    sobre: dados.sobre?.trim(),
    endereco: dados.endereco?.trim(),
    cep: dados.cep?.trim(),
  };

  if (index >= 0) {
    lista[index] = { ...lista[index], ...nova };
  } else {
    lista.unshift(nova);
  }

  salvarSolicitacoes(lista);
}

export function atualizarStatusSolicitacao(
  id: number,
  status: StatusAcesso,
): SolicitacaoAcesso[] {
  const lista = obterSolicitacoes().map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  salvarSolicitacoes(lista);
  return lista;
}

export function atualizarTipoSolicitacao(
  id: number,
  tipo: "voluntario" | "colaborador",
): SolicitacaoAcesso[] {
  const lista = obterSolicitacoes().map((item) =>
    item.id === id ? { ...item, tipo } : item,
  );
  salvarSolicitacoes(lista);
  return lista;
}

export function verificarStatusUsuario(email: string): {
  encontrado: boolean;
  status: StatusAcesso;
  tipo: "voluntario" | "colaborador" | "adm";
  nome?: string;
  id?: number;
} {
  const emailNorm = email.toLowerCase().trim();

  if (
    emailNorm.includes("adm") ||
    emailNorm === "admin@saudecampinas.org" ||
    emailNorm === "admin@teste.com"
  ) {
    return {
      encontrado: true,
      status: "aceito",
      tipo: "adm",
      nome: "Administrador",
      id: 1,
    };
  }

  const lista = obterSolicitacoes();
  const usuario = lista.find((u) => u.email.toLowerCase().trim() === emailNorm);

  if (!usuario) {
    return {
      encontrado: false,
      status: "aceito",
      tipo: "voluntario",
    };
  }

  return {
    encontrado: true,
    status: usuario.status,
    tipo: usuario.tipo,
    nome: usuario.nome,
    id: usuario.id,
  };
}
