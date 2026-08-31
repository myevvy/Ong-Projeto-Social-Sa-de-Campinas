// src/components/MessageBox/MessageBox.tsx
import { useEffect, useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Send, Lock, Megaphone, MessageSquareText, User } from "lucide-react";
import {
  obterDestinatariosPermitidos,
  obterMensagensChat,
  enviarMensagemChat,
  gerarCanalDmId,
  type ContatoDestino,
  type MensagemChat,
  type PapelUsuario,
} from "../../services/messageService";

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
      nome: "Canal Geral (Avisos de Todos)",
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
    if (tipo === "admin")
      return { label: "Admin", className: "bg-black text-parchment" };
    if (tipo === "colaborador")
      return { label: "Colaborador", className: "bg-amber/15 text-amber" };
    if (tipo === "voluntario")
      return { label: "Voluntário", className: "bg-volunteer-soft text-volunteer" };
    return { label: "Geral", className: "bg-black/10 text-black/60" };
  }

  return (
    <section
      aria-labelledby={`mensagens-titulo-${author}`}
      className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="m-0 block font-body text-xs font-bold uppercase tracking-wide text-gold">
            Comunicação Interna
          </span>
          <h2
            id={`mensagens-titulo-${author}`}
            className="m-0 font-display text-[1.1rem] font-semibold text-black"
          >
            Mensagens & Avisos
          </h2>
        </div>
        <span className="rounded-pill border border-gold bg-gold/10 px-3 py-1 font-body text-xs  font-bold text-gold">
          {mensagensFiltradas.length}{" "}
          {mensagensFiltradas.length === 1 ? "mensagem" : "mensagens"}
        </span>
      </header>

      {/* Seletor de Canal / Destinatário */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`destinatario-select-${author}`}
          className="flex flex-wrap items-center justify-between gap-2 font-body text-[13px] font-bold text-black"
        >
          <span>Conversar com / Canal:</span>
          {author === "voluntario" && (
            <span className="inline-flex items-center gap-1 font-body text-[11px] font-semibold text-volunteer">
              <Lock size={12} />
              Acesso restrito a Colaboradores & Adm
            </span>
          )}
        </label>
        <select
          id={`destinatario-select-${author}`}
          value={destinatarioSelecionadoId}
          onChange={(e) => setDestinatarioSelecionadoId(e.target.value)}
          className="w-full rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
        >
          {destinatarios.map((contato) => (
            <option key={contato.id} value={contato.id}>
              {contato.nome} {contato.descricao ? `— ${contato.descricao}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Barra de Status do Canal Ativo */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-parchment/50 px-4 py-3">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="font-body text-sm font-bold text-black">
            {destinatarioAtivo.nome}
          </span>
          {destinatarioAtivo.descricao && (
            <span className="font-body text-xs text-ink-soft">
              ({destinatarioAtivo.descricao})
            </span>
          )}
        </div>
        {destinatarioAtivo.id === "geral" ? (
          <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-ink-soft">
            <Megaphone size={13} />
            Grupo com todos os usuários para avisos
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-ink-soft">
            <MessageSquareText size={13} />
            Conversa privada direta
          </span>
        )}
      </div>

      {/* Thread de Mensagens */}
      <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto rounded-md border border-black/10 p-4">
        {mensagensFiltradas.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-10 text-center">
            <MessageSquareText size={28} className="text-black/25" />
            <p className="m-0 font-body text-sm font-bold text-black">
              Nenhuma mensagem nesta conversa ainda.
            </p>
            <p className="m-0 max-w-xs font-body text-xs text-ink-soft">
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
                className={`flex max-w-[85%] flex-col gap-1 rounded-lg px-4 py-3 ${
                  ehMinha
                    ? "ml-auto bg-black text-parchment"
                    : "mr-auto border border-black/10 bg-white text-black"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 font-body text-xs font-bold ${
                      ehMinha ? "text-parchment/80" : "text-black"
                    }`}
                  >
                    <User size={12} />
                    {ehMinha ? "Você" : msg.remetenteNome}
                    <span
                      className={`rounded-pill px-2 py-0.5 font-body text-[10px] font-bold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </span>
                  <time
                    dateTime={msg.criadaEm}
                    className={`font-body text-[10px] ${
                      ehMinha ? "text-parchment/60" : "text-black/40"
                    }`}
                  >
                    {new Date(msg.criadaEm).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p className="m-0 font-body text-sm leading-relaxed">
                  {msg.texto}
                </p>
              </article>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {erroEnvio && (
        <div className="rounded-md border border-error/30 bg-error/10 px-4 py-2.5 font-body text-xs font-semibold text-error">
          {erroEnvio}
        </div>
      )}

      {/* Formulário de Envio */}
      <form onSubmit={handleEnviar} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <textarea
            id={`mensagem-input-${author}`}
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
            className="w-full resize-none rounded-sm border border-black/[0.18] bg-white px-4 py-3 font-body text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1"
          />
          <button
            type="submit"
            disabled={!texto.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill bg-black px-5 py-3 font-body text-[13px] font-bold text-parchment transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enviar
            <Send size={14} />
          </button>
        </div>
        <p className="m-0 font-body text-xs text-ink-soft">
          Dica: Pressione <strong className="font-bold text-black">Enter</strong> para
          enviar ou <strong className="font-bold text-black">Shift + Enter</strong>{" "}
          para quebra de linha.
        </p>
      </form>
    </section>
  );
}