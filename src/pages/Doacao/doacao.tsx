import { useEffect, useState } from "react";
import "./doacao.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Kicker } from "../../components/Kicker/Kicker";
import { Button } from "../../components/Button/Button";
import {
  buscarMedicamentosApi,
  obterMedicamentosCache,
  itensFaltandoAgora,
  type MedicamentoItem,
} from "../../services/remedioService";

const NAV_LINKS = [
  { label: "Sobre", href: "/sobre" },
  { label: "Como ajudar", href: "/doacao" },
  { label: "Eventos", href: "/eventos" },
  { label: "Área do voluntário", href: "/voluntario" },
  { label: "Contato", href: "/contato" },
];

const WHATSAPP_URL = "https://wa.me/5519999999999";
const INSTAGRAM_URL = "https://instagram.com/saudecampinas";

const O_QUE_ACEITAMOS = [
  {
    title: "Medicamentos dentro da validade",
    description: "De uso comum, ainda lacrados ou em bom estado.",
  },
  {
    title: "Amostras grátis",
    description: "Recebidas em consultórios, clínicas ou farmácias.",
  },
  {
    title: "Insumos e materiais médicos",
    description: "Curativos, luvas, máscaras e itens de higiene.",
  },
];

const COMO_DOAR = [
  {
    title: "Fale com a gente",
    description: "Pelo WhatsApp ou Instagram, conte o que você tem pra doar.",
  },
  {
    title: "Combine local e horário",
    description: "A gente indica o ponto de coleta mais perto de você.",
  },
  {
    title: "Entregue",
    description: "Simples assim — sua doação já entra na próxima ação.",
  },
];

function ContactButtons({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="doacao__contact-buttons">
      <Button
        variant="primary"
        onClick={() => window.open(WHATSAPP_URL, "_blank")}
      >
        Chamar no WhatsApp
      </Button>
      {onDark ? (
        <button
          className="doacao__outline-btn-dark"
          onClick={() => window.open(INSTAGRAM_URL, "_blank")}
        >
          Chamar no Instagram
        </button>
      ) : (
        <Button
          variant="outline"
          onClick={() => window.open(INSTAGRAM_URL, "_blank")}
        >
          Chamar no Instagram
        </Button>
      )}
    </div>
  );
}

function formatarAtualizacao(data: Date) {
  return `Atualizado às ${data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function Doacao() {
  const [medicamentos, setMedicamentos] = useState<MedicamentoItem[]>(
    obterMedicamentosCache(),
  );
  const [carregando, setCarregando] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(
    null,
  );

  useEffect(() => {
    let ativo = true;

    buscarMedicamentosApi()
      .then((lista) => {
        if (!ativo) return;
        setMedicamentos(lista);
        setUltimaAtualizacao(new Date());
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    // Mesmo evento que o dashboard de medicamentos dispara ao
    // adicionar/editar/excluir um item — mantém "Faltando agora"
    // sincronizado sem precisar recarregar a página.
    function sincronizar() {
      setMedicamentos(obterMedicamentosCache());
      setUltimaAtualizacao(new Date());
    }
    window.addEventListener("ong_medicamentos_atualizados", sincronizar);

    return () => {
      ativo = false;
      window.removeEventListener("ong_medicamentos_atualizados", sincronizar);
    };
  }, []);

  const necessidades = itensFaltandoAgora(medicamentos);

  return (
    <>
      <Header logoUrl="/logo.png" navLinks={NAV_LINKS} />

      <main className="doacao">
        <a href="/" className="doacao__back">
          ← Voltar para o início
        </a>

        <section className="doacao__hero">
          <div className="doacao__hero-text">
            <Kicker color="amber">Doação</Kicker>
            <h1 className="doacao__title">
              Sua doação chega direto em quem precisa.
            </h1>
            <p className="doacao__lead">
              Medicamentos, amostras grátis e insumos parados no armário
              podem completar o estoque que levamos pra rua.
            </p>
            <ContactButtons />
          </div>

          <aside className="doacao__needs" aria-labelledby="faltando-agora">
            <div className="doacao__needs-header">
              <Kicker color="amber">Faltando agora</Kicker>
              {ultimaAtualizacao && (
                <span className="doacao__needs-updated">
                  {formatarAtualizacao(ultimaAtualizacao)}
                </span>
              )}
            </div>
            {carregando ? (
              <p className="doacao__needs-empty">Carregando estoque…</p>
            ) : necessidades.length > 0 ? (
              <ul className="doacao__needs-list">
                {necessidades.map((item) => (
                  <li key={item.id ?? item.nome}>{item.nome}</li>
                ))}
              </ul>
            ) : (
              <p className="doacao__needs-empty">
                Estoque em dia — nenhum item em falta no momento.
              </p>
            )}
          </aside>
        </section>

        <section className="doacao__section">
          <Kicker color="amber">O que aceitamos</Kicker>
          <div className="doacao__accepted-grid">
            {O_QUE_ACEITAMOS.map((item) => (
              <article key={item.title} className="doacao__accepted-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="doacao__section">
          <Kicker color="amber">Como doar</Kicker>
          <div className="doacao__steps-grid">
            {COMO_DOAR.map((step, index) => (
              <div key={step.title} className="doacao__step">
                <span className="doacao__step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="doacao__cta">
          <h2>Bora combinar sua doação?</h2>
          <ContactButtons onDark />
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

export default Doacao;
