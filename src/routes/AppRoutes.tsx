import { useEffect, useState } from "react";
import type { UsuarioAutenticado } from "../types/auth";
import type { DashboardColaboradorData } from "../types/dashboard";
import DashboardColaborador from "../pages/DashboardColaborador/DashboardColaborador";
import LoginPage from "../pages/Login/LoginPage";

type Route = "/login" | "/dashboard/colaborador";

const DADOS_PREVIEW: DashboardColaboradorData = {
  colaborador: { nome: "Marina Oliveira" },
  estoque: {
    totalMedicamentos: 248,
    proximosVencimento: 12,
    vencidos: 3,
    estoqueBaixo: 8,
  },
  doacoes: { valorTotalMes: 4230.5, quantidadeMes: 27 },
  proximasAcoes: [
    {
      id: "preview-1",
      titulo: "Triagem e organização do estoque",
      data: "2026-09-14",
      voluntariosInscritos: 6,
    },
    {
      id: "preview-2",
      titulo: "Entrega de medicamentos",
      data: "2026-09-21",
      voluntariosInscritos: 3,
    },
  ],
};

function getCurrentRoute(): Route {
  return window.location.pathname === "/dashboard/colaborador"
    ? "/dashboard/colaborador"
    : "/login";
}

export default function AppRoutes() {
  const [route, setRoute] = useState<Route>(getCurrentRoute);
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const modoPreview =
    new URLSearchParams(window.location.search).get("preview") === "true";

  useEffect(() => {
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/dashboard/colaborador"
    ) {
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  useEffect(() => {
    function handlePopState() {
      setRoute(getCurrentRoute());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleLoginSuccess(usuarioAutenticado: UsuarioAutenticado) {
    setUsuario(usuarioAutenticado);

    if (usuarioAutenticado.tipoUsuario === "colaborador") {
      window.history.pushState({}, "", "/dashboard/colaborador");
      setRoute("/dashboard/colaborador");
    }
  }

  if (
    route === "/dashboard/colaborador" &&
    (usuario?.tipoUsuario === "colaborador" || modoPreview)
  ) {
    return (
      <DashboardColaborador
        dadosIniciais={modoPreview ? DADOS_PREVIEW : undefined}
      />
    );
  }

  if (usuario) {
    return (
      <main>
        <h1>Olá, {usuario.nome}!</h1>
        <p>Você está autenticado no sistema.</p>
      </main>
    );
  }

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}
