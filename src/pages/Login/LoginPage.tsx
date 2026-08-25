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
type ModoAutenticacao = "login" | "cadastro" | "recuperacao";
type EtapaRecuperacao = "email" | "codigo" | "nova-senha";

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("voluntario");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativas, setTentativas] = useState(0);
  const [modo, setModo] = useState<ModoAutenticacao>("login");
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [etapaRecuperacao, setEtapaRecuperacao] =
    useState<EtapaRecuperacao>("email");
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const conteudoPorPapel: Record<
    TipoUsuario,
    { titulo: string; copy: string }
  > = {
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

  function mudarModo(novoModo: ModoAutenticacao) {
    setModo(novoModo);
    setErro(null);
    setMensagem(null);
    setEtapaRecuperacao("email");
    setCodigo("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setMensagem(null);

    if (modo === "recuperacao") {
      if (etapaRecuperacao === "email") {
        if (!EMAIL_REGEX.test(email.trim())) {
          setErro("Informe um e-mail válido.");
          return;
        }
        setEtapaRecuperacao("codigo");
        setMensagem("Enviamos um código de confirmação para o seu e-mail.");
        return;
      }
      if (etapaRecuperacao === "codigo") {
        if (codigo.trim().length < 4) {
          setErro("Informe o código de confirmação recebido.");
          return;
        }
        setEtapaRecuperacao("nova-senha");
        setMensagem("Código confirmado. Agora escolha uma nova senha.");
        return;
      }
      if (senha.length < 6 || senha !== confirmarSenha) {
        setErro(
          senha.length < 6
            ? "A senha deve ter pelo menos 6 caracteres."
            : "As senhas não coincidem.",
        );
        return;
      }
      setModo("login");
      setSenha("");
      setConfirmarSenha("");
      setMensagem("Senha redefinida. Entre com sua nova senha.");
      return;
    }

    if (modo === "cadastro") {
      if (!nome.trim()) {
        setErro("Informe seu nome completo.");
        return;
      }
      const erroSenha = validarCampos();
      if (erroSenha || senha !== confirmarSenha) {
        setErro(erroSenha ?? "As senhas não coincidem.");
        return;
      }
      setModo("login");
      setSenha("");
      setConfirmarSenha("");
      setMensagem("Cadastro criado. Agora você já pode entrar.");
      return;
    }

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
        <span className="login-page__brand-mark">
          ONG Projeto Social Saúde Campinas
        </span>
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
          <h2 className="login-page__heading">
            {modo === "login"
              ? "Entrar"
              : modo === "cadastro"
                ? "Criar cadastro"
                : "Recuperar acesso"}
          </h2>

          {modo !== "recuperacao" && (
            <div
              className="role-toggle"
              role="group"
              aria-label="Tipo de usuário"
            >
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
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {erro && (
              <div className="login-form__error" role="alert">
                <span>{erro}</span>
              </div>
            )}
            {mensagem && (
              <div className="login-form__success" role="status">
                {mensagem}
              </div>
            )}

            {modo === "cadastro" && (
              <div className="login-form__field">
                <label className="login-form__label" htmlFor="nome">
                  Nome completo
                </label>
                <input
                  id="nome"
                  className="login-form__input"
                  autoComplete="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
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

            {modo !== "recuperacao" || etapaRecuperacao === "nova-senha" ? (
              <div className="login-form__field">
                <label className="login-form__label" htmlFor="senha">
                  Senha
                </label>
                <div className="login-form__input-wrap">
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    className="login-form__input"
                    autoComplete={
                      modo === "login" ? "current-password" : "new-password"
                    }
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
                    aria-label={
                      mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? "OCULTAR" : "MOSTRAR"}
                  </button>
                </div>
              </div>
            ) : null}

            {modo === "cadastro" && (
              <div className="login-form__field">
                <label className="login-form__label" htmlFor="confirmar-senha">
                  Confirmar senha
                </label>
                <input
                  id="confirmar-senha"
                  type="password"
                  className="login-form__input"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            {modo === "recuperacao" && etapaRecuperacao === "codigo" && (
              <div className="login-form__field">
                <label className="login-form__label" htmlFor="codigo">
                  Código de confirmação
                </label>
                <input
                  id="codigo"
                  className="login-form__input login-form__input--codigo"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
              </div>
            )}

            {modo === "recuperacao" && etapaRecuperacao === "nova-senha" && (
              <div className="login-form__field">
                <label className="login-form__label" htmlFor="confirmar-senha">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmar-senha"
                  type="password"
                  className="login-form__input"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            {tentativas >= MAX_TENTATIVAS_VISIVEIS && (
              <p className="login-form__hint" role="alert">
                Muitas tentativas sem sucesso. Aguarde alguns minutos ou{" "}
                <a
                  href="/recuperar-senha"
                  onClick={(e) => {
                    e.preventDefault();
                    mudarModo("recuperacao");
                  }}
                >
                  recupere sua senha
                </a>
                .
              </p>
            )}

            <button
              type="submit"
              className="login-form__submit"
              disabled={carregando}
            >
              {carregando
                ? "Aguarde..."
                : modo === "login"
                  ? "Entrar"
                  : modo === "cadastro"
                    ? "Criar cadastro"
                    : etapaRecuperacao === "email"
                      ? "Enviar código"
                      : etapaRecuperacao === "codigo"
                        ? "Confirmar código"
                        : "Redefinir senha"}
            </button>

            {modo === "login" && (
              <>
                <p className="login-form__hint">
                  Esqueceu a senha?{" "}
                  <a
                    href="/recuperar-senha"
                    onClick={(e) => {
                      e.preventDefault();
                      mudarModo("recuperacao");
                    }}
                  >
                    Recuperar acesso
                  </a>
                </p>
                <p className="login-form__hint">
                  Ainda não tem uma conta?{" "}
                  <a
                    href="/cadastro"
                    onClick={(e) => {
                      e.preventDefault();
                      mudarModo("cadastro");
                    }}
                  >
                    Criar cadastro
                  </a>
                </p>
              </>
            )}
            {modo === "cadastro" && (
              <p className="login-form__hint">
                Já tem uma conta?{" "}
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    mudarModo("login");
                  }}
                >
                  Voltar para entrar
                </a>
              </p>
            )}
            {modo === "recuperacao" && (
              <p className="login-form__hint">
                {etapaRecuperacao === "codigo" ? (
                  <>
                    <button
                      type="button"
                      className="login-form__text-button"
                      onClick={() =>
                        setMensagem(
                          "Um novo código foi enviado para o seu e-mail.",
                        )
                      }
                    >
                      Reenviar código
                    </button>{" "}
                    ·{" "}
                  </>
                ) : null}
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    mudarModo("login");
                  }}
                >
                  Voltar para entrar
                </a>
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
