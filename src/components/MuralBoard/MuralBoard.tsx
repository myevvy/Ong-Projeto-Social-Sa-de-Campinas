// src/components/MuralBoard/MuralBoard.tsx
import { useState, useEffect, type FormEvent } from "react";
import {
  obterPostagensMural,
  publicarNoMural,
  removerPostagemMural,
  type PostagemMural,
  type TipoUsuario,
} from "../../services/muralService";
import "./MuralBoard.css";

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
          icon: "👑",
          className: "mural-card__badge--admin",
        };
      case "colaborador":
        return {
          label: "Colaborador",
          icon: "🤝",
          className: "mural-card__badge--colaborador",
        };
      case "voluntario":
      default:
        return {
          label: "Voluntário",
          icon: "🌱",
          className: "mural-card__badge--voluntario",
        };
    }
  }

  const userBadge = getBadgeConfig(tipoUsuario);

  return (
    <section className="mural-board" aria-labelledby="mural-comunitario-titulo">
      <div className="mural-board__heading">
        <div>
          <p className="mural-board__kicker">Comunidade & Relatos</p>
          <h2 id="mural-comunitario-titulo" className="mural-board__title">
            Mural da Equipe
          </h2>
        </div>
        <span className="mural-board__count">
          {postagens.length}{" "}
          {postagens.length === 1 ? "publicação" : "publicações"}
        </span>
      </div>

      <div className="mural-board__author-preview">
        <span>Publicando como:</span>
        <strong>👤 {usuarioNome}</strong>
        <span className={`mural-card__badge ${userBadge.className}`}>
          {userBadge.icon} {userBadge.label}
        </span>
      </div>

      <form className="mural-board__form" onSubmit={handlePublicar}>
        <textarea
          className="mural-board__textarea"
          aria-label="Mensagem para o mural"
          placeholder="Compartilhe um aviso, relato de atendimento ou experiência com a equipe..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
        />
        <div className="mural-board__form-footer">
          <button
            type="submit"
            className="mural-board__submit-btn"
            disabled={!texto.trim()}
          >
            Publicar no mural
          </button>
        </div>
      </form>

      <div className="mural-board__posts">
        {postagens.length === 0 ? (
          <div className="mural-board__empty">
            Nenhuma publicação no mural ainda. Seja o primeiro a compartilhar!
          </div>
        ) : (
          postagens.map((post) => {
            const badge = getBadgeConfig(post.autorTipo);
            const podeExcluir =
              tipoUsuario === "admin" ||
              (usuarioEmail &&
                post.autorEmail &&
                post.autorEmail.toLowerCase().trim() ===
                  usuarioEmail.toLowerCase().trim()) ||
              post.autorNome.toLowerCase().trim() ===
                usuarioNome.toLowerCase().trim();

            return (
              <article className="mural-card" key={post.id}>
                <header className="mural-card__header">
                  <div className="mural-card__author">
                    <span>👤 {post.autorNome}</span>
                    <span className={`mural-card__badge ${badge.className}`}>
                      {badge.icon} {badge.label}
                    </span>
                  </div>
                  <div className="mural-card__meta">
                    <time className="mural-card__time" dateTime={post.criadaEm}>
                      {formatarDataHora(post.criadaEm)}
                    </time>
                    {podeExcluir && (
                      <button
                        type="button"
                        className="mural-card__delete-btn"
                        onClick={() => handleRemover(post.id)}
                        title="Remover publicação"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </header>
                <p className="mural-card__text">{post.texto}</p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
