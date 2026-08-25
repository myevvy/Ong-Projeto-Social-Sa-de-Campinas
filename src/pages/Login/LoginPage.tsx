// src/pages/Login/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { login, AuthApiError } from "../../services/authService";
import type { TipoUsuario, UsuarioAutenticado } from "../../types/auth";
import "./LoginPage.css";

interface LoginPageProps {
  onLoginSuccess: (usuario: UsuarioAutenticado) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TENTATIVAS_VISIVEIS = 5;

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("voluntario");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativas, setTentativas] = useState(0);

  const conteudoPorPapel: Record<TipoUsuario, { titulo: string; copy: string }> = {
    voluntario: {
      titulo: "Seu tempo muda histórias.",
      copy: "Acesse a área do voluntário para ver suas atividades, escalas e o impacto do seu trabalho.",
    },
    colaborador: {
      titulo: "A gestão que sustenta a missão.",
      copy: "Acesse o painel administrativo para acompanhar operações, doações e equipe.",
    },
  };

  function validarCampos(): string | null {
    if (!EMAIL_REGEX.test(email.trim())) {
      return "Informe um e-mail válido.";
    }
    if (senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    const erroValidacao = validarCampos();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setCarregando(true);
    try {
      const resposta = await login({ email: email.trim(), senha, tipoUsuario });
      onLoginSuccess(resposta.usuario);
    } catch (err) {
      // Nunca exponha detalhes técnicos (stack trace, SQL, etc.) ao usuário final.
      const mensagem =
        err instanceof AuthApiError
          ? err.message
          : "Não foi possível conectar ao servidor. Tente novamente em instantes.";
      setErro(mensagem);
      setSenha(""); // limpa a senha da memória do componente após falha
      setTentativas((t) => t + 1);
    } finally {
      setCarregando(false);
    }
  }

  const { titulo, copy } = conteudoPorPapel[tipoUsuario];

  return (
    <div className="login-page">
      <section className="login-page__brand" data-role={tipoUsuario}>
        <span className="login-page__brand-mark">ONG Projeto Social Saúde Campinas</span>
        <div>
          <h1 className="login-page__brand-title">{titulo}</h1>
          <p className="login-page__brand-copy">{copy}</p>
        </div>
        <svg
          className="login-page__vine"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 190 C 60 150, 40 100, 90 90 C 140 80, 130 30, 180 10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle cx="90" cy="90" r="5" fill="currentColor" />
          <circle cx="180" cy="10" r="5" fill="currentColor" />
          <circle cx="10" cy="190" r="5" fill="currentColor" />
        </svg>
      </section>

      <section className="login-page__panel">
        <div className="login-page__card">
          <p className="login-page__eyebrow">Acesso ao sistema</p>
          <h2 className="login-page__heading">Entrar</h2>

          <div className="role-toggle" role="group" aria-label="Tipo de usuário">
            <button
              type="button"
              className="role-toggle__option"
              data-role="voluntario"
              aria-pressed={tipoUsuario === "voluntario"}
              onClick={() => setTipoUsuario("voluntario")}
            >
              Sou voluntário(a)
            </button>
            <button
              type="button"
              className="role-toggle__option"
              data-role="colaborador"
              aria-pressed={tipoUsuario === "colaborador"}
              onClick={() => setTipoUsuario("colaborador")}
            >
              Sou colaborador(a)
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {erro && (
              <div className="login-form__error" role="alert">
                <span>{erro}</span>
              </div>
            )}

            <div className="login-form__field">
              <label className="login-form__label" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                className="login-form__input"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(erro)}
                required
              />
            </div>

            <div className="login-form__field">
              <label className="login-form__label" htmlFor="senha">
                Senha
              </label>
              <div className="login-form__input-wrap">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  className="login-form__input"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  aria-invalid={Boolean(erro)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="login-form__toggle-visibility"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? "OCULTAR" : "MOSTRAR"}
                </button>
              </div>
            </div>

            {tentativas >= MAX_TENTATIVAS_VISIVEIS && (
              <p className="login-form__hint" role="alert">
                Muitas tentativas sem sucesso. Aguarde alguns minutos ou{" "}
                <a href="/recuperar-senha">recupere sua senha</a>.
              </p>
            )}

            <button type="submit" className="login-form__submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <p className="login-form__hint">
              Esqueceu a senha? <a href="/recuperar-senha">Recuperar acesso</a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
