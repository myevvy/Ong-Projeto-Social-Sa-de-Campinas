import { useState } from "react";
import "./LoginPage.css";

type ViewMode = "login" | "cadastro" | "recuperar";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function LoginPage() {
  const [modo, setModo] = useState<ViewMode>("login");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro" | "info";
    texto: string;
  } | null>(null);

  const [login, setLogin] = useState({ email: "", senha: "" });
  const [cadastro, setCadastro] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    end: "",
    cep: "",
    aniversario: "",
    sobre: "",
  });
  const [recuperar, setRecuperar] = useState({ email: "" });

  const validarEmail = (valor: string) => /\S+@\S+\.\S+/.test(valor);

  const enviarLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!login.email || !login.senha) {
      setMensagem({
        tipo: "erro",
        texto: "Informe o e-mail e a senha para entrar.",
      });
      return;
    }

    if (!validarEmail(login.email)) {
      setMensagem({ tipo: "erro", texto: "O e-mail informado não é válido." });
      return;
    }

    setCarregando(true);
    setMensagem(null);

    try {
      const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: login.email,
          senha: login.senha,
        }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || dados.message || "Não foi possível entrar.",
        );
      }

      localStorage.setItem("token", dados.token || "");
      setMensagem({
        tipo: "sucesso",
        texto: "Login realizado com sucesso. Redirecionando...",
      });
      window.setTimeout(() => window.location.assign("/"), 700);
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error ? erro.message : "Não foi possível entrar.";
      setMensagem({ tipo: "erro", texto: mensagemErro });
    } finally {
      setCarregando(false);
    }
  };

  const enviarCadastro = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !cadastro.nome ||
      !cadastro.email ||
      !cadastro.senha ||
      !cadastro.telefone
    ) {
      setMensagem({
        tipo: "erro",
        texto:
          "Preencha nome, e-mail, senha e telefone para concluir o cadastro.",
      });
      return;
    }

    if (!validarEmail(cadastro.email)) {
      setMensagem({ tipo: "erro", texto: "Digite um e-mail válido." });
      return;
    }

    if (cadastro.senha.length < 6) {
      setMensagem({
        tipo: "erro",
        texto: "A senha precisa ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (cadastro.senha !== cadastro.confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "As senhas não conferem." });
      return;
    }

    setCarregando(true);
    setMensagem(null);

    try {
      const resposta = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: cadastro.nome,
          email: cadastro.email,
          senha: cadastro.senha,
          end: cadastro.end || "",
          cep: cadastro.cep || "",
          tel: cadastro.telefone,
          tipo: "func",
          aniversario: cadastro.aniversario || null,
          sobre: cadastro.sobre || "",
        }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            dados.message ||
            "Não foi possível concluir o cadastro.",
        );
      }

      setMensagem({
        tipo: "sucesso",
        texto:
          "Cadastro realizado com sucesso. Agora você pode entrar com suas credenciais.",
      });
      setModo("login");
      setLogin({ email: cadastro.email, senha: cadastro.senha });
      setCadastro({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        telefone: "",
        end: "",
        cep: "",
        aniversario: "",
        sobre: "",
      });
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível concluir o cadastro.";
      setMensagem({ tipo: "erro", texto: mensagemErro });
    } finally {
      setCarregando(false);
    }
  };

  const enviarRecuperacao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recuperar.email) {
      setMensagem({
        tipo: "erro",
        texto: "Informe o e-mail para receber ajuda de acesso.",
      });
      return;
    }

    if (!validarEmail(recuperar.email)) {
      setMensagem({ tipo: "erro", texto: "Digite um e-mail válido." });
      return;
    }

    setCarregando(true);
    setMensagem({
      tipo: "info",
      texto:
        "Se esse e-mail estiver cadastrado, a equipe vai enviar um passo a passo de recuperação em breve.",
    });
    setCarregando(false);
    setRecuperar({ email: "" });
    setModo("login");
  };

  return (
    <main className="login-page">
      <div className="login-card" aria-live="polite">
        <div className="login-card__brand">
          <span className="login-card__eyebrow">
            Projeto Social Saúde Campinas
          </span>
          <h1>Área de acesso</h1>
          <p>Acesso único para voluntários, colaboradores e equipe da ONG.</p>
        </div>

        <div
          className="login-card__tabs"
          role="tablist"
          aria-label="Opções de acesso"
        >
          {[
            { id: "login", label: "Login" },
            { id: "cadastro", label: "Cadastro" },
            { id: "recuperar", label: "Recuperar senha" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={modo === item.id ? "is-active" : ""}
              onClick={() => setModo(item.id as ViewMode)}
              role="tab"
              aria-selected={modo === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mensagem && (
          <div
            className={`login-card__message login-card__message--${mensagem.tipo}`}
          >
            {mensagem.texto}
          </div>
        )}

        {modo === "login" && (
          <form className="login-form" onSubmit={enviarLogin}>
            <label>
              E-mail
              <input
                type="email"
                value={login.email}
                onChange={(event) =>
                  setLogin({ ...login, email: event.target.value })
                }
                placeholder="seu@email.com"
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={login.senha}
                onChange={(event) =>
                  setLogin({ ...login, senha: event.target.value })
                }
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="login-form__button"
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        {modo === "cadastro" && (
          <form className="login-form" onSubmit={enviarCadastro}>
            <label>
              Nome completo
              <input
                type="text"
                value={cadastro.nome}
                onChange={(event) =>
                  setCadastro({ ...cadastro, nome: event.target.value })
                }
                placeholder="Seu nome"
              />
            </label>

            <div className="login-form__row">
              <label>
                E-mail
                <input
                  type="email"
                  value={cadastro.email}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, email: event.target.value })
                  }
                  placeholder="seu@email.com"
                />
              </label>

              <label>
                Telefone
                <input
                  type="tel"
                  value={cadastro.telefone}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, telefone: event.target.value })
                  }
                  placeholder="(19) 99999-9999"
                />
              </label>
            </div>

            <div className="login-form__row">
              <label>
                Senha
                <input
                  type="password"
                  value={cadastro.senha}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, senha: event.target.value })
                  }
                  placeholder="Crie uma senha"
                />
              </label>

              <label>
                Confirmar senha
                <input
                  type="password"
                  value={cadastro.confirmarSenha}
                  onChange={(event) =>
                    setCadastro({
                      ...cadastro,
                      confirmarSenha: event.target.value,
                    })
                  }
                  placeholder="Repita a senha"
                />
              </label>
            </div>

            <div className="login-form__row">
              <label>
                Endereço
                <input
                  type="text"
                  value={cadastro.end}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, end: event.target.value })
                  }
                  placeholder="Rua, número e bairro"
                />
              </label>

              <label>
                CEP
                <input
                  type="text"
                  value={cadastro.cep}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, cep: event.target.value })
                  }
                  placeholder="13000-000"
                />
              </label>
            </div>

            <label>
              Data de nascimento
              <input
                type="date"
                value={cadastro.aniversario}
                onChange={(event) =>
                  setCadastro({ ...cadastro, aniversario: event.target.value })
                }
              />
            </label>

            <label>
              Sobre você
              <textarea
                value={cadastro.sobre}
                onChange={(event) =>
                  setCadastro({ ...cadastro, sobre: event.target.value })
                }
                placeholder="Conte um pouco sobre sua disponibilidade ou interesse na ONG"
                rows={4}
              />
            </label>

            <button
              type="submit"
              className="login-form__button"
              disabled={carregando}
            >
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        )}

        {modo === "recuperar" && (
          <form className="login-form" onSubmit={enviarRecuperacao}>
            <label>
              E-mail cadastrado
              <input
                type="email"
                value={recuperar.email}
                onChange={(event) =>
                  setRecuperar({ email: event.target.value })
                }
                placeholder="seu@email.com"
              />
            </label>

            <button
              type="submit"
              className="login-form__button"
              disabled={carregando}
            >
              {carregando ? "Enviando..." : "Solicitar ajuda"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
