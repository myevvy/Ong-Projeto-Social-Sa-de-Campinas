// src/services/eventService.ts
export type CategoriaEvento = "Mutirão" | "Campanha" | "Capacitação" | string;

export interface VoluntarioInscrito {
  id: string | number;
  nome: string;
  email: string;
  telefone?: string;
  sobre?: string;
  dataInscricao: string;
}

export interface EventoGlobal {
  id: number;
  titulo: string;
  data: string; // ISO format "YYYY-MM-DD"
  comentarios?: string;
  description?: string;
  local?: string;
  category?: CategoriaEvento;
  vagas?: number;
  voluntariosInscritos?: number;
  inscritosDetalhes?: VoluntarioInscrito[];
  photoUrl?: string;
  photoAlt?: string;
}

const STORAGE_KEY_EVENTOS = "ong_eventos_compartilhados";
const STORAGE_KEY_INSCRICOES = "ong_inscricoes_voluntarios";

const NOMES_MOCK_FICTICIOS = [
  "mariana souza",
  "carlos eduardo lima",
  "rafael nogueira",
  "ana paula mendes",
  "beatriz silveira",
  "juliana castro",
];

function ehInscritoFicticio(voluntario: VoluntarioInscrito): boolean {
  if (!voluntario) return true;
  const idStr = String(voluntario.id || "").toLowerCase();
  if (idStr.startsWith("mock-")) return true;
  const nomeNorm = String(voluntario.nome || "")
    .toLowerCase()
    .trim();
  if (NOMES_MOCK_FICTICIOS.includes(nomeNorm)) return true;
  const emailNorm = String(voluntario.email || "")
    .toLowerCase()
    .trim();
  if (
    emailNorm.includes("mariana.souza") ||
    emailNorm.includes("carlos.lima") ||
    emailNorm.includes("rafael.nogueira") ||
    emailNorm.includes("ana.mendes") ||
    emailNorm.includes("beatriz.silveira") ||
    emailNorm.includes("juliana.castro")
  ) {
    return true;
  }
  return false;
}

