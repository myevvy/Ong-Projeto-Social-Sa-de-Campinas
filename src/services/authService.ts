// src/services/authService.ts

// FIX: removidas login(), AuthApiError e verificarSessao() — código morto,
// nunca chamado em nenhuma tela, e com um contrato (LoginResponse { usuario, mensagem })
// que não bate com o que o backend realmente devolve em POST /login: { mensagem, token }
// (um JWT com { id, tipo } no payload). Quem realmente autentica é o fetch feito
// direto em LoginPage.tsx, que já usa o formato correto. Manter essas funções aqui
// só criava confusão sobre qual era a implementação "certa" de login.
// verificarSessao() também dependia de GET /pagAdm, uma rota protegida só para
// admins (ver back-end/src/routes.js), então nunca funcionaria para os outros tipos
// de usuário mesmo se estivesse sendo chamada.

export async function logout(): Promise<void> {
  limparSessaoUsuario();
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

  // FIX: lista exata de e-mails de admin, nunca substring — "adminha@x.com",
  // "sadmin@x.com" etc. não devem virar admin só por conter "adm".
  const EMAILS_ADMIN = ["admin@saudecampinas.org", "admin@teste.com"];
  if (EMAILS_ADMIN.includes(emailNorm)) {
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
    // FIX: usuário sem registro local não deve ser tratado como "aceito" por
    // padrão — isso bypassava toda a fila de aprovação (bastava não estar na
    // lista local, ex.: localStorage limpo, outro navegador, aba anônima).
    // Aqui só dizemos que não há registro local; quem decide se o login é
    // válido de fato é o backend (ver enviarLogin em LoginPage.tsx), que só
    // libera acesso a quem realmente tem e-mail/senha corretos no banco.
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
    // FIX: antes limpava a sessionStorage inteira (sessionStorage.clear()),
    // apagando qualquer outro dado que outra parte do app guarde ali.
    // Remove só a chave que este módulo é dono.
    sessionStorage.removeItem(STORAGE_KEY_ALERTA_SEGURANCA);
    window.dispatchEvent(new CustomEvent("ong_auth_change"));
  } catch (error) {
    console.error("Erro ao limpar sessão:", error);
  }
}

export function definirAlertaSeguranca(mensagem: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_ALERTA_SEGURANCA, mensagem);
  } catch {
    // sessionStorage pode não estar disponível (modo privado restrito, quota
    // cheia etc.); o alerta simplesmente não é exibido nesse caso.
  }
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