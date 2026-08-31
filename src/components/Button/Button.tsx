import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "dark" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-amber/15 text-amber",
  dark: "bg-black text-parchment",
  outline: "bg-transparent text-black border border-black",
};

/**
 * Botão em formato pill, usado em todo o site (CTAs, formulários, cards).
 * - primary: fundo dourado, texto preto — ação principal
 * - dark: fundo preto quente, texto claro — ação em fundo claro
 * - outline: contorno, sem preenchimento — ação secundária
 */
export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center  rounded-[30px] px-3 py-2
        font-body font-bold text-[14.5px] transition-opacity
        hover:opacity-90 active:scale-[0.98]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2
        ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
