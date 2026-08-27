import { useState, type FormEvent } from "react";
import { EventCalendar } from "../../components/EventCalendar/EventCalendar";
import { MessageBox } from "../../components/MessageBox/MessageBox";
import "./DashboardVoluntario.css";

interface PerfilVoluntario {
  nascimento: string;
  sobre: string;
  habilidades: string;
}
const EVENTOS = [
  {
    id: 1,
    titulo: "Triagem e organização do estoque",
    data: "2026-09-14",
    local: "Centro de Campinas",
    vagas: 6,
  },
  {
    id: 2,
    titulo: "Entrega de medicamentos",
    data: "2026-09-21",
    local: "Jardim Florence",
    vagas: 3,
  },
];

export default function DashboardVoluntario({
  nome = "Beatriz",
}: {
  nome?: string;
}) {
  const [perfil, setPerfil] = useState<PerfilVoluntario>({
    nascimento: "",
    sobre: "",
    habilidades: "",
  });
  const [editando, setEditando] = useState(false);
  const [inscritos, setInscritos] = useState<number[]>([]);
  const [mural, setMural] = useState("");
  const [postagens, setPostagens] = useState([
    "A entrega de hoje foi muito bonita. Obrigada a todo mundo que participou!",
  ]);

  function salvarPerfil(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEditando(false);
  }
  function publicar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!mural.trim()) return;
    setPostagens((atuais) => [mural.trim(), ...atuais]);
    setMural("");
  }

  return (
    <main className="volunteer-page">
      <header className="volunteer-page__header">
        <div>
          <p className="volunteer-page__kicker">Área do voluntário</p>
          <h1>Olá, {nome.split(" ")[0]}.</h1>
          <p>
            Encontre sua próxima ação, compartilhe no mural e mantenha seu
            perfil atualizado.
          </p>
        </div>
        <button type="button" onClick={() => window.location.assign("/login")}>
          Sair
        </button>
      </header>
      <section className="volunteer-page__events">
        <div className="volunteer-heading">
          <div>
            <p className="volunteer-page__kicker">Agenda</p>
            <h2>Eventos disponíveis</h2>
          </div>
          <span>{EVENTOS.length} ações</span>
        </div>
        <div className="volunteer-events-layout">
          <EventCalendar
            events={EVENTOS.map((evento) => ({
              id: evento.id,
              title: evento.titulo,
              date: evento.data,
              meta: `${evento.local} · ${evento.vagas} vagas`,
            }))}
          />
          <div className="volunteer-events">
            {EVENTOS.map((evento) => (
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
                    {evento.local} · {evento.vagas} vagas
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setInscritos((atuais) =>
                        atuais.includes(evento.id)
                          ? atuais.filter((id) => id !== evento.id)
                          : [...atuais, evento.id],
                      )
                    }
                  >
                    {inscritos.includes(evento.id)
                      ? "Inscrito"
                      : "Quero participar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="volunteer-page__communication-grid">
        <MessageBox author="voluntario" />
        <article className="volunteer-panel">
          <div className="volunteer-heading">
            <div>
              <p className="volunteer-page__kicker">Comunidade</p>
              <h2>Mural</h2>
            </div>
          </div>
          <form className="volunteer-post-form" onSubmit={publicar}>
            <textarea
              aria-label="Nova publicação"
              placeholder="Compartilhe uma atualização com a equipe"
              value={mural}
              onChange={(evento) => setMural(evento.target.value)}
            />
            <button type="submit">Publicar</button>
          </form>
          <div className="volunteer-posts">
            {postagens.map((postagem, indice) => (
              <p key={`${postagem}-${indice}`}>{postagem}</p>
            ))}
          </div>
        </article>
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
