import { useState } from "react";
import { Button } from "../Button/Button";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  logoUrl: string;
  navLinks: NavLink[];
  onLoginClick?: () => void;
  onCtaClick?: () => void;
}

/**
 * Cabeçalho do site. Mobile-first: por padrão mostra só a marca + menu
 * hambúrguer; o nav completo e os botões de ação aparecem a partir do
 * breakpoint md (960px), configurado no tailwind.config.ts.
 */
export function Header({ logoUrl, navLinks, onLoginClick, onCtaClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between bg-parchment px-6 py-5 md:px-16">
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <img
          src={logoUrl}
          alt="Saúde Campinas"
          className="h-15 w-15 rounded-pill object-cover"
        />
        <span className="font-body text-base font-bold text-black">Saúde Campinas</span>
      </a>

      <nav
        aria-label="Navegação principal"
        className="hidden gap-2 rounded-pill bg-gold px-3 py-2 md:flex"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-pill px-4 py-2 font-body text-sm font-semibold text-black no-underline"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="hidden gap-3 md:flex">
        <Button variant="outline" onClick={onLoginClick}>
          Entrar
        </Button>
        <Button variant="primary" onClick={onCtaClick}>
          Quero ajudar
        </Button>
      </div>

      <button
        type="button"
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex flex-col gap-1.5 bg-transparent p-1 md:hidden"
      >
        <span className="h-0.5 w-[22px] rounded-full bg-black" />
        <span className="h-0.5 w-[22px] rounded-full bg-black" />
        <span className="h-0.5 w-[22px] rounded-full bg-black" />
      </button>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-20 flex flex-col gap-3 border-t border-black/10 bg-parchment px-6 py-5 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 font-body text-[15px] font-semibold text-black no-underline"
            >
              {link.label}
            </a>
          ))}
          <Button variant="outline" fullWidth onClick={onLoginClick}>
            Entrar
          </Button>
          <Button variant="primary" fullWidth onClick={onCtaClick}>
            Quero ajudar
          </Button>
        </div>
      )}
    </header>
  );
}
