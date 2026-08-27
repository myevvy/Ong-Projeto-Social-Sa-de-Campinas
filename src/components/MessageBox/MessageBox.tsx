import { useEffect, useState, type FormEvent } from "react";
import "./MessageBox.css";

interface Message {
  id: number;
  author: "colaborador" | "voluntario";
  text: string;
  createdAt: string;
}
interface MessageBoxProps {
  author: Message["author"];
}
const STORAGE_KEY = "saude-campinas-mensagens";
const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    author: "colaborador",
    text: "Olá! Confirmem por aqui a participação na próxima ação.",
    createdAt: "2026-08-26T09:00:00",
  },
];

export function MessageBox({ author }: MessageBoxProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") ??
        INITIAL_MESSAGES
      );
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");
  }
  return (
    <section className="message-box" aria-labelledby={`mensagens-${author}`}>
      <div className="message-box__heading">
        <div>
          <span className="message-box__kicker">Comunicação</span>
          <h2 id={`mensagens-${author}`}>Mensagens</h2>
        </div>
        <span>{messages.length} registros</span>
      </div>
      <div className="message-box__thread">
        {messages.map((message) => (
          <article
            className={`message-box__message message-box__message--${message.author}`}
            key={message.id}
          >
            <div>
              <strong>
                {message.author === "colaborador"
                  ? "Colaborador"
                  : "Voluntário"}
              </strong>
              <time dateTime={message.createdAt}>
                {new Date(message.createdAt).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
            </div>
            <p>{message.text}</p>
          </article>
        ))}
      </div>
      <form className="message-box__form" onSubmit={sendMessage}>
        <label htmlFor={`mensagem-${author}`}>
          Enviar como {author}
          <textarea
            id={`mensagem-${author}`}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escreva uma mensagem para a equipe"
          />
        </label>
        <button type="submit">Enviar mensagem</button>
      </form>
    </section>
  );
}
