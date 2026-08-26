export interface FooterProps {
  navLinks: { label: string; href: string }[];
  email: string;
  whatsappLabel: string;
  instagramHandle: string;
  location: string;
}

/**
 * Rodapé padrão do site. Empilha em mobile, 3 colunas a partir do desktop (md).
 */
export function Footer({
  navLinks,
  email,
  whatsappLabel,
  instagramHandle,
  location,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black px-6 pb-10 pt-14 text-parchment md:px-16">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="m-0 font-body text-base font-bold">Saúde Campinas</p>
          <p className="m-0 max-w-[280px] font-body text-[13px] text-[#b9b4a8]">
            Projeto social de atendimento de saúde e acolhimento a pessoas em
            vulnerabilidade em Campinas, SP.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="m-0 mb-1 font-mono text-xs font-semibold tracking-wide text-[#b9b4a8]">
            CONTATO
          </p>
          <p className="m-0 font-body text-[13.5px]">{email}</p>
          <p className="m-0 font-body text-[13.5px]">{whatsappLabel}</p>
          <p className="m-0 font-body text-[13.5px]">{instagramHandle}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="m-0 mb-1 font-mono text-xs font-semibold tracking-wide text-[#b9b4a8]">
            NAVEGAÇÃO
          </p>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="m-0 font-body text-[13.5px] text-parchment no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-1 border-t border-parchment/[0.12] pt-5 font-body text-[12.5px] text-[#8f8a7e] md:flex-row md:justify-between">
        <p className="m-0">© {year} Projeto Social Saúde Campinas.</p>
        <p className="m-0">{location}</p>
      </div>
    </footer>
  );
}
