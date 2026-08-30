// src/services/messageService.ts
import { obterSolicitacoes } from "./authService";

export type PapelUsuario = "voluntario" | "colaborador" | "admin";

export interface ContatoDestino {
  id: string; // "geral" | "admin" | email / id específico
  nome: string;
  email: string;
  tipo: PapelUsuario | "grupo";
  descricao?: string;
}

export interface MensagemChat {
  id: number;
  canalId: string; // "geral" ou chave única para dm: "dm_email1_email2"
  remetenteNome: string;
  remetenteEmail: string;
  remetenteTipo: PapelUsuario;
  destinatarioNome: string;
  destinatarioEmail: string;
  destinatarioTipo: PapelUsuario | "grupo";
  texto: string;
  criadaEm: string; // ISO date
}

const STORAGE_KEY_MENSAGENS = "ong_mensagens_chat";

export const MENSAGENS_INICIAIS: MensagemChat[] = [
  {
    id: 1,
    canalId: "geral",
    remetenteNome: "Coordenação Geral",
    remetenteEmail: "admin@saudecampinas.org",
    remetenteTipo: "admin",
    destinatarioNome: "📢 Canal Geral (Avisos de Todos)",
    destinatarioEmail: "geral@saudecampinas.org",
    destinatarioTipo: "grupo",
    texto: "📢 AVISO GERAL: O próximo mutirão na Vila Industrial está com a triagem de insumos pronta. Lembrem-se de chegar com 15 min de antecedência para o briefing inicial!",
    criadaEm: "2026-08-28T09:30:00.000Z",
  },
  {
    id: 2,
    canalId: "geral",
    remetenteNome: "Carlos Eduardo (Colaborador)",
    remetenteEmail: "carlos.colab@saudecampinas.org",
    remetenteTipo: "colaborador",
    destinatarioNome: "📢 Canal Geral (Avisos de Todos)",
    destinatarioEmail: "geral@saudecampinas.org",
    destinatarioTipo: "grupo",
    texto: "Bom dia equipe! Estaremos organizando os estoques e as fichas de atendimento a partir das 08h30. Qualquer dúvida, estou à disposição nas mensagens diretas!",
    criadaEm: "2026-08-29T10:15:00.000Z",
  },
  {
    id: 3,
    canalId: "dm_admin@saudecampinas.org_carlos.colab@saudecampinas.org",
    remetenteNome: "Carlos Eduardo (Colaborador)",
    remetenteEmail: "carlos.colab@saudecampinas.org",
    remetenteTipo: "colaborador",
    destinatarioNome: "Coordenação Geral (Administração)",
    destinatarioEmail: "admin@saudecampinas.org",
    destinatarioTipo: "admin",
    texto: "Olá coordenação, revisamos os medicamentos com validade próxima e já separamos para o mutirão deste sábado.",
    criadaEm: "2026-08-29T11:00:00.000Z",
  },
  {
    id: 4,
    canalId: "dm_carlos.colab@saudecampinas.org_use18r@gmail.com",
    remetenteNome: "Carlos Eduardo (Colaborador)",
    remetenteEmail: "carlos.colab@saudecampinas.org",
    remetenteTipo: "colaborador",
    destinatarioNome: "user+18",
    destinatarioEmail: "use18r@gmail.com",
    destinatarioTipo: "voluntario",
    texto: "Olá! Vi que você confirmou presença na ação. Caso precise de carona a partir da estação central, nos avise!",
    criadaEm: "2026-08-29T14:20:00.000Z",
  },
];

export function gerarCanalDmId(email1: string, email2: string): string {
  const sorted = [email1.toLowerCase().trim(), email2.toLowerCase().trim()].sort();
  return `dm_${sorted[0]}_${sorted[1]}`;
}

export function obterMensagensChat(): MensagemChat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MENSAGENS);
    if (!raw) {
      salvarMensagensChat(MENSAGENS_INICIAIS);
      return MENSAGENS_INICIAIS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    salvarMensagensChat(MENSAGENS_INICIAIS);
    return MENSAGENS_INICIAIS;
  } catch {
    return MENSAGENS_INICIAIS;
  }
}

export function salvarMensagensChat(lista: MensagemChat[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MENSAGENS, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent("ong_mensagens_atualizadas"));
  } catch (error) {
    console.error("Erro ao salvar mensagens:", error);
  }
}

/**
 * Retorna a lista de destinatários permitidos com base no perfil de quem está autenticado.
 * REGRAS DE SEGURANÇA:
 * - Voluntário: SÓ pode mandar para Canal Geral, Administrador e Colaboradores. (NÃO pode mandar para outros voluntários).
 * - Colaborador: Pode mandar para Canal Geral, Administrador, outros Colaboradores e Voluntários.
 * - Administrador: Pode mandar para Canal Geral, Colaboradores e Voluntários.
 */
