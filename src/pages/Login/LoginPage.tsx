import { useState } from "react";
import "./LoginPage.css";

type ViewMode = "login" | "cadastro" | "recuperar";
type TipoPerfil = "voluntario" | "func";

interface JwtPayload {
  id?: number | string;
  tipo?: string;
  iat?: number;
  exp?: number;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Função para decodificar o token JWT e extrair informações do usuário e perfil
function decodificarToken(token: string): JwtPayload | null {
  try {
    const partes = token.split(".");
    if (partes.length < 2) return null;
    const base64Url = partes[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Determina para qual rota redirecionar conforme o tipo de usuário cadastrado no banco
function obterRotaRedirecionamento(tipo?: string): string {
  if (!tipo) return "/";
  const tipoNormalizado = tipo.toLowerCase().trim();
  if (
    tipoNormalizado === "adm" ||
    tipoNormalizado === "admin" ||
    tipoNormalizado === "administrador"
  ) {
    return "/dashboard/admin";
  }
  if (
    tipoNormalizado === "func" ||
    tipoNormalizado === "colaborador" ||
    tipoNormalizado === "funcionario"
  ) {
    return "/dashboard/colaborador";
  }
  if (tipoNormalizado === "voluntario") {
    return "/dashboard/voluntario";
  }
  return "/";
}

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
    tipo: "voluntario" as TipoPerfil,
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
      const tokenArmazenado = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (tokenArmazenado) {
        headers["Authorization"] = `Bearer ${tokenArmazenado}`;
      }

      const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: login.email.trim(),
          senha: login.senha,
        }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            dados.message ||
            "Não foi possível entrar. Verifique suas credenciais.",
        );
      }

      if (dados.token) {
        localStorage.setItem("token", dados.token);

        // Decodifica os dados salvos no token para identificar o tipo do usuário (admin/func/voluntario)
        const payload = decodificarToken(dados.token);
        const tipoUsuario = payload?.tipo || "voluntario";
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            id: payload?.id,
            tipo: tipoUsuario,
            email: login.email.trim(),
          }),
        );

        const destino = obterRotaRedirecionamento(tipoUsuario);

        setMensagem({
          tipo: "sucesso",
          texto: "Login realizado com sucesso! Redirecionando...",
        });

        window.setTimeout(() => {
          window.location.assign(destino);
        }, 700);
      } else {
        setMensagem({
          tipo: "sucesso",
          texto: "Login realizado com sucesso. Redirecionando...",
        });
        window.setTimeout(() => {
          window.location.assign("/");
        }, 700);
      }
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível conectar ao servidor. Verifique se o backend está em execução.";
      setMensagem({ tipo: "erro", texto: mensagemErro });
    } finally {
      setCarregando(false);
    }
  };

  const enviarCadastro = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !cadastro.nome.trim() ||
      !cadastro.email.trim() ||
      !cadastro.senha ||
      !cadastro.telefone.trim()
    ) {
      setMensagem({
        tipo: "erro",
        texto:
          "Preencha nome, e-mail, senha e telefone para concluir o cadastro.",
      });
      return;
    }

    if (!validarEmail(cadastro.email.trim())) {
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
          nome: cadastro.nome.trim(),
          email: cadastro.email.trim().toLowerCase(),
          senha: cadastro.senha,
          end: cadastro.end.trim() || "",
          cep: cadastro.cep.trim() || "",
          tel: cadastro.telefone.trim(),
          tipo: cadastro.tipo,
          aniversario: cadastro.aniversario || null,
          sobre: cadastro.sobre.trim() || "",
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
          "Cadastro realizado com sucesso! Agora você pode entrar com suas credenciais.",
      });
      setModo("login");
      setLogin({ email: cadastro.email.trim(), senha: cadastro.senha });
      setCadastro({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        telefone: "",
        end: "",
        cep: "",
        tipo: "voluntario",
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

    if (!recuperar.email.trim()) {
      setMensagem({
        tipo: "erro",
        texto: "Informe o e-mail para receber ajuda de acesso.",
      });
      return;
    }

    if (!validarEmail(recuperar.email.trim())) {
      setMensagem({ tipo: "erro", texto: "Digite um e-mail válido." });
      return;
    }

    setCarregando(true);
    setMensagem({
      tipo: "info",
      texto:
        "Se esse e-mail estiver cadastrado, a equipe enviará orientações de recuperação.",
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
          <p>Acesso para voluntários, colaboradores e equipe da ONG.</p>
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
              onClick={() => {
                setModo(item.id as ViewMode);
                setMensagem(null);
              }}
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
                autoComplete="email"
                value={login.email}
                onChange={(event) =>
                  setLogin({ ...login, email: event.target.value })
                }
                placeholder="seu@email.com"
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                autoComplete="current-password"
                value={login.senha}
                onChange={(event) =>
                  setLogin({ ...login, senha: event.target.value })
                }
                placeholder="••••••••"
                required
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
              Nome completo *
              <input
                type="text"
                autoComplete="name"
                value={cadastro.nome}
                onChange={(event) =>
                  setCadastro({ ...cadastro, nome: event.target.value })
                }
                placeholder="Seu nome completo"
                required
              />
            </label>

            <div className="login-form__row">
              <label>
                E-mail *
                <input
                  type="email"
                  autoComplete="email"
                  value={cadastro.email}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, email: event.target.value })
                  }
                  placeholder="seu@email.com"
                  required
                />
              </label>

              <label>
                Telefone *
                <input
                  type="tel"
                  autoComplete="tel"
                  value={cadastro.telefone}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, telefone: event.target.value })
                  }
                  placeholder="(19) 99999-9999"
                  required
                />
              </label>
            </div>

            <div className="login-form__row">
              <label>
                Tipo de perfil *
                <select
                  value={cadastro.tipo}
                  onChange={(event) =>
                    setCadastro({
                      ...cadastro,
                      tipo: event.target.value as TipoPerfil,
                    })
                  }
                >
                  <option value="voluntario">Voluntário(a)</option>
                  <option value="func">Colaborador(a) / Funcionário(a)</option>
                </select>
              </label>

              <label>
                Data de nascimento
                <input
                  type="date"
                  value={cadastro.aniversario}
                  onChange={(event) =>
                    setCadastro({
                      ...cadastro,
                      aniversario: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="login-form__row">
              <label>
                Senha *
                <input
                  type="password"
                  autoComplete="new-password"
                  value={cadastro.senha}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, senha: event.target.value })
                  }
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </label>

              <label>
                Confirmar senha *
                <input
                  type="password"
                  autoComplete="new-password"
                  value={cadastro.confirmarSenha}
                  onChange={(event) =>
                    setCadastro({
                      ...cadastro,
                      confirmarSenha: event.target.value,
                    })
                  }
                  placeholder="Repita a senha"
                  required
                />
              </label>
            </div>

            <div className="login-form__row">
              <label>
                Endereço
                <input
                  type="text"
                  autoComplete="street-address"
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
                  autoComplete="postal-code"
                  value={cadastro.cep}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, cep: event.target.value })
                  }
                  placeholder="13000-000"
                />
              </label>
            </div>

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
                autoComplete="email"
                value={recuperar.email}
                onChange={(event) =>
                  setRecuperar({ email: event.target.value })
                }
                placeholder="seu@email.com"
                required
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