export const EVENTOS_INICIAIS: EventoGlobal[] = [
  {
    id: 1,
    titulo: "Atendimento de rua e triagem",
    data: "2026-09-14",
    local: "Vila Industrial, Campinas",
    category: "Mutirão",
    vagas: 6,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
    comentarios:
      "Levar kits de higiene e conferir os lotes de medicamentos recebidos.",
    description:
      "Atendimento de saúde itinerante para pessoas em situação de rua, com kits de higiene e escuta acolhedora.",
    photoAlt: "Voluntária atendendo uma pessoa em situação de rua",
  },
  {
    id: 2,
    titulo: "Coleta e organização de medicamentos",
    data: "2026-09-21",
    local: "Centro de Campinas",
    category: "Campanha",
    vagas: 4,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
    comentarios: "Confirmar transporte com a equipe até sexta-feira.",
    description:
      "Recolhemos remédios e amostras grátis parados no armário para reforçar o estoque das próximas ações.",
    photoAlt: "Voluntários organizando doações de medicamentos",
  },
  {
    id: 3,
    titulo: "Mutirão no Centro da Cidade",
    data: "2026-09-28",
    local: "Centro, Campinas",
    category: "Mutirão",
    vagas: 8,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
    comentarios:
      "Segunda rodada do mês, com apoio de novos voluntários da capacitação.",
    description:
      "Atendimento médico e triagem básica para famílias em vulnerabilidade social.",
    photoAlt: "Atendimento de rua no centro da cidade",
  },
  {
    id: 4,
    titulo: "Roda de capacitação para novos voluntários",
    data: "2026-10-05",
    local: "Sede parceira - Campinas",
    category: "Capacitação",
    vagas: 12,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
    comentarios:
      "Encontro para quem está começando: rotina das ações e primeiros socorros.",
    description:
      "Encontro para quem está começando: rotina das ações, uso do estoque colaborativo e primeiros passos.",
    photoAlt: "Roda de conversa com novos voluntários",
  },
  {
    id: 5,
    titulo: "Campanha de Arrecadação de Agasalhos e Alimentos",
    data: "2026-10-19",
    local: "Toda a cidade - Ponto Central",
    category: "Campanha",
    vagas: 10,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
    comentarios: "Recepção e triagem das doações para montagem dos kits.",
    description:
      "Início da campanha com arrecadação de agasalhos, cobertores e alimentos não perecíveis.",
    photoAlt: "Caixas de doação e alimentos",
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function obterHeaderAuth(): Record<string, string> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function formatarDataIso(dataRaw: unknown): string {
  if (!dataRaw) return new Date().toISOString().split("T")[0];
  if (typeof dataRaw === "string") {
    return dataRaw.split("T")[0];
  }
  try {
    const d = new Date(dataRaw as string | number | Date);
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

interface EventoMysqlRaw {
  ID_evento?: number | string;
  id_evento?: number | string;
  id?: number | string;
  nome_evento?: string;
  nome?: string;
  titulo?: string;
  data_evento?: string;
  data?: string;
  localizacao?: string;
  local?: string;
  desc_evento?: string;
  desc?: string;
  comentarios?: string;
  description?: string;
  category?: CategoriaEvento;
  vagas?: number;
  photoUrl?: string;
  photoAlt?: string;
}

export function mapearEventoDoBanco(
  item: EventoMysqlRaw,
  eventosLocaisCache: EventoGlobal[] = [],
): EventoGlobal {
  const idNum = Number(
    item.ID_evento ?? item.id_evento ?? item.id ?? Date.now(),
  );
  const dataFormatada = formatarDataIso(item.data_evento ?? item.data);
  const cacheExistente = eventosLocaisCache.find((e) => e.id === idNum);
  const inscritosLimpos = (cacheExistente?.inscritosDetalhes || []).filter(
    (i) => !ehInscritoFicticio(i),
  );

  return {
    id: idNum,
    titulo: item.nome_evento || item.nome || item.titulo || "Evento sem título",
    data: dataFormatada,
    local: item.localizacao || item.local || "Campinas e Região",
    comentarios:
      item.desc_evento ||
      item.desc ||
      item.comentarios ||
      item.description ||
      "",
    description:
      item.desc_evento ||
      item.desc ||
      item.description ||
      item.comentarios ||
      "",
    category: cacheExistente?.category || item.category || "Mutirão",
    vagas: cacheExistente?.vagas || item.vagas || 6,
    voluntariosInscritos: inscritosLimpos.length,
    inscritosDetalhes: inscritosLimpos,
    photoUrl: cacheExistente?.photoUrl || item.photoUrl,
    photoAlt: cacheExistente?.photoAlt || item.photoAlt,
  };
}

export function obterEventos(): EventoGlobal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTOS);
    if (!raw) {
      salvarEventos(EVENTOS_INICIAIS);
      return EVENTOS_INICIAIS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const eventosLimpos = parsed.map((e) => {
        const detalhesReais = (
          Array.isArray(e.inscritosDetalhes) ? e.inscritosDetalhes : []
        ).filter((i: VoluntarioInscrito) => !ehInscritoFicticio(i));
        return {
          ...e,
          inscritosDetalhes: detalhesReais,
          voluntariosInscritos: detalhesReais.length,
        };
      });

      // Salva imediatamente para purgar dados fictícios que estavam no navegador do usuário
      localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(eventosLimpos));
      return eventosLimpos;
    }
    salvarEventos(EVENTOS_INICIAIS);
    return EVENTOS_INICIAIS;
  } catch {
    return EVENTOS_INICIAIS;
  }
}

