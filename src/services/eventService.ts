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

export const EVENTOS_INICIAIS: EventoGlobal[] = [
  {
    id: 1,
    titulo: "Atendimento de rua e triagem",
    data: "2026-09-14",
    local: "Vila Industrial, Campinas",
    category: "Mutirão",
    vagas: 6,
    voluntariosInscritos: 3,
    inscritosDetalhes: [
      {
        id: 3,
        nome: "user+18",
        email: "use18r@gmail.com",
        telefone: "(19) 99124-3012",
        sobre: "Estudante de enfermagem, disponível para triagem e acolhimento.",
        dataInscricao: "2026-08-28",
      },
      {
        id: "mock-1",
        nome: "Mariana Souza",
        email: "mariana.souza@gmail.com",
        telefone: "(19) 99221-8833",
        sobre: "Estudante de medicina na Unicamp. Atuação em primeiros socorros.",
        dataInscricao: "2026-08-29",
      },
      {
        id: "mock-2",
        nome: "Carlos Eduardo Lima",
        email: "carlos.lima@gmail.com",
        telefone: "(19) 99876-1122",
        sobre: "Apoio logístico e entrega de kits de higiene.",
        dataInscricao: "2026-08-29",
      },
    ],
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
    voluntariosInscritos: 2,
    inscritosDetalhes: [
      {
        id: "mock-3",
        nome: "Rafael Nogueira",
        email: "rafael.nogueira@gmail.com",
        telefone: "(19) 99771-2244",
        sobre: "Organização de estoque, conferência de validades e lotes.",
        dataInscricao: "2026-08-27",
      },
      {
        id: "mock-4",
        nome: "Ana Paula Mendes",
        email: "ana.mendes@gmail.com",
        telefone: "(19) 99123-4567",
        sobre: "Recepção e triagem das doações.",
        dataInscricao: "2026-08-28",
      },
    ],
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
    voluntariosInscritos: 1,
    inscritosDetalhes: [
      {
        id: "mock-5",
        nome: "Beatriz Silveira",
        email: "beatriz.silveira@gmail.com",
        telefone: "(19) 99333-4455",
        sobre: "Disponível no período da manhã para atendimento humanizado.",
        dataInscricao: "2026-08-29",
      },
    ],
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
    voluntariosInscritos: 2,
    inscritosDetalhes: [
      {
        id: 3,
        nome: "user+18",
        email: "use18r@gmail.com",
        telefone: "(19) 99124-3012",
        sobre: "Interesse em conhecer a rotina dos atendimentos.",
        dataInscricao: "2026-08-29",
      },
      {
        id: "mock-6",
        nome: "Juliana Castro",
        email: "juliana.castro@gmail.com",
        telefone: "(19) 99444-5566",
        sobre: "Estudante de Farmácia, 3º ano.",
        dataInscricao: "2026-08-30",
      },
    ],
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

export function obterEventos(): EventoGlobal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTOS);
    if (!raw) {
      salvarEventos(EVENTOS_INICIAIS);
      return EVENTOS_INICIAIS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((e) => ({
        ...e,
        inscritosDetalhes: Array.isArray(e.inscritosDetalhes) ? e.inscritosDetalhes : [],
        voluntariosInscritos: Array.isArray(e.inscritosDetalhes)
          ? e.inscritosDetalhes.length
          : e.voluntariosInscritos || 0,
      }));
    }
    salvarEventos(EVENTOS_INICIAIS);
    return EVENTOS_INICIAIS;
  } catch {
    return EVENTOS_INICIAIS;
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

export function adicionarEvento(novo: {
  titulo: string;
  data: string;
  comentarios?: string;
  local?: string;
  category?: string;
  vagas?: number;
}): EventoGlobal[] {
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
    category: novo.category || "Mutirão",
    vagas: Number(novo.vagas) || 6,
    voluntariosInscritos: 0,
    inscritosDetalhes: [],
  };

  lista.unshift(novoEvento);
  salvarEventos(lista);
  return lista;
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
    const idStr = String(usuarioIdentificador || "default_voluntario").toLowerCase().trim();
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
      dadosVoluntario?.email || dadosVoluntario?.id || dadosVoluntario?.nome || "default_voluntario",
    ).toLowerCase().trim();

    const raw = localStorage.getItem(STORAGE_KEY_INSCRICOES);
    const todasInscricoes = raw ? JSON.parse(raw) : {};
    let usuarioInscricoes: number[] = Array.isArray(todasInscricoes[idIdentificador])
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
        let detalhes = Array.isArray(ev.inscritosDetalhes) ? [...ev.inscritosDetalhes] : [];
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
              sobre: dadosVoluntario?.sobre || "Inscrição realizada pelo painel do voluntário.",
              dataInscricao: new Date().toISOString().split("T")[0],
            });
          }
        } else {
          detalhes = detalhes.filter(
            (d) =>
              (emailNorm && d.email.toLowerCase().trim() !== emailNorm) &&
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
