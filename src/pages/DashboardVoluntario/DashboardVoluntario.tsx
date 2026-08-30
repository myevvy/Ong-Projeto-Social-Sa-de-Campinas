import { useState, useEffect, type FormEvent } from "react";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import { MessageBox } from "../../components/MessageBox/MessageBox";
import { MuralBoard } from "../../components/MuralBoard/MuralBoard";
import {
  obterEventos,
  obterInscricoesVoluntario,
  alternarInscricaoVoluntario,
  type EventoGlobal,
} from "../../services/eventService";
import "./DashboardVoluntario.css";

interface PerfilVoluntario {
  nascimento: string;
  sobre: string;
  habilidades: string;
}

export default function DashboardVoluntario({
  nome = "Voluntário",
}: {
  nome?: string;
}) {
  const [eventos, setEventos] = useState<EventoGlobal[]>([]);
  const [perfil, setPerfil] = useState<PerfilVoluntario>({
    nascimento: "",
    sobre: "",
    habilidades: "",
  });
  const [editando, setEditando] = useState(false);
  const [inscritos, setInscritos] = useState<number[]>([]);
  const [emailUsuario, setEmailUsuario] = useState("");

  useEffect(() => {
    let emailUser = "";
    try {
      const rawUser = localStorage.getItem("usuario");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u.email) emailUser = u.email;
      }
    } catch {}
    setEmailUsuario(emailUser || "voluntario@saudecampinas.org");

    setEventos(obterEventos());
    setInscritos(obterInscricoesVoluntario(nome));

    function recarregar() {
      setEventos(obterEventos());
      setInscritos(obterInscricoesVoluntario(nome));
    }
    window.addEventListener("ong_eventos_atualizados", recarregar);
    return () => {
      window.removeEventListener("ong_eventos_atualizados", recarregar);
    };
  }, [nome]);

  function handleInscricao(eventoId: number) {
    let emailUser = emailUsuario;
    let telUser = "(19) 99124-3012";
    let sobreUser = perfil.sobre || "";

    const res = alternarInscricaoVoluntario(eventoId, {
      nome,
      email: emailUser || `${nome.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      telefone: telUser,
      sobre: sobreUser || "Voluntário cadastrado no projeto Saúde Campinas.",
    });
    setInscritos(res.inscritos);
  }

  function salvarPerfil(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEditando(false);
  }

  return (
    <main className="volunteer-page">
      <header className="volunteer-page__header">
        <div>
          <p className="volunteer-page__kicker">Área do voluntário</p>
          <h1>Olá, {nome.split(" ")[0]}.</h1>
          <p>
            Encontre sua próxima ação, compartilhe no mural e envie recados para a equipe.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            window.location.assign("/login");
          }}
        >
          Sair
        </button>
      </header>

      <section className="volunteer-page__events">
        <div className="volunteer-heading">
          <div>
            <p className="volunteer-page__kicker">Agenda</p>
            <h2>Eventos disponíveis</h2>
          </div>
          <span>
            {eventos.length} {eventos.length === 1 ? "ação" : "ações"}
          </span>
        </div>
        <div className="volunteer-events-layout">
          <EventCalendar
            events={eventos.map((evento) => ({
              id: evento.id,
              title: evento.titulo,
              date: evento.data,
              meta: `${evento.local || "Campinas"} · ${evento.vagas || 6} vagas`,
            }))}
          />
          <div className="volunteer-events">
            {eventos.length === 0 && (
              <p className="font-body text-sm text-ink-soft">
                Nenhum evento disponível no momento.
              </p>
            )}
            {eventos.map((evento) => (
              <article className="volunteer-event" key={evento.id}>
                <div className="volunteer-event__date">
                  <strong>
                    {new Date(`${evento.data}T00:00:00`).getDate()}
                  </strong>
                  <span>
                    {new Date(`${evento.data}T00:00:00`)
                      .toLocaleDateString("pt-BR", { month: "short" })
                      .replace(".", "")}
                  </span>
                </div>
                <div className="volunteer-event__content">
                  <h3>{evento.titulo}</h3>
                  <p>
                    {evento.local || "Campinas"} · {evento.vagas || 6} vagas
                  </p>
                  <button
                    type="button"
                    className={inscritos.includes(evento.id) ? "inscrito" : ""}
                    onClick={() => handleInscricao(evento.id)}
                  >
                    {inscritos.includes(evento.id)
                      ? "✓ Inscrito"
                      : "Quero participar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Seção com Central de Mensagens e Mural Comunitário */}
      <section className="volunteer-page__communication-grid">
        <MessageBox
          author="voluntario"
          usuarioNome={nome}
          usuarioEmail={emailUsuario}
        />

        <MuralBoard
          tipoUsuario="voluntario"
          usuarioNome={nome}
          usuarioEmail={emailUsuario}
        />

        <article className="volunteer-panel">
          <div className="volunteer-heading">
            <div>
              <p className="volunteer-page__kicker">Seu cadastro</p>
              <h2>Sobre você</h2>
            </div>
            <button
              type="button"
              onClick={() => setEditando((atual) => !atual)}
            >
              {editando ? "Fechar" : "Editar"}
            </button>
          </div>
          {editando ? (
            <form className="volunteer-profile-form" onSubmit={salvarPerfil}>
              <label>
                Data de nascimento
                <input
                  type="date"
                  value={perfil.nascimento}
                  onChange={(e) =>
                    setPerfil({ ...perfil, nascimento: e.target.value })
                  }
                />
              </label>
              <label>
                Sobre você
                <textarea
                  value={perfil.sobre}
                  onChange={(e) =>
                    setPerfil({ ...perfil, sobre: e.target.value })
                  }
                />
              </label>
              <label>
                Habilidades
                <textarea
                  placeholder="Ex.: organização, atendimento, comunicação"
                  value={perfil.habilidades}
                  onChange={(e) =>
                    setPerfil({ ...perfil, habilidades: e.target.value })
                  }
                />
              </label>
              <button type="submit">Salvar perfil</button>
            </form>
          ) : (
            <div className="volunteer-profile">
              <p>
                <strong>Data de nascimento</strong>
                {perfil.nascimento
                  ? new Date(
                      `${perfil.nascimento}T00:00:00`,
                    ).toLocaleDateString("pt-BR")
                  : "Ainda não informado"}
              </p>
              <p>
                <strong>Sobre você</strong>
                {perfil.sobre || "Conte um pouco sobre você."}
              </p>
              <p>
                <strong>Habilidades</strong>
                {perfil.habilidades || "Adicione suas habilidades."}
              </p>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
