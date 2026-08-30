import { useMemo, useState, useEffect } from "react";
import "./eventos.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Kicker } from "../../components/Kicker/Kicker";
import { Button } from "../../components/Button/Button";
import { EventCard } from "../../components/EventCard/EventCard";
import {
  obterEventos,
  type EventoGlobal,
  type CategoriaEvento,
} from "../../services/eventService";
import heroPlaceholder from "../../assets/hero.png";

type Categoria = "Mutirão" | "Campanha" | "Capacitação" | string;

const FILTROS: Array<"Todos" | Categoria> = [
  "Todos",
  "Mutirão",
  "Campanha",
  "Capacitação",
];

const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

function formatDay(iso: string) {
  if (!iso || !iso.includes("-")) return "15";
  return iso.split("-")[2];
}

function formatMesAno(iso: string) {
  if (!iso || !iso.includes("-")) return "2026";
  const [ano, mes] = iso.split("-");
  return `${MESES[Number(mes) - 1] || "MÊS"} ${ano}`;
}

function Eventos() {
  const [filtro, setFiltro] = useState<"Todos" | Categoria>("Todos");
  const [eventos, setEventos] = useState<EventoGlobal[]>([]);

  useEffect(() => {
    setEventos(obterEventos());

    function recarregarEventos() {
      setEventos(obterEventos());
    }
    window.addEventListener("ong_eventos_atualizados", recarregarEventos);
    return () => {
      window.removeEventListener("ong_eventos_atualizados", recarregarEventos);
    };
  }, []);

  const eventosFiltrados = useMemo(
    () =>
      filtro === "Todos"
        ? eventos
        : eventos.filter((evento) => (evento.category || "Mutirão") === filtro),
    [filtro, eventos],
  );

  const grupos = useMemo(() => {
    const mapa = new Map<string, EventoGlobal[]>();
    for (const evento of eventosFiltrados) {
      const chave = formatMesAno(evento.data);
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(evento);
    }
    return Array.from(mapa.entries());
  }, [eventosFiltrados]);

  return (
    <>
      <Header
        logoUrl="/logo.png"
        navLinks={[
          { label: "Sobre", href: "/sobre" },
          { label: "Como ajudar", href: "/doacao" },
          { label: "Eventos", href: "/eventos" },
          { label: "Área do voluntário", href: "/voluntario" },
          { label: "Contato", href: "/contato" },
        ]}
      />

      <main className="eventos">
        <a href="/" className="eventos__back">
          ← Voltar para o início
        </a>

        <section className="eventos__intro">
          <Kicker color="amber">Agenda completa</Kicker>
          <h1 className="eventos__title">Todas as próximas ações.</h1>
          <p className="eventos__lead">
            Cada ação aqui embaixo é uma chance de ajudar de perto. Confira as
            datas, os locais e escolha onde encaixar sua agenda.
          </p>
        </section>

        <div className="eventos__filters">
          {FILTROS.map((label) => (
            <Button
              key={label}
              variant={filtro === label ? "dark" : "outline"}
              onClick={() => setFiltro(label)}
              className="px-4 py-2 text-[13px]"
            >
              {label}
            </Button>
          ))}
        </div>

        {grupos.map(([mesAno, eventosDoMes]) => (
          <section key={mesAno} className="eventos__grupo">
            <p className="eventos__mes">{mesAno}</p>
            <div className="eventos__cards">
              {eventosDoMes.map((evento) => (
                <EventCard
                  key={evento.id}
                  date={formatDay(evento.data)}
                  category={evento.category || "Mutirão"}
                  place={evento.local || "Campinas"}
                  title={evento.titulo}
                  description={
                    evento.description ||
                    evento.comentarios ||
                    "Ação do Projeto Saúde Campinas."
                  }
                  photoUrl={evento.photoUrl || heroPlaceholder}
                  photoAlt={evento.photoAlt || evento.titulo}
                />
              ))}
            </div>
          </section>
        ))}

        {grupos.length === 0 && (
          <p className="eventos__vazio">
            Nenhuma ação encontrada para esse filtro no momento.
          </p>
        )}
      </main>

      <Footer
        navLinks={[
          { label: "Sobre", href: "/sobre" },
          { label: "Como ajudar", href: "/doacao" },
          { label: "Eventos", href: "/eventos" },
          { label: "Área do voluntário", href: "/voluntario" },
          { label: "Contato", href: "/contato" },
        ]}
        email="contato@saudecampinas.org"
        whatsappLabel="(19) 99999-9999"
        instagramHandle="@saudecampinas"
        location="Campinas, SP"
      />
    </>
  );
}

export default Eventos;