export function obterDestinatariosPermitidos(
  tipoUsuario: PapelUsuario,
  usuarioEmailAtual: string = "",
): ContatoDestino[] {
  const solicitacoes = obterSolicitacoes();
  const contatos: ContatoDestino[] = [
    {
      id: "geral",
      nome: "📢 Canal Geral (Avisos de Todos)",
      email: "geral@saudecampinas.org",
      tipo: "grupo",
      descricao: "Grupo aberto para toda a ONG (Administração, Colaboradores e Voluntários)",
    },
  ];

  const emailNormAtual = usuarioEmailAtual.toLowerCase().trim();

  // Se não for admin, adiciona a Coordenação Geral
  if (tipoUsuario !== "admin") {
    contatos.push({
      id: "admin",
      nome: "Coordenação Geral (Administração)",
      email: "admin@saudecampinas.org",
      tipo: "admin",
      descricao: "Diretoria e coordenação executiva da ONG",
    });
  }

  // Colaboradores cadastrados
  const colaboradores = solicitacoes.filter(
    (s) =>
      s.tipo === "colaborador" &&
      s.status === "aceito" &&
      s.email.toLowerCase().trim() !== emailNormAtual,
  );

  // Adiciona o colaborador fixo caso não seja o próprio usuário
  if (emailNormAtual !== "carlos.colab@saudecampinas.org" && emailNormAtual !== "func@gmail.com") {
    contatos.push({
      id: "carlos_colab",
      nome: "Carlos Eduardo (Colaborador)",
      email: "carlos.colab@saudecampinas.org",
      tipo: "colaborador",
      descricao: "Logística e coordenação de rua",
    });
  }

  for (const c of colaboradores) {
    if (c.email.toLowerCase().trim() !== "carlos.colab@saudecampinas.org") {
      contatos.push({
        id: `colab_${c.id}`,
        nome: `${c.nome} (Colaborador)`,
        email: c.email,
        tipo: "colaborador",
        descricao: c.telefone || "Equipe de apoio",
      });
    }
  }

  // Voluntários: SÓ aparecem se o usuário autenticado for Colaborador ou Admin!
  // Voluntários NUNCA têm acesso a mandar mensagem direta para outros voluntários.
  if (tipoUsuario === "colaborador" || tipoUsuario === "admin") {
    const voluntarios = solicitacoes.filter(
      (s) =>
        s.tipo === "voluntario" &&
        s.status === "aceito" &&
        s.email.toLowerCase().trim() !== emailNormAtual,
    );

    for (const v of voluntarios) {
      contatos.push({
        id: `vol_${v.id}`,
        nome: `${v.nome} (Voluntário)`,
        email: v.email,
        tipo: "voluntario",
        descricao: v.telefone || "Voluntário cadastrado",
      });
    }
  }

  return contatos;
}

export function obterMensagensDoCanal(
  canalId: string,
  usuarioEmail: string,
): MensagemChat[] {
  const todas = obterMensagensChat();
  if (canalId === "geral") {
    return todas.filter((m) => m.canalId === "geral");
  }

  const emailNorm = usuarioEmail.toLowerCase().trim();
  return todas.filter((m) => {
    if (m.canalId === canalId) return true;
    if (
      (m.remetenteEmail.toLowerCase().trim() === emailNorm &&
        canalId.includes(m.destinatarioEmail.toLowerCase().trim())) ||
      (m.destinatarioEmail.toLowerCase().trim() === emailNorm &&
        canalId.includes(m.remetenteEmail.toLowerCase().trim()))
    ) {
      return true;
    }
    return false;
  });
}

export function enviarMensagemChat(dados: {
  remetenteNome: string;
  remetenteEmail: string;
  remetenteTipo: PapelUsuario;
  destinatario: ContatoDestino;
  texto: string;
}): MensagemChat {
  // Verificação estrita de segurança no envio
  if (dados.remetenteTipo === "voluntario" && dados.destinatario.tipo === "voluntario") {
    throw new Error("Segurança: Voluntários não têm permissão para enviar mensagens diretas para outros voluntários.");
  }

  const canalId =
    dados.destinatario.id === "geral"
      ? "geral"
      : gerarCanalDmId(dados.remetenteEmail, dados.destinatario.email);

  const novaMsg: MensagemChat = {
    id: Date.now(),
    canalId,
    remetenteNome: dados.remetenteNome.trim() || "Usuário",
    remetenteEmail: dados.remetenteEmail.trim() || "usuario@saudecampinas.org",
    remetenteTipo: dados.remetenteTipo,
    destinatarioNome: dados.destinatario.nome,
    destinatarioEmail: dados.destinatario.email,
    destinatarioTipo: dados.destinatario.tipo,
    texto: dados.texto.trim(),
    criadaEm: new Date().toISOString(),
  };

  const lista = obterMensagensChat();
  lista.push(novaMsg);
  salvarMensagensChat(lista);
  return novaMsg;
}
