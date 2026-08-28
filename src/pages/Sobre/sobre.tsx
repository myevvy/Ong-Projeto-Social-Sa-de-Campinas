import { HeartHandshake, Users, Stethoscope, ImageIcon } from "lucide-react";
import "./sobre.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Kicker } from "../../components/Kicker/Kicker";
import { Button } from "../../components/Button/Button";
import { ValueCard } from "../../components/ValueCard/ValueCard";

const NAV_LINKS = [
  { label: "Sobre", href: "/sobre" },
  { label: "Como ajudar", href: "/doacao" },
  { label: "Eventos", href: "/eventos" },
  { label: "Área do voluntário", href: "/voluntario" },
  { label: "Contato", href: "/contato" },
];

const VALORES = [
  {
    icon: <HeartHandshake size={34} strokeWidth={1.6} />,
    title: "Acolher",
    description:
      "Cada pessoa é recebida com respeito e sem julgamento, do jeito que ela está.",
  },
  {
    icon: <Users size={34} strokeWidth={1.6} />,
    title: "Humanizar",
    description:
      "Enxergamos histórias, não só casos — o atendimento começa pela escuta.",
  },
  {
    icon: <Stethoscope size={34} strokeWidth={1.6} />,
    title: "Atender e triar",
    description:
      "Levamos atendimento básico de saúde e triagem direto pra rua, rua a rua.",
  },
];

/** Placeholders de foto — trocar cada `PhotoSlot` por uma <img> quando as fotos reais chegarem. */
const GALERIA = [
  "Atendimento de rua",
  "Kits de higiene e doação",
  "Equipe em ação",
  "Mutirão de voluntários",
];

function PhotoSlot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`sobre__photo-slot ${className}`}>
      <ImageIcon size={28} strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  );
}

function Sobre() {
  return (
    <>
      <Header logoUrl="/logo.png" navLinks={NAV_LINKS} />

      <main className="sobre">
        <section className="sobre__hero">
          <div className="sobre__hero-text">
            <Kicker color="amber">Sobre o projeto</Kicker>
            <h1 className="sobre__title">
              Saúde que chega até quem mais precisa.
            </h1>
            <p className="sobre__lead">
              Em nossa sociedade, a saúde infelizmente não chega para todos, 
              especialmente para as pessoas mais vulneráveis e em situação de
              risco. É por isso que existimos.
            </p>
          </div>
          <PhotoSlot label="Foto de capa" className="sobre__photo-slot--hero" />
        </section>

        <section className="sobre__quem-somos">
          <Kicker color="gold">Quem somos</Kicker>
          <p className="sobre__paragrafo">
            Somos um grupo formado por profissionais e estudantes da área da
            saúde, e hoje somos um dos braços do projeto{" "}
            <strong>"Saúde da Rua"</strong>, que já acontece em São Paulo.
            Aqui em Campinas, nosso objetivo é acolher, humanizar e oferecer
            atendimento básico e triagem para pessoas em situação de risco da
            região.
          </p>
          <div className="sobre__grid-fotos-secundarias">
            <PhotoSlot label="Equipe do projeto" />
            <PhotoSlot label="Ação na região" />
          </div>
        </section>

        <section className="sobre__valores">
          <Kicker color="amber">Como atuamos</Kicker>
          <h2 className="sobre__subtitle">O que guia cada ação nossa.</h2>
          <div className="sobre__valores-grid">
            {VALORES.map((valor) => (
              <ValueCard
                key={valor.title}
                icon={valor.icon}
                title={valor.title}
                description={valor.description}
              />
            ))}
          </div>
        </section>

        <section className="sobre__galeria">
          <Kicker color="gold">Nosso dia a dia</Kicker>
          <h2 className="sobre__subtitle">Um pouco do que fazemos na rua.</h2>
          <div className="sobre__galeria-grid">
            {GALERIA.map((label) => (
              <PhotoSlot key={label} label={label} />
            ))}
          </div>
        </section>

        <p className="sobre__aviso">
          Aguarde! Em breve mais informações sobre o projeto por aqui.
        </p>

        <section className="sobre__cta">
          <h2 className="sobre__cta-title">Quer fazer parte dessa causa?</h2>
          <p className="sobre__cta-text">
            Toda ajuda conta — seja com seu tempo como voluntário, seja com
            uma doação.
          </p>
          <div className="sobre__cta-buttons">
            <Button variant="primary" onClick={() => (window.location.href = "/eventos")}>
              Ver próximas ações
            </Button>
            <button
              className="sobre__cta-outline-btn"
              onClick={() => (window.location.href = "/doacao")}
            >
              Quero ajudar
            </button>
          </div>
        </section>
      </main>

      <Footer
        navLinks={NAV_LINKS}
        email="contato@saudecampinas.org"
        whatsappLabel="(19) 99999-9999"
        instagramHandle="@saudecampinas"
        location="Campinas, SP"
      />
    </>
  );
}

export default Sobre;
