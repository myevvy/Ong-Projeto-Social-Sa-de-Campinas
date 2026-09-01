import { useEffect, useState } from "react";
import DashboardColaborador from "../pages/DashboardColaborador/DashboardColaborador";
import DashboardMedicamentos from "../pages/DashboardMedicamentos/DashboardMedicamentos";
import DashboardDoacoes from "../pages/DashboardDoacoes/DashboardDoacoes";
import DashboardAdmin from "../pages/DashboardAdmin/DashboardAdmin";
import DashboardVoluntario from "../pages/DashboardVoluntario/DashboardVoluntario";

import Home from "../pages/Home/Home";
import LoginPage from "../pages/Login/LoginPage";
import Eventos from "../pages/Eventos/eventos";
import Sobre from "../pages/Sobre/sobre";
import {
  obterSessaoUsuario,
  definirAlertaSeguranca,
  obterEConsumirAlertaSeguranca,
  type SessaoUsuario,
} from "../services/authService";
import { ShieldAlert, X } from "lucide-react";

type Route =
  | "/"
  | "/login"
  | "/eventos"
  | "/sobre"
  | "/dashboard/colaborador"
  | "/dashboard/medicamentos"
  | "/dashboard/doacoes"
  | "/dashboard/admin"
  | "/dashboard/voluntario";

function getCurrentRoute(): Route {
  const path = window.location.pathname;
  if (path === "/" || path === "") return "/";
  if (path === "/eventos") return "/eventos";
  if (path === "/sobre") return "/sobre";
  if (path === "/login") return "/login";
  if (path === "/dashboard/colaborador") return "/dashboard/colaborador";
  if (path === "/dashboard/medicamentos") return "/dashboard/medicamentos";
  if (path === "/dashboard/doacoes") return "/dashboard/doacoes";
  if (path === "/dashboard/admin") return "/dashboard/admin";
  if (path === "/dashboard/voluntario") return "/dashboard/voluntario";
  return "/";
}

