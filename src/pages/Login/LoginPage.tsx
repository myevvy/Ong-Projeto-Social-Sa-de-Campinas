import { useState } from "react";
import {
  verificarStatusUsuario,
  adicionarSolicitacao,
  limparSessaoUsuario,
  obterEConsumirAlertaSeguranca,
  normalizarTipoUsuario
} from "../../services/authService";

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
  if (!tipo) return "/dashboard/voluntario";
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
  return "/dashboard/voluntario";
}

const INPUT_CLASS =
  "w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 font-body text-sm text-black placeholder:text-ink-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
const LABEL_CLASS =
  "flex flex-col gap-1.5 font-body text-sm font-bold text-black";

export default function LoginPage() {
  const [modo, setModo] = useState<ViewMode>("login");
  const [carregando, setCarregando] = useState(false);
  // FIX: lê o alerta de segurança já na inicialização do state (mesmo padrão
  // usado em AppRoutes.tsx), em vez de um useEffect que chama setState
  // sincronamente logo após a montagem.
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro" | "info";
    texto: string;
  } | null>(() => {
    const alerta = obterEConsumirAlertaSeguranca();
    return alerta ? { tipo: "erro", texto: alerta } : null;
  });

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

    const emailNormalizado = login.email.trim().toLowerCase();

    if (!emailNormalizado || !login.senha) {
      setMensagem({
        tipo: "erro",
        texto: "Informe o e-mail e a senha para entrar.",
      });
      return;
    }

    if (!validarEmail(emailNormalizado)) {
      setMensagem({ tipo: "erro", texto: "O e-mail informado não é válido." });
      return;
    }

    // 1. Verificação prévia do status de aprovação pelo Administrador
    // FIX: o bloqueio abaixo só vale para quem TEM registro local
    // (checagemAcesso.encontrado). Antes, verificarStatusUsuario devolvia
    // status "aceito" para qualquer e-mail sem registro local, então essa
    // checagem não bloqueava ninguém desconhecido — mas se a lógica dela for
    // revista no futuro, o "encontrado" aqui evita bloquear por engano um
    // usuário real do backend que simplesmente ainda não está na lista local.
    const checagemAcesso = verificarStatusUsuario(emailNormalizado);

    if (checagemAcesso.encontrado && checagemAcesso.status === "pendente") {
      setMensagem({
        tipo: "erro",
        texto:
          "Sua solicitação de acesso está pendente de aprovação pela administração. Aguarde a validação do seu perfil.",
      });
      return;
    }

    if (checagemAcesso.encontrado && checagemAcesso.status === "recusado") {
      limparSessaoUsuario();
      setMensagem({
        tipo: "erro",
        texto:
          "Sua solicitação de acesso foi recusada pela administração. Entre em contato com a ONG para mais informações.",
      });
      return;
    }

    setCarregando(true);
    setMensagem(null);

    try {
      let loginSucesso = false;
      let tokenFinal = "";
      let payloadFinal: JwtPayload | null = null;

      try {
        const resposta = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailNormalizado,
            senha: login.senha,
          }),
        });

        const dados = await resposta.json().catch(() => ({}));

        if (resposta.ok && dados.token) {
          loginSucesso = true;
          tokenFinal = dados.token;
          payloadFinal = decodificarToken(dados.token);
        } else if (
          resposta.status === 401 ||
          resposta.status === 400 ||
          resposta.status === 404
        ) {
          throw new Error(
            dados.mensagem ||
              dados.message ||
              (resposta.status === 404
                ? "Usuário não encontrado."
                : "E-mail ou senha incorretos."),
          );
        } else {
          // Backend online mas sem token retornado
          if (checagemAcesso.encontrado && checagemAcesso.status === "aceito") {
            loginSucesso = true;
            tokenFinal = "auth_session_" + Date.now();
          } else {
            throw new Error("Acesso não autorizado.");
          }
        }
      } catch (fetchErr) {
        // FIX: "Failed to fetch" é a mensagem específica do Chrome/V8 para
        // falha de rede — no Firefox e no Safari a mensagem é outra, então
        // essa comparação de string não detectava o modo offline em todo
        // navegador. `fetch` sempre lança um TypeError quando não consegue
        // se conectar, então checar isso é confiável em qualquer navegador.
        const isNetworkError = fetchErr instanceof TypeError;

        if (!isNetworkError) {
          throw fetchErr;
        }

        // Se o servidor backend estiver offline (modo demonstração local/mock),
        // só libera acesso a quem já tem registro local aprovado.
        if (checagemAcesso.encontrado && checagemAcesso.status === "aceito") {
          loginSucesso = true;
          tokenFinal = "auth_session_" + Date.now();
        } else {
          throw new Error("Não foi possível conectar ao servidor. Tente novamente em instantes.", {
            cause: fetchErr,
          });
        }
      }

      if (loginSucesso && tokenFinal) {
        // Armazena o token JWT imediatamente para evitar qualquer chamada desautenticada
        localStorage.setItem("token", tokenFinal);

        // FIX: removida a heurística que promovia a admin qualquer e-mail
        // contendo a substring "adm" (ex.: "adamteste@gmail.com",
        // "administrativo@x.com"). Isso rodava depois de QUALQUER login bem-
        // sucedido, inclusive contra o backend real, então um usuário comum
        // com esse e-mail virava admin no front mesmo o JWT dizendo outro
        // tipo. O tipo agora vem só do JWT (fonte de verdade, checado no
        // backend) ou, na ausência dele (sessão local de demonstração), do
        // registro de aprovação local.
        const tipoUsuario =
          payloadFinal?.tipo || checagemAcesso.tipo || "voluntario";

        const tipoFinal = normalizarTipoUsuario(tipoUsuario);

        const nomeUsuario =
          checagemAcesso.nome ||
          (tipoFinal === "admin"
            ? "Administrador"
            : tipoFinal === "colaborador"
              ? "Colaborador"
              : "Voluntário");

        localStorage.setItem(
          "usuario",
          JSON.stringify({
            id: payloadFinal?.id ?? checagemAcesso.id ?? Date.now(),
            tipo: tipoFinal,
            email: emailNormalizado,
            nome: nomeUsuario,
          }),
        );

        window.dispatchEvent(new CustomEvent("ong_auth_change"));

        const destino = obterRotaRedirecionamento(tipoFinal);

        setMensagem({
          tipo: "sucesso",
          texto: "Login realizado com sucesso! Redirecionando...",
        });

        window.setTimeout(() => {
          window.history.pushState({}, "", destino);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }, 300);
      }
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível realizar o login. Tente novamente.";
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

      // Adiciona o novo usuário na fila de solicitações do Administrador com status 'pendente'
      adicionarSolicitacao({
        nome: cadastro.nome,
        email: cadastro.email,
        telefone: cadastro.telefone,
        tipo: cadastro.tipo,
        sobre: cadastro.sobre,
        endereco: cadastro.end,
        cep: cadastro.cep,
      });

      setMensagem({
        tipo: "sucesso",
        texto:
          "Cadastro realizado com sucesso! Sua solicitação está pendente de aprovação pela administração.",
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

  const mensagemClasses = {
    sucesso: "bg-volunteer-soft text-volunteer",
    erro: "bg-error/10 text-error",
    info: "bg-gold/10 text-[#8a5620]",
  } as const;

  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-4 py-10 sm:px-6">
      <div
        aria-live="polite"
        className={`w-full rounded-2xl border border-black/10 bg-white p-6 sm:p-8 lg:p-12 ${
          modo === "cadastro"
            ? "max-w-[750px] lg:max-w-[880px]"
            : "max-w-[440px] lg:max-w-[520px]"
        }`}
      >
        <div className="mb-6 flex flex-col gap-1.5 text-center">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gold">
            Projeto Social Saúde Campinas
          </span>
          <h1 className="m-0 font-display text-2xl font-semibold text-black sm:text-[28px]">
            Área de acesso
          </h1>
          <p className="m-0 font-body text-sm text-ink-soft">
            Acesso para voluntários, colaboradores e equipe da ONG.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Opções de acesso"
          className="mb-6 flex gap-1 rounded-pill bg-black/5 p-1"
        >
          {[
            { id: "login", label: "Login" },
            { id: "cadastro", label: "Cadastro" },
            { id: "recuperar", label: "Recuperar" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={modo === item.id}
              onClick={() => {
                setModo(item.id as ViewMode);
                setMensagem(null);
              }}
              className={`min-h-9 flex-1 rounded-pill px-2 font-body text-[13px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                modo === item.id
                  ? "bg-black text-white"
                  : "text-ink-soft hover:bg-black/5 hover:text-black"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mensagem && (
          <div
            role={mensagem.tipo === "erro" ? "alert" : "status"}
            className={`mb-5 rounded-xl px-4 py-3 font-body text-sm ${mensagemClasses[mensagem.tipo]}`}
          >
            {mensagem.texto}
          </div>
        )}

        {modo === "login" && (
          <form className="flex flex-col gap-4" onSubmit={enviarLogin}>
            <label className={LABEL_CLASS}>
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
                className={INPUT_CLASS}
              />
            </label>

            <label className={LABEL_CLASS}>
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
                className={INPUT_CLASS}
              />
            </label>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 flex min-h-11 w-full items-center justify-center rounded-pill bg-black font-body text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        {modo === "cadastro" && (
          <form className="flex flex-col gap-4" onSubmit={enviarCadastro}>
            <label className={LABEL_CLASS}>
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
                className={INPUT_CLASS}
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
                Tipo de perfil *
                <select
                  value={cadastro.tipo}
                  onChange={(event) =>
                    setCadastro({
                      ...cadastro,
                      tipo: event.target.value as TipoPerfil,
                    })
                  }
                  className={INPUT_CLASS}
                >
                  <option value="voluntario">Voluntário(a)</option>
                  <option value="func">Colaborador(a) / Funcionário(a)</option>
                </select>
              </label>

              <label className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
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
                  className={INPUT_CLASS}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
                Endereço
                <input
                  type="text"
                  autoComplete="street-address"
                  value={cadastro.end}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, end: event.target.value })
                  }
                  placeholder="Rua, número e bairro"
                  className={INPUT_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                CEP
                <input
                  type="text"
                  autoComplete="postal-code"
                  value={cadastro.cep}
                  onChange={(event) =>
                    setCadastro({ ...cadastro, cep: event.target.value })
                  }
                  placeholder="13000-000"
                  className={INPUT_CLASS}
                />
              </label>
            </div>

            <label className={LABEL_CLASS}>
              Sobre você
              <textarea
                value={cadastro.sobre}
                onChange={(event) =>
                  setCadastro({ ...cadastro, sobre: event.target.value })
                }
                placeholder="Conte um pouco sobre sua disponibilidade ou interesse na ONG"
                rows={4}
                className={INPUT_CLASS}
              />
            </label>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 flex min-h-11 w-full items-center justify-center rounded-pill bg-amber font-body text-sm font-bold text-black transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        )}

        {modo === "recuperar" && (
          <form className="flex flex-col gap-4" onSubmit={enviarRecuperacao}>
            <label className={LABEL_CLASS}>
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
                className={INPUT_CLASS}
              />
            </label>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 flex min-h-11 w-full items-center justify-center rounded-pill bg-black font-body text-sm font-bold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {carregando ? "Enviando..." : "Solicitar ajuda"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}