export async function buscarEventosApi(): Promise<EventoGlobal[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/eventos`, {
      method: "GET",
    });

    if (!res.ok) {
      return obterEventos();
    }

    const dados = await res.json();
    if (Array.isArray(dados) && dados.length > 0) {
      const cacheLocal = obterEventos();
      const eventosMapeados = dados.map((item: EventoMysqlRaw) =>
        mapearEventoDoBanco(item, cacheLocal),
      );
      salvarEventos(eventosMapeados);
      return eventosMapeados;
    }

    return obterEventos();
  } catch (error) {
    console.warn(
      "API de eventos offline/indisponível, usando cache local:",
      error,
    );
    return obterEventos();
  }
}

export function salvarEventos(lista: EventoGlobal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent("ong_eventos_atualizados"));
  } catch (error) {
    console.error("Erro ao salvar eventos:", error);
  }
}

export async function criarEventoApi(novo: {
  titulo: string;
  data: string;
  comentarios?: string;
  local?: string;
  category?: string;
  vagas?: number;
}): Promise<EventoGlobal[]> {
  let novoId = Date.now();

  try {
    const res = await fetch(`${API_BASE_URL}/eventos`, {
      method: "POST",
      headers: obterHeaderAuth(),
      body: JSON.stringify({
        nome: novo.titulo.trim(),
        data: novo.data,
        localizacao: novo.local?.trim() || "Campinas e Região",
        desc: novo.comentarios?.trim() || "",
      }),
    });

    const respostaJson = await res.json().catch(() => ({}));
    if (respostaJson.idEvento) {
      novoId = Number(respostaJson.idEvento);
    }
  } catch (error) {
    console.warn(
      "Não foi possível salvar evento no backend, salvando localmente:",
      error,
    );
  }

  const lista = obterEventos();
  const novoEvento: EventoGlobal = {
    id: novoId,
    titulo: novo.titulo.trim(),
    data: novo.data,
    comentarios: novo.comentarios?.trim() || "",
    description:
      novo.comentarios?.trim() ||
      "Ação social organizada pelo Projeto Saúde Campinas.",
    local: novo.local?.trim() || "Campinas e Região",
    category: (novo.category as CategoriaEvento) || "Mutirão",
    vagas: Number(novo.vagas) || 6,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
  };

  lista.unshift(novoEvento);
  salvarEventos(lista);
  return lista;
}

export function adicionarEvento(novo: {
  titulo: string;
  data: string;
  comentarios?: string;
  local?: string;
  category?: string;
  vagas?: number;
}): EventoGlobal[] {
  // Sincroniza em background com o backend caso chamado diretamente
  criarEventoApi(novo).catch(() => {});

  const lista = obterEventos();
  const novoEvento: EventoGlobal = {
    id: Date.now(),
    titulo: novo.titulo.trim(),
    data: novo.data,
    comentarios: novo.comentarios?.trim() || "",
    description:
      novo.comentarios?.trim() ||
      "Ação social organizada pelo Projeto Saúde Campinas.",
    local: novo.local?.trim() || "Campinas e Região",
    category: (novo.category as CategoriaEvento) || "Mutirão",
    vagas: Number(novo.vagas) || 6,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
  };

  lista.unshift(novoEvento);
  salvarEventos(lista);
  return lista;
}

export async function atualizarEventoApi(
  id: number,
  dados: Partial<EventoGlobal>,
): Promise<EventoGlobal[]> {
  try {
    await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "PUT",
      headers: obterHeaderAuth(),
      body: JSON.stringify({
        nome: dados.titulo?.trim(),
        data: dados.data,
        localizacao: dados.local?.trim(),
        desc: dados.comentarios?.trim() || dados.description?.trim(),
        status: true,
      }),
    });
  } catch (error) {
    console.warn(
      "Não foi possível atualizar no backend, atualizando localmente:",
      error,
    );
  }

  return atualizarEvento(id, dados);
}

export function atualizarEvento(
  id: number,
  dados: Partial<EventoGlobal>,
): EventoGlobal[] {
  const lista = obterEventos().map((evento) => {
    if (evento.id === id) {
      return {
        ...evento,
        ...dados,
        titulo: dados.titulo ? dados.titulo.trim() : evento.titulo,
        comentarios:
          dados.comentarios !== undefined
            ? dados.comentarios.trim()
            : evento.comentarios,
        description:
          dados.comentarios !== undefined
            ? dados.comentarios.trim()
            : dados.description || evento.description,
        local: dados.local ? dados.local.trim() : evento.local,
      };
    }
    return evento;
  });

  salvarEventos(lista);
  return lista;
}

export async function removerEventoApi(id: number): Promise<EventoGlobal[]> {
  try {
    await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "DELETE",
      headers: obterHeaderAuth(),
    });
  } catch (error) {
    console.warn(
      "Não foi possível desativar no backend, removendo localmente:",
      error,
    );
  }

  return removerEvento(id);
}

export function removerEvento(id: number): EventoGlobal[] {
  const lista = obterEventos().filter((evento) => evento.id !== id);
  salvarEventos(lista);
  return lista;
}

export function obterInscricoesVoluntario(
  usuarioIdentificador?: string | number,
): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INSCRICOES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const idStr = String(usuarioIdentificador || "default_voluntario")
      .toLowerCase()
      .trim();
    return Array.isArray(parsed[idStr]) ? parsed[idStr] : [];
  } catch {
    return [];
  }
}

export function alternarInscricaoVoluntario(
  eventoId: number,
  dadosVoluntario?: {
    id?: string | number;
    nome?: string;
    email?: string;
    telefone?: string;
    sobre?: string;
  },
): { inscritos: number[]; estaInscrito: boolean } {
  try {
    const idIdentificador = String(
      dadosVoluntario?.email ||
        dadosVoluntario?.id ||
        dadosVoluntario?.nome ||
        "default_voluntario",
    )
      .toLowerCase()
      .trim();

    const raw = localStorage.getItem(STORAGE_KEY_INSCRICOES);
    const todasInscricoes = raw ? JSON.parse(raw) : {};
    let usuarioInscricoes: number[] = Array.isArray(
      todasInscricoes[idIdentificador],
    )
      ? todasInscricoes[idIdentificador]
      : [];

    let estaInscrito = false;
    if (usuarioInscricoes.includes(eventoId)) {
      usuarioInscricoes = usuarioInscricoes.filter((id) => id !== eventoId);
      estaInscrito = false;
    } else {
      usuarioInscricoes.push(eventoId);
      estaInscrito = true;
    }

    todasInscricoes[idIdentificador] = usuarioInscricoes;
    localStorage.setItem(
      STORAGE_KEY_INSCRICOES,
      JSON.stringify(todasInscricoes),
    );

    const emailNorm = (dadosVoluntario?.email || "").toLowerCase().trim();
    const nomeVol = dadosVoluntario?.nome || "Voluntário(a)";

    // Atualiza a lista de inscritos detalhada dentro do próprio evento
    const eventos = obterEventos().map((ev) => {
      if (ev.id === eventoId) {
        let detalhes = Array.isArray(ev.inscritosDetalhes)
          ? [...ev.inscritosDetalhes]
          : [];
        if (estaInscrito) {
          const jaExiste = detalhes.some(
            (d) =>
              (emailNorm && d.email.toLowerCase().trim() === emailNorm) ||
              d.nome.toLowerCase().trim() === nomeVol.toLowerCase().trim(),
          );
          if (!jaExiste) {
            detalhes.push({
              id: dadosVoluntario?.id || Date.now(),
              nome: nomeVol,
              email: dadosVoluntario?.email || "voluntario@saudecampinas.org",
              telefone: dadosVoluntario?.telefone || "(19) 99124-3012",
              sobre:
                dadosVoluntario?.sobre ||
                "Inscrição realizada pelo painel do voluntário.",
              dataInscricao: new Date().toISOString().split("T")[0],
            });
          }
        } else {
          detalhes = detalhes.filter(
            (d) =>
              emailNorm &&
              d.email.toLowerCase().trim() !== emailNorm &&
              d.nome.toLowerCase().trim() !== nomeVol.toLowerCase().trim(),
          );
        }

        return {
          ...ev,
          inscritosDetalhes: detalhes,
          voluntariosInscritos: detalhes.length,
        };
      }
      return ev;
    });

    salvarEventos(eventos);
    return { inscritos: usuarioInscricoes, estaInscrito };
  } catch (err) {
    console.error("Erro ao alternar inscrição:", err);
    return { inscritos: [], estaInscrito: false };
  }
}

export function removerVoluntarioDeEvento(
  eventoId: number,
  voluntarioEmailOuNome: string,
): EventoGlobal[] {
  const norm = voluntarioEmailOuNome.toLowerCase().trim();
  const eventos = obterEventos().map((ev) => {
    if (ev.id === eventoId) {
      const detalhes = (ev.inscritosDetalhes || []).filter(
        (v) =>
          v.email.toLowerCase().trim() !== norm &&
          v.nome.toLowerCase().trim() !== norm,
      );
      return {
        ...ev,
        inscritosDetalhes: detalhes,
        voluntariosInscritos: detalhes.length,
      };
    }
    return ev;
  });

  salvarEventos(eventos);
  return eventos;
}
