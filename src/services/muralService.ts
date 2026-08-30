// src/services/muralService.ts

export type TipoUsuario = "voluntario" | "colaborador" | "admin";

export interface PostagemMural {
  id: number;
  autorNome: string;
  autorEmail?: string;
  autorTipo: TipoUsuario;
  texto: string;
  criadaEm: string; // ISO date
}

const STORAGE_KEY_MURAL = "ong_mural_comunidade";

export const POSTAGENS_INICIAIS: PostagemMural[] = [
  {
    id: 1,
    autorNome: "Coordenação Geral",
    autorEmail: "admin@saudecampinas.org",
    autorTipo: "admin",
    texto: "Bem-vindos ao mural comunitário do Projeto Social Saúde Campinas! Este espaço é aberto para recados, alinhamentos e depoimentos sobre nossas ações nas ruas.",
    criadaEm: "2026-08-27T10:00:00.000Z",
  },
  {
    id: 2,
    autorNome: "Carlos Eduardo Lima",
    autorEmail: "carlos.colab@saudecampinas.org",
    autorTipo: "colaborador",
    texto: "Atenção equipe: a organização dos kits de higiene e aferição para o próximo mutirão na Vila Industrial está pronta. Quem tiver dúvidas, me mande mensagem!",
    criadaEm: "2026-08-28T14:30:00.000Z",
  },
  {
    id: 3,
    autorNome: "Mariana Souza",
    autorEmail: "mariana.vol@gmail.com",
    autorTipo: "voluntario",
    texto: "O acolhimento da última ação foi muito especial! Muito bom ver a união de toda a equipe no atendimento às famílias.",
    criadaEm: "2026-08-29T18:15:00.000Z",
  },
];

export function obterPostagensMural(): PostagemMural[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MURAL);
    if (!raw) {
      salvarPostagensMural(POSTAGENS_INICIAIS);
      return POSTAGENS_INICIAIS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    salvarPostagensMural(POSTAGENS_INICIAIS);
    return POSTAGENS_INICIAIS;
  } catch {
    return POSTAGENS_INICIAIS;
  }
}

export function salvarPostagensMural(lista: PostagemMural[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MURAL, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent("ong_mural_atualizado"));
  } catch (error) {
    console.error("Erro ao salvar mural:", error);
  }
}

export function publicarNoMural(novo: {
  autorNome: string;
  autorEmail?: string;
  autorTipo: TipoUsuario;
  texto: string;
}): PostagemMural[] {
  const lista = obterPostagensMural();
  const novaPostagem: PostagemMural = {
    id: Date.now(),
    autorNome: novo.autorNome.trim() || "Membro da ONG",
    autorEmail: novo.autorEmail?.trim() || "",
    autorTipo: novo.autorTipo,
    texto: novo.texto.trim(),
    criadaEm: new Date().toISOString(),
  };

  lista.unshift(novaPostagem);
  salvarPostagensMural(lista);
  return lista;
}

export function removerPostagemMural(id: number): PostagemMural[] {
  const lista = obterPostagensMural().filter((p) => p.id !== id);
  salvarPostagensMural(lista);
  return lista;
}
