import type { InputHTMLAttributes } from "react";

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** id é obrigatório para ligar o <label> ao <input> corretamente */
  id: string;
}

/**
 * Campo de formulário padrão (label + input). Usado no formulário de
 * inscrição em ações — reaproveitar para qualquer formulário novo do site.
 */
export function FormField({
  label,
  id,
  className = "",
  ...rest
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-body text-[13px] font-bold text-black"
      >
        {label}
      </label>
      <input
        id={id}
        className={`rounded-sm border border-black/[0.18] bg-white px-4 py-3.5
          font-body text-sm text-black placeholder:text-[#a09b91]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-1
          ${className}`}
        {...rest}
      />
    </div>
  );
}
