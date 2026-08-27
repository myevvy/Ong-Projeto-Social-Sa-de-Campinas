import { useEffect, useState } from "react";
import { verificarSessao } from "../services/authService";
import type { UsuarioAutenticado } from "../types/auth";
import type { DashboardColaboradorData } from "../types/dashboard";
import DashboardColaborador from "../pages/DashboardColaborador/DashboardColaborador";
import DashboardMedicamentos, {
  type MedicamentosProps,
} from "../pages/DashboardMedicamentos/DashboardMedicamentos";
import DashboardDoacoes from "../pages/DashboardDoacoes/DashboardDoacoes";
import LoginPage from "../pages/Login/LoginPage";

type Route =
   "/login"
  | "/dashboard/colaborador"
  | "/dashboard/medicamentos"
  | "/dashboard/doacoes";

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

const DADOS_MEDICAMENTOS_PREVIEW: MedicamentosProps[] = [
  {
    nome: "Dipirona",
    quantidade: 20,
    veiculo: "Comprimido",
    viaAdm: "Oral",
    dose: 500,
    unidadeDose: "mg",
    validade: "2027-01-20",
  },
  {
    nome: "dipirona",
    quantidade: 15,
    veiculo: "Comprimido",
    viaAdm: "Oral",
    dose: 500,
    unidadeDose: "mg",
    validade: "2027-01-20",
  },
  {
    nome: "Dipirona",
    quantidade: 8,
    veiculo: "Comprimido",
    viaAdm: "Oral",
    dose: 500,
    unidadeDose: "mg",
    validade: "2028-04-10",
  },
  {
    nome: "Soro fisiológico",
    quantidade: 35,
    veiculo: "Líquido",
    viaAdm: "Intravenosa",
    dose: 0.9,
    unidadeDose: "mg/ml",
    validade: "2026-12-15",
  },
];

function getCurrentRoute(): Route {
  if (window.location.pathname === "/dashboard/colaborador") {
    return "/dashboard/colaborador";
  }
  if (window.location.pathname === "/dashboard/medicamentos") {
    return "/dashboard/medicamentos";
  }
  if (window.location.pathname === "/dashboard/doacoes") {
    return "/dashboard/doacoes";
  }
  return "/login";
}

export default function AppRoutes() {
  const modoPreview =
    new URLSearchParams(window.location.search).get("preview") === "true";
  const [route, setRoute] = useState<Route>(getCurrentRoute);
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [verificandoSessao, setVerificandoSessao] = useState(!modoPreview);

  useEffect(() => {
    if (modoPreview) {
      return;
    }

    let ativo = true;

    verificarSessao()
      .then((usuarioAutenticado) => {
        if (ativo) setUsuario(usuarioAutenticado);
      })
      .catch(() => {
        if (ativo) setUsuario(null);
      })
      .finally(() => {
        if (ativo) setVerificandoSessao(false);
      });

    return () => {
      ativo = false;
    };
  }, [modoPreview]);

  useEffect(() => {
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/dashboard/colaborador" &&
      window.location.pathname !== "/dashboard/medicamentos" &&
      window.location.pathname !== "/dashboard/doacoes"
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

  if (verificandoSessao) {
    return (
      <main>
        <p>Verificando sessão...</p>
      </main>
    );
  }

  if (
    route === "/dashboard/colaborador" &&
    (usuario?.tipoUsuario === "colaborador" || modoPreview)
  ) {
    return (
      <DashboardColaborador
        dadosIniciais={modoPreview ? DADOS_PREVIEW : undefined}
        usuario={usuario}
      />
    );
  }

  if (
    route === "/dashboard/doacoes" &&
    (usuario?.tipoUsuario === "colaborador" || modoPreview)
  ) {
    return <DashboardDoacoes />;
  }

  if (
    route === "/dashboard/medicamentos" &&
    (usuario?.tipoUsuario === "colaborador" || modoPreview)
  ) {
    return (
      <DashboardMedicamentos
        medicamentosIniciais={
          modoPreview ? DADOS_MEDICAMENTOS_PREVIEW : undefined
        }
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