function SecurityBanner({
  mensagem,
  onFechar,
}: {
  mensagem: string;
  onFechar: () => void;
}) {
  return (
    <div
      role="alert"
      className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-amber/30 bg-amber/15 px-4 py-3 font-body text-sm font-semibold text-black shadow-sm"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert size={18} className="shrink-0 text-amber" />
        <span>{mensagem}</span>
      </div>
      <button
        type="button"
        onClick={onFechar}
        className="rounded p-1 hover:bg-black/10"
        title="Fechar aviso"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default function AppRoutes() {
  const [route, setRoute] = useState<Route>(getCurrentRoute);
  const [sessao, setSessao] = useState<SessaoUsuario | null>(
    obterSessaoUsuario,
  );
  const [avisoSeguranca, setAvisoSeguranca] = useState<string | null>(() =>
    obterEConsumirAlertaSeguranca(),
  );

  useEffect(() => {
    function sincronizar() {
      setRoute(getCurrentRoute());
      setSessao(obterSessaoUsuario());
      const alerta = obterEConsumirAlertaSeguranca();
      if (alerta) {
        setAvisoSeguranca(alerta);
      }
    }

    window.addEventListener("popstate", sincronizar);
    window.addEventListener("ong_auth_change", sincronizar);
    window.addEventListener("ong_solicitacoes_atualizadas", sincronizar);
    window.addEventListener("storage", sincronizar);

    return () => {
      window.removeEventListener("popstate", sincronizar);
      window.removeEventListener("ong_auth_change", sincronizar);
      window.removeEventListener("ong_solicitacoes_atualizadas", sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  // Helper para redirecionar com sincronização de URL no navegador
  function redirecionar(destino: string, aviso?: string) {
    if (aviso) {
      definirAlertaSeguranca(aviso);
      setAvisoSeguranca(aviso);
    }
    window.history.replaceState({}, "", destino);
    setRoute(destino as Route);
  }

  // 1. Rotas públicas acessíveis para todos
  if (route === "/") {
    return <Home />;
  }

  if (route === "/eventos") {
    return <Eventos />;
  }

  if (route === "/sobre") {
    return <Sobre />;
  }

  if (route === "/login") {
    return <LoginPage />;
  }

  // 2. Proteção de Dashboard: Usuário NÃO logado tentando acessar /dashboard/*
  if (!sessao) {
    // Redireciona a URL para /login e informa o motivo
    definirAlertaSeguranca(
      "Acesso restrito. Faça login para acessar o painel.",
    );
    window.history.replaceState({}, "", "/login");
    return <LoginPage />;
  }

  // 3. Controle de Acesso Baseado em Papel (RBAC) para Usuários Autenticados:

  // CASO 1: Usuário VOLUNTÁRIO
  // Só pode acessar /dashboard/voluntario
  if (sessao.tipo === "voluntario") {
    if (route !== "/dashboard/voluntario") {
      redirecionar(
        "/dashboard/voluntario",
        "Acesso restrito: Como voluntário(a), seu acesso é exclusivo ao Painel do Voluntário.",
      );
    }
    return (
      <>
        {avisoSeguranca && (
          <SecurityBanner
            mensagem={avisoSeguranca}
            onFechar={() => setAvisoSeguranca(null)}
          />
        )}
        <DashboardVoluntario nome={sessao.nome || "Voluntário"} />
      </>
    );
  }

  // CASO 2: Usuário COLABORADOR
  // Pode acessar /dashboard/colaborador, /dashboard/medicamentos e /dashboard/doacoes
  if (sessao.tipo === "colaborador") {
    if (route === "/dashboard/admin" || route === "/dashboard/voluntario") {
      redirecionar(
        "/dashboard/colaborador",
        "Acesso restrito: Como colaborador(a), seu acesso é aos módulos operacionais do Painel do Colaborador.",
      );
    }

    const usuarioColab = {
      id: String(sessao.id),
      nome: sessao.nome,
      email: sessao.email,
      tipoUsuario: "colaborador" as const,
    };

    if (route === "/dashboard/medicamentos") {
      return (
        <>
          {avisoSeguranca && (
            <SecurityBanner
              mensagem={avisoSeguranca}
              onFechar={() => setAvisoSeguranca(null)}
            />
          )}
          <DashboardMedicamentos />
        </>
      );
    }

    if (route === "/dashboard/doacoes") {
      return (
        <>
          {avisoSeguranca && (
            <SecurityBanner
              mensagem={avisoSeguranca}
              onFechar={() => setAvisoSeguranca(null)}
            />
          )}
          <DashboardDoacoes usuario={usuarioColab} />
        </>
      );
    }

    return (
      <>
        {avisoSeguranca && (
          <SecurityBanner
            mensagem={avisoSeguranca}
            onFechar={() => setAvisoSeguranca(null)}
          />
        )}
        <DashboardColaborador usuario={usuarioColab} />
      </>
    );
  }

  // CASO 3: Usuário ADMINISTRADOR
  // Acesso à gestão central (/dashboard/admin), medicamentos e doações
  if (sessao.tipo === "admin") {
    if (route === "/dashboard/voluntario") {
      redirecionar("/dashboard/admin");
    }

    const usuarioAdmin = {
      id: String(sessao.id),
      nome: sessao.nome,
      email: sessao.email,
      tipoUsuario: "admin" as const,
    };

    if (route === "/dashboard/medicamentos") {
      return (
        <>
          {avisoSeguranca && (
            <SecurityBanner
              mensagem={avisoSeguranca}
              onFechar={() => setAvisoSeguranca(null)}
            />
          )}
          <DashboardMedicamentos />
        </>
      );
    }

    if (route === "/dashboard/doacoes") {
      return (
        <>
          {avisoSeguranca && (
            <SecurityBanner
              mensagem={avisoSeguranca}
              onFechar={() => setAvisoSeguranca(null)}
            />
          )}
          <DashboardDoacoes usuario={usuarioAdmin} />
        </>
      );
    }

    if (route === "/dashboard/colaborador") {
      return (
        <>
          {avisoSeguranca && (
            <SecurityBanner
              mensagem={avisoSeguranca}
              onFechar={() => setAvisoSeguranca(null)}
            />
          )}
          <DashboardColaborador usuario={usuarioAdmin} />
        </>
      );
    }

    return (
      <>
        {avisoSeguranca && (
          <SecurityBanner
            mensagem={avisoSeguranca}
            onFechar={() => setAvisoSeguranca(null)}
          />
        )}
        <DashboardAdmin />
      </>
    );
  }

  return <Home />;
}
