// src/components/MuralBoard/MuralBoard.tsx
import { useState, useEffect, type FormEvent } from "react";
import { Crown, Handshake, Sprout, User, Trash2 } from "lucide-react";
import {
  obterPostagensMural,
  publicarNoMural,
  removerPostagemMural,
  type PostagemMural,
  type TipoUsuario,
} from "../../services/muralService";

interface MuralBoardProps {
  tipoUsuario: TipoUsuario;
  usuarioNome?: string;
  usuarioEmail?: string;
}

export function MuralBoard({
  tipoUsuario,
  usuarioNome = "Membro da ONG",
  usuarioEmail = "",
}: MuralBoardProps) {
  const [postagens, setPostagens] = useState<PostagemMural[]>([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    setPostagens(obterPostagensMural());

    function atualizarMuralAoVivo() {
      setPostagens(obterPostagensMural());
    }

    window.addEventListener("ong_mural_atualizado", atualizarMuralAoVivo);
    return () => {
      window.removeEventListener("ong_mural_atualizado", atualizarMuralAoVivo);
    };
  }, []);

  function handlePublicar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!texto.trim()) return;

    const atualizadas = publicarNoMural({
      autorNome: usuarioNome,
      autorEmail: usuarioEmail,
      autorTipo: tipoUsuario,
      texto: texto.trim(),
    });

    setPostagens(atualizadas);
    setTexto("");
  }

  function handleRemover(id: number) {
    const atualizadas = removerPostagemMural(id);
    setPostagens(atualizadas);
  }

  function formatarDataHora(isoString: string) {
    try {
      const data = new Date(isoString);
      return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  }

  function getBadgeConfig(tipo: TipoUsuario) {
    switch (tipo) {
      case "admin":
        return {
          label: "Admin",
          Icon: Crown,
          className: "bg-black text-parchment",
        };
      case "colaborador":
        return {
          label: "Colaborador",
          Icon: Handshake,
          className: "bg-amber/15 text-amber",
        };
      case "voluntario":
      default:
        return {
          label: "Voluntário",
          Icon: Sprout,
          className: "bg-volunteer-soft text-volunteer",
        };
    }
  }

  const userBadge = getBadgeConfig(tipoUsuario);
  const UserBadgeIcon = userBadge.Icon;

  return (
    <section
      aria-labelledby="mural-comunitario-titulo"
      className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="m-0 font-body text-xs font-bold uppercase tracking-wide text-gold">
            Comunidade & Relatos
          </p>
          <h2
            id="mural-comunitario-titulo"
            className="m-0 font-display text-[1.1rem] font-semibold text-black"
          >
            Mural da Equipe
          </h2>
        </div>
        <span className="rounded-pill border border-gold bg-gold/10 px-3 py-1 font-body text-xs font-bold text-gold">
          {postagens.length}{" "}
          {postagens.length === 1 ? "publicação" : "publicações"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-md bg-parchment/50 px-4 py-3">
        <span className="font-body text-xs text-ink-soft">
          Publicando como:
        </span>
        <strong className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-black">
          <User size={14} />
          {usuarioNome}
        </strong>
        <span
          className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 font-body text-[11px] font-bold ${userBadge.className}`}
        >
          <UserBadgeIcon size={12} />
          {userBadge.label}
        </span>
      </div>

      <form onSubmit={handlePublicar} className="flex flex-col gap-3">
        <textarea
          aria-label="Mensagem para o mural"
          placeholder="Compartilhe um aviso, relato de atendimento ou experiência com a equipe..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
          rows={3}
          className="w-full resize-none rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!texto.trim()}
            className="inline-flex items-center rounded-pill bg-black px-5 py-3 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Publicar no mural
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {postagens.length === 0 ? (
          <p className="m-0 rounded-md border border-dashed border-black/15 px-4 py-6 text-center font-body text-sm text-ink-soft">
            Nenhuma publicação no mural ainda. Seja o primeiro a compartilhar!
          </p>
        ) : (
          postagens.map((post) => {
            const badge = getBadgeConfig(post.autorTipo);
            const BadgeIcon = badge.Icon;
            const podeExcluir =
              tipoUsuario === "admin" ||
              (usuarioEmail &&
                post.autorEmail &&
                post.autorEmail.toLowerCase().trim() ===
                  usuarioEmail.toLowerCase().trim()) ||
              post.autorNome.toLowerCase().trim() ===
                usuarioNome.toLowerCase().trim();

            return (
              <article
                key={post.id}
                className="flex flex-col gap-2 rounded-lg border border-black/10 p-4"
              >
                <header className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-black">
                      <User size={13} />
                      {post.autorNome}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 font-body text-[11px] font-bold ${badge.className}`}
                    >
                      <BadgeIcon size={12} />
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <time
                      dateTime={post.criadaEm}
                      className="font-body text-xs text-ink-soft"
                    >
                      {formatarDataHora(post.criadaEm)}
                    </time>
                    {podeExcluir && (
                      <button
                        type="button"
                        onClick={() => handleRemover(post.id)}
                        title="Remover publicação"
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-body text-[11px] font-bold text-error/70 transition-colors hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 size={12} />
                        Excluir
                      </button>
                    )}
                  </div>
                </header>
                <p className="m-0 font-body text-sm leading-relaxed text-black">
                  {post.texto}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}