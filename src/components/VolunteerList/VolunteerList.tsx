// src/components/VolunteerList/VolunteerList.tsx
import {
  Users,
  ChevronUp,
  ChevronDown,
  User,
  Mail,
  Phone,
  MessageCircle,
  UserX,
} from "lucide-react";

export interface VoluntarioInscritoInfo {
  nome: string;
  email: string;
  telefone?: string;
  sobre?: string;
  dataInscricao?: string;
}

interface VolunteerListProps {
  /** Lista de voluntários inscritos nesta ação/evento */
  inscritos: VoluntarioInscritoInfo[];
  /** Número total de vagas disponíveis */
  vagas: number;
  /** Se a lista está expandida ou não (controlado pelo componente pai) */
  aberto: boolean;
  /** Chamado quando o usuário clica no botão de abrir/fechar a lista */
  onToggle: () => void;
  /** Chamado quando o usuário clica em "Remover da ação" para um voluntário específico */
  onRemover: (nomeOuEmail: string) => void;
  /** Se true, esconde o botão de remover (útil pra visões somente-leitura) */
  somenteLeitura?: boolean;
}

export function VolunteerList({
  inscritos,
  vagas,
  aberto,
  onToggle,
  onRemover,
  somenteLeitura = false,
}: VolunteerListProps) {
  const total = inscritos?.length || 0;

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={onToggle}
        className={`mt-2.5 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-pill border border-volunteer/40 px-3.5 py-1.5 font-body text-xs font-bold transition-all hover:opacity-90 active:scale-95 ${
          aberto
            ? "bg-volunteer text-parchment shadow-sm"
            : "bg-volunteer-soft text-volunteer hover:bg-volunteer/15"
        }`}
      >
        <Users size={14} />
        <span>
          {total} {total === 1 ? "inscrito" : "inscritos"} de {vagas || 6} vagas
        </span>
        <span className="text-[11px] font-normal opacity-80">
          ({aberto ? "ocultar voluntários" : "ver quem se inscreveu"})
        </span>
        {aberto ? (
          <ChevronUp size={14} className="shrink-0" />
        ) : (
          <ChevronDown size={14} className="shrink-0" />
        )}
      </button>

      {aberto && (
        <div className="flex flex-col gap-2.5 rounded-lg border border-black/10 bg-parchment/50 p-4">
          <h4 className="m-0 font-body text-[13px] font-bold uppercase tracking-wide text-black">
            Lista de voluntários confirmados ({total})
          </h4>

          {total === 0 ? (
            <p className="m-0 font-body text-xs text-ink-soft">
              Nenhum voluntário inscrito nesta ação até o momento.
            </p>
          ) : (
            inscritos.map((voluntario, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-black/10 bg-white p-3"
              >
                <div className="flex flex-col gap-1">
                  <strong className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-black">
                    <User size={14} className="shrink-0" />
                    {voluntario.nome}
                  </strong>

                  <span className="inline-flex items-center gap-1.5 font-body text-xs text-ink-soft">
                    <Mail size={12} className="shrink-0" />
                    <a
                      href={`mailto:${voluntario.email}`}
                      className="text-volunteer underline"
                    >
                      {voluntario.email}
                    </a>
                  </span>

                  {voluntario.telefone && (
                    <span className="inline-flex flex-wrap items-center gap-1.5 font-body text-xs text-ink-soft">
                      <Phone size={12} className="shrink-0" />
                      <a
                        href={`tel:${voluntario.telefone}`}
                        className="font-semibold text-black"
                      >
                        {voluntario.telefone}
                      </a>
                      <span>·</span>
                      <a
                        href={`https://wa.me/55${voluntario.telefone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-volunteer underline"
                      >
                        <MessageCircle size={12} />
                        WhatsApp
                      </a>
                    </span>
                  )}

                  {voluntario.sobre && (
                    <p className="m-0 mt-0.5 font-body text-xs italic text-ink-soft">
                      "{voluntario.sobre}"
                    </p>
                  )}

                  {voluntario.dataInscricao && (
                    <small className="mt-0.5 font-body text-[10px] text-black/40">
                      Inscrito(a) em:{" "}
                      {new Date(
                        `${voluntario.dataInscricao}T00:00:00`,
                      ).toLocaleDateString("pt-BR")}
                    </small>
                  )}
                </div>

                {!somenteLeitura && (
                  <button
                    type="button"
                    onClick={() =>
                      onRemover(voluntario.email || voluntario.nome)
                    }
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-error/30 bg-error/10 px-2.5 py-1.5 font-body text-[11px] font-bold text-error transition-colors hover:bg-error/20"
                  >
                    <UserX size={12} />
                    Remover da ação
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
