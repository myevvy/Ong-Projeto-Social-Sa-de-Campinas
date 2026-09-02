import { MessageCircle, Camera, Mail, MapPin } from "lucide-react";
import "./contato.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Kicker } from "../../components/Kicker/Kicker";

const NAV_LINKS = [
  { label: "Sobre", href: "/sobre" },
  { label: "Como ajudar", href: "/doacao" },
  { label: "Eventos", href: "/eventos" },
  { label: "Área do voluntário", href: "/voluntario" },
  { label: "Contato", href: "/contato" },
];

const CANAIS = [
  {
    icon: <MessageCircle size={26} strokeWidth={1.6} />,
    label: "WhatsApp",
    value: "(19) 99999-9999",
    href: "https://wa.me/5519999999999",
  },
  {
    icon: <Camera size={26} strokeWidth={1.6} />,
    label: "Instagram",
    value: "@projetosaudecps",
    href: "https://www.instagram.com/projetosaudecps/",
  },
  {
    icon: <Mail size={26} strokeWidth={1.6} />,
    label: "E-mail",
    value: "Clique para enviar um e-mail",
    href: "mailto:projetosocialsaudecampinas@gmail.com",
  },
  {
    icon: <MapPin size={26} strokeWidth={1.6} />,
    label: "Região",
    value: "Campinas, SP",
  },
];

function Contato() {
  return (
    <>
      <Header logoUrl="/logo.png" navLinks={NAV_LINKS} />

      <main className="contato">
        <section className="contato__intro">
          <Kicker color="amber">Contato</Kicker>
          <h1 className="contato__title">Fale com a gente.</h1>
          <p className="contato__lead">
            Dúvidas, doações ou vontade de virar voluntário — escolha o
            canal mais fácil pra você.
          </p>
        </section>

        <section className="contato__grid">
          {CANAIS.map((canal) =>
            canal.href ? (
              <a
                key={canal.label}
                href={canal.href}
                target="_blank"
                rel="noreferrer"
                className="contato__card"
              >
                <span className="contato__card-icon">{canal.icon}</span>
                <div>
                  <p className="contato__card-label">{canal.label}</p>
                  <p className="contato__card-value">{canal.value}</p>
                </div>
              </a>
            ) : (
              <div key={canal.label} className="contato__card">
                <span className="contato__card-icon">{canal.icon}</span>
                <div>
                  <p className="contato__card-label">{canal.label}</p>
                  <p className="contato__card-value">{canal.value}</p>
                </div>
              </div>
            ),
          )}
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

export default Contato;
