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
import { LogoutButton } from "../../components/LogoutButton/LogoutButton";
import { X } from "lucide-react";


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
    <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-8 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex max-w-md flex-col gap-1.5">
          <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-wide text-gold">
            Área do voluntário
          </p>
          <h1 className="m-0 font-display text-[26px] font-semibold text-black md:text-[32px]">
            Olá, {nome.split(" ")[0]}.
          </h1>
          <p className="m-0 font-body text-sm text-ink-soft">
            Encontre sua próxima ação, compartilhe no mural e envie recados para a equipe.
          </p>
        </div>
       <LogoutButton />
      </header>

      <section className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-wide text-gold">
              Agenda
            </p>
            <h2 className="m-0 font-display text-lg font-semibold text-black">
              Eventos disponíveis
            </h2>
          </div>
          <span className="rounded-pill bg-gold/5 border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-gold">
            {eventos.length} {eventos.length === 1 ? "ação" : "ações"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
          <EventCalendar
            events={eventos.map((evento) => ({
              id: evento.id,
              title: evento.titulo,
              date: evento.data,
              meta: `${evento.local || "Campinas"} · ${evento.vagas || 6} vagas`,
            }))}
          />
          <div className="flex flex-col gap-3">
            {eventos.length === 0 && (
              <p className="font-body text-sm text-ink-soft">
                Nenhum evento disponível no momento.
              </p>
            )}
            {eventos.map((evento) => {
              const data = new Date(`${evento.data}T00:00:00`);
              const inscrito = inscritos.includes(evento.id);
              return (
                <article
                  key={evento.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black/20"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-volunteer-soft">
                    <strong className="font-display text-lg font-semibold leading-none text-volunteer">
                      {data.getDate()}
                    </strong>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-volunteer">
                      {data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                    </span>
                  </div>
                  <div className="flex min-w-[160px] flex-1 flex-col gap-0.5">
                    <h3 className="m-0 font-display text-[15px] font-semibold text-black">
                      {evento.titulo}
                    </h3>
                    <p className="m-0 font-body text-xs text-ink-soft">
                      {evento.local || "Campinas"} · {evento.vagas || 6} vagas
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={inscrito}
                    onClick={() => handleInscricao(evento.id)}
                    className={
                      inscrito
                        ? "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill border border-volunteer bg-volunteer-soft px-4 py-2 font-body text-sm font-bold text-[14px] text-volunteer transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                        : "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill bg-black px-4 py-2 font-body text-sm font-bold text-white text-[14px] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    }
                  >
                    {inscrito ? "✓ Inscrito" : "Quero participar"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <article className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0 font-mono text-[11px] font-semibold uppercase tracking-wide text-gold">
                Seu cadastro
              </p>
              <h2 className="m-0 font-display text-lg font-semibold text-black">
                Sobre você
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditando((atual) => !atual)}
              className="inline-flex min-h-11 items-center gap-2 justify-center rounded-pill border border-black px-5 py-2 font-body text-xs font-bold text-black transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
                {editando ? (
    <>
      <X size={16} />
      <span>Fechar</span>
    </>
  ) : (
    "Editar"
  )}
            </button>
          </div>

          {editando ? (
            <form className="flex flex-col gap-4 justify-self-center" onSubmit={salvarPerfil}>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-sm font-bold text-black">
                  Data de nascimento
                </span>
                <input
                  type="date"
                  value={perfil.nascimento}
                  onChange={(e) =>
                    setPerfil({ ...perfil, nascimento: e.target.value })
                  }
                  className="rounded-xl border border-black/15 bg-white px-3 py-2.5 font-body text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-sm font-bold text-black">
                  Sobre você
                </span>
                <textarea
                  value={perfil.sobre}
                  onChange={(e) =>
                    setPerfil({ ...perfil, sobre: e.target.value })
                  }
                  rows={3}
                  className="rounded-xl border border-black/15 bg-white px-3 py-2.5 font-body text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-sm font-bold text-black">
                  Habilidades
                </span>
                <textarea
                  placeholder="Ex.: organização, atendimento, comunicação"
                  value={perfil.habilidades}
                  onChange={(e) =>
                    setPerfil({ ...perfil, habilidades: e.target.value })
                  }
                  rows={3}
                  className="rounded-xl border border-black/15 bg-white px-3 py-2.5 font-body text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
              </label>
              <button
                type="submit"
                className="mx-auto flex min-h-11 w-fit items-center justify-center rounded-pill bg-black px-5 py-2.5 font-body text-[14px] text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Salvar perfil
              </button>
            </form>
          ) : (
            <dl className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  Data de nascimento
                </dt>
                <dd className="m-0 font-body text-sm text-black">
                  {perfil.nascimento
                    ? new Date(`${perfil.nascimento}T00:00:00`).toLocaleDateString("pt-BR")
                    : "Ainda não informado"}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  Sobre você
                </dt>
                <dd className="m-0 font-body text-sm text-black">
                  {perfil.sobre || "Conte um pouco sobre você."}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  Habilidades
                </dt>
                <dd className="m-0 font-body text-sm text-black">
                  {perfil.habilidades || "Adicione suas habilidades."}
                </dd>
              </div>
            </dl>
          )}
        </article>
      </section>
    </main>
  );
}