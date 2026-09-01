// src/services/authService.ts
import type {
  LoginCredentials,
  LoginResponse,
  ApiErrorPayload,
} from "../types/auth";

// Configure VITE_API_URL no .env do front.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
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
  limparSessaoUsuario();
}

export async function verificarSessao(): Promise<
  LoginResponse["usuario"] | null
> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/pagAdm`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.usuario ?? null;
    }
  } catch {}

  return null;
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
const STORAGE_KEY_ALERTA_SEGURANCA = "ong_alerta_seguranca";

// Usuários iniciais cadastrados para testes e controle
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

    // Garante que os usuários de teste estejam na lista se ela estiver vazia
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
    window.dispatchEvent(new CustomEvent("ong_solicitacoes_atualizadas"));
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
  window.dispatchEvent(new CustomEvent("ong_auth_change"));
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
  window.dispatchEvent(new CustomEvent("ong_auth_change"));
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

  // Contas com privilégio de administração
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
    // Se o usuário não está na lista local de solicitações, mas fez login no backend com token válido:
    return {
      encontrado: false,
      status: "aceito",
      tipo:
        emailNorm.includes("func") || emailNorm.includes("colab")
          ? "colaborador"
          : "voluntario",
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

export interface SessaoUsuario {
  id: number | string;
  nome: string;
  email: string;
  tipo: "admin" | "colaborador" | "voluntario";
  token: string;
}

export function normalizarTipoUsuario(
  tipoRaw?: string,
): "admin" | "colaborador" | "voluntario" {
  if (!tipoRaw) return "voluntario";
  const t = tipoRaw.toLowerCase().trim();
  if (t === "adm" || t === "admin" || t === "administrador") return "admin";
  if (t === "func" || t === "colaborador" || t === "funcionario")
    return "colaborador";
  return "voluntario";
}

export function obterSessaoUsuario(): SessaoUsuario | null {
  try {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("usuario");
    if (!token || !rawUser) {
      return null;
    }
    const parsed = JSON.parse(rawUser);
    if (!parsed || typeof parsed !== "object" || !parsed.email) {
      return null;
    }

    // Se o status na lista do administrador foi explicitamente marcado como 'recusado', encerra
    const statusCheck = verificarStatusUsuario(parsed.email);
    if (statusCheck.encontrado && statusCheck.status === "recusado") {
      limparSessaoUsuario();
      definirAlertaSeguranca(
        "Seu acesso foi revogado pela administração da ONG.",
      );
      return null;
    }

    // Sincroniza o cargo caso o administrador tenha alterado no painel
    let tipoFinal = normalizarTipoUsuario(parsed.tipo);
    if (statusCheck.encontrado && statusCheck.tipo !== "adm") {
      tipoFinal = normalizarTipoUsuario(statusCheck.tipo);
    }

    const sessaoAtualizada: SessaoUsuario = {
      id: parsed.id ?? statusCheck.id ?? 1,
      nome:
        parsed.nome ||
        statusCheck.nome ||
        (tipoFinal === "admin"
          ? "Administrador"
          : tipoFinal === "colaborador"
            ? "Colaborador"
            : "Voluntário"),
      email: parsed.email,
      tipo: tipoFinal,
      token,
    };

    return sessaoAtualizada;
  } catch {
    return null;
  }
}

export function limparSessaoUsuario(): void {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    sessionStorage.clear();
    window.dispatchEvent(new CustomEvent("ong_auth_change"));
  } catch (error) {
    console.error("Erro ao limpar sessão:", error);
  }
}

export function definirAlertaSeguranca(mensagem: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_ALERTA_SEGURANCA, mensagem);
  } catch {}
}

export function obterEConsumirAlertaSeguranca(): string | null {
  try {
    const alerta = sessionStorage.getItem(STORAGE_KEY_ALERTA_SEGURANCA);
    if (alerta) {
      sessionStorage.removeItem(STORAGE_KEY_ALERTA_SEGURANCA);
      return alerta;
    }
    return null;
  } catch {
    return null;
  }
}
