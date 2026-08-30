// src/components/MessageBox/MessageBox.tsx
import { useEffect, useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import {
  obterDestinatariosPermitidos,
  obterMensagensChat,
  enviarMensagemChat,
  gerarCanalDmId,
  type ContatoDestino,
  type MensagemChat,
  type PapelUsuario,
} from "../../services/messageService";
import "./MessageBox.css";

interface MessageBoxProps {
  author: PapelUsuario;
  usuarioNome?: string;
  usuarioEmail?: string;
}

export function MessageBox({
  author,
  usuarioNome = "Você",
  usuarioEmail,
}: MessageBoxProps) {
  const emailAtual =
    usuarioEmail ||
    (author === "admin"
      ? "admin@saudecampinas.org"
      : author === "colaborador"
      ? "carlos.colab@saudecampinas.org"
      : "voluntario@saudecampinas.org");

  const [destinatarios, setDestinatarios] = useState<ContatoDestino[]>([]);
  const [destinatarioSelecionadoId, setDestinatarioSelecionadoId] = useState<string>("geral");
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [texto, setTexto] = useState("");
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listaDest = obterDestinatariosPermitidos(author, emailAtual);
    setDestinatarios(listaDest);
    setMensagens(obterMensagensChat());

    function atualizarMensagensAoVivo() {
      setMensagens(obterMensagensChat());
      setDestinatarios(obterDestinatariosPermitidos(author, emailAtual));
    }
    window.addEventListener("ong_mensagens_atualizadas", atualizarMensagensAoVivo);
    return () => {
      window.removeEventListener("ong_mensagens_atualizadas", atualizarMensagensAoVivo);
    };
  }, [author, emailAtual]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, destinatarioSelecionadoId]);

  const destinatarioAtivo =
    destinatarios.find((d) => d.id === destinatarioSelecionadoId) ||
    destinatarios[0] || {
      id: "geral",
      nome: "📢 Canal Geral (Avisos de Todos)",
      email: "geral@saudecampinas.org",
      tipo: "grupo",
      descricao: "Comunidade da ONG (Administração, Colaboradores e Voluntários)",
    };

  // Filtra as mensagens para a conversa/canal ativo
  const mensagensFiltradas = mensagens.filter((m) => {
    if (destinatarioAtivo.id === "geral") {
      return m.canalId === "geral";
    }
    const canalEsperado = gerarCanalDmId(emailAtual, destinatarioAtivo.email);
    return (
      m.canalId === canalEsperado ||
      (m.remetenteEmail.toLowerCase().trim() === emailAtual.toLowerCase().trim() &&
        m.destinatarioEmail.toLowerCase().trim() === destinatarioAtivo.email.toLowerCase().trim()) ||
      (m.destinatarioEmail.toLowerCase().trim() === emailAtual.toLowerCase().trim() &&
        m.remetenteEmail.toLowerCase().trim() === destinatarioAtivo.email.toLowerCase().trim())
    );
  });

  function handleEnviar(event?: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();
    if (!texto.trim()) return;

    try {
      setErroEnvio(null);
      enviarMensagemChat({
        remetenteNome: usuarioNome,
        remetenteEmail: emailAtual,
        remetenteTipo: author,
        destinatario: destinatarioAtivo,
        texto: texto.trim(),
      });
      setTexto("");
    } catch (err) {
      if (err instanceof Error) {
        setErroEnvio(err.message);
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  }

  function getBadgeConfig(tipo: string) {
    if (tipo === "admin") return { label: "Admin", className: "message-box__badge--admin" };
    if (tipo === "colaborador") return { label: "Colaborador", className: "message-box__badge--colaborador" };
    if (tipo === "voluntario") return { label: "Voluntário", className: "message-box__badge--voluntario" };
    return { label: "Geral", className: "" };
  }

  return (
    <section className="message-box" aria-labelledby={`mensagens-titulo-${author}`}>
      <header className="message-box__heading">
        <div>
          <span className="message-box__kicker">Comunicação Interna</span>
          <h2 id={`mensagens-titulo-${author}`} className="message-box__title">
            Mensagens & Avisos
          </h2>
        </div>
        <span className="message-box__count">
          {mensagensFiltradas.length} {mensagensFiltradas.length === 1 ? "mensagem" : "mensagens"}
        </span>
      </header>

      {/* Seletor de Canal / Destinatário */}
      <div className="message-box__channel-bar">
        <label htmlFor={`destinatario-select-${author}`} className="message-box__channel-label">
          <span>Conversar com / Canal:</span>
          {author === "voluntario" && (
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#1a745a" }}>
              🔒 Acesso restrito a Colaboradores & Adm
            </span>
          )}
        </label>
        <div className="message-box__select-wrap">
          <select
            id={`destinatario-select-${author}`}
            className="message-box__select"
            value={destinatarioSelecionadoId}
            onChange={(e) => setDestinatarioSelecionadoId(e.target.value)}
          >
            {destinatarios.map((contato) => (
              <option key={contato.id} value={contato.id}>
                {contato.nome} {contato.descricao ? `— ${contato.descricao}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Barra de Status do Canal Ativo */}
      <div className="message-box__active-channel-info">
        <div className="message-box__active-target">
          <span className="message-box__active-name">
            {destinatarioAtivo.nome}
          </span>
          {destinatarioAtivo.descricao && (
            <span className="message-box__active-desc">
              ({destinatarioAtivo.descricao})
            </span>
          )}
        </div>
        {destinatarioAtivo.id === "geral" ? (
          <span className="message-box__security-notice">
            📢 Grupo com todos os usuários para avisos
          </span>
        ) : (
          <span className="message-box__security-notice">
            💬 Conversa privada direta
          </span>
        )}
      </div>

      {/* Thread de Mensagens */}
      <div className="message-box__thread">
        {mensagensFiltradas.length === 0 ? (
          <div className="message-box__empty">
            <span className="message-box__empty-icon">💬</span>
            <p className="message-box__empty-title">Nenhuma mensagem nesta conversa ainda.</p>
            <p className="message-box__empty-desc">
              {destinatarioAtivo.id === "geral"
                ? "Envie um aviso para toda a equipe da ONG usando o campo abaixo."
                : `Inicie uma conversa direta com ${destinatarioAtivo.nome}.`}
            </p>
          </div>
        ) : (
          mensagensFiltradas.map((msg) => {
            const ehMinha =
              msg.remetenteEmail.toLowerCase().trim() === emailAtual.toLowerCase().trim() ||
              (author === "voluntario" && msg.remetenteTipo === "voluntario" && msg.remetenteNome === usuarioNome);
            const badge = getBadgeConfig(msg.remetenteTipo);

            return (
              <article
                key={msg.id}
                className={`message-box__bubble ${
                  ehMinha ? "message-box__bubble--mine" : "message-box__bubble--theirs"
                }`}
              >
                <div className="message-box__bubble-meta">
                  <span className="message-box__sender">
                    👤 {ehMinha ? "Você" : msg.remetenteNome}{" "}
                    <span className={`message-box__badge ${badge.className}`}>
                      {badge.label}
                    </span>
                  </span>
                  <time className="message-box__time" dateTime={msg.criadaEm}>
                    {new Date(msg.criadaEm).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p className="message-box__text">{msg.texto}</p>
              </article>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {erroEnvio && (
        <div style={{ padding: "8px 20px", background: "#fde8e8", color: "#b91c1c", fontSize: "12px", fontWeight: 600 }}>
          ⚠️ {erroEnvio}
        </div>
      )}

      {/* Formulário de Envio */}
      <form className="message-box__form" onSubmit={handleEnviar}>
        <div className="message-box__input-row">
          <textarea
            id={`mensagem-input-${author}`}
            className="message-box__textarea"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              destinatarioAtivo.id === "geral"
                ? "Escreva um aviso geral para toda a ONG (Pressione Enter para enviar)..."
                : `Escreva uma mensagem para ${destinatarioAtivo.nome}...`
            }
            rows={2}
            required
          />
          <button
            type="submit"
            className="message-box__send-btn"
            disabled={!texto.trim()}
          >
            <span>Enviar</span> ✈️
          </button>
        </div>
        <p className="message-box__input-hint">
          Dica: Pressione <strong>Enter</strong> para enviar ou <strong>Shift + Enter</strong> para quebra de linha.
        </p>
      </form>
    </section>
  );
}
