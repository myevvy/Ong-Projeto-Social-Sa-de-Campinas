import { useEffect, useState } from "react";
import type { DashboardColaboradorData } from "../types/dashboard";
import DashboardColaborador from "../pages/DashboardColaborador/DashboardColaborador";
import DashboardMedicamentos, {
  type MedicamentosProps,
} from "../pages/DashboardMedicamentos/DashboardMedicamentos";
import DashboardDoacoes from "../pages/DashboardDoacoes/DashboardDoacoes";
import DashboardAdmin from "../pages/DashboardAdmin/DashboardAdmin";
import DashboardVoluntario from "../pages/DashboardVoluntario/DashboardVoluntario";

import Home from "../pages/Home/Home";
import LoginPage from "../pages/Login/LoginPage";
import Eventos from "../pages/Eventos/eventos";
import Sobre from "../pages/Sobre/sobre";

type Route =
  | "/login"
  | "/"
  | "/login"
  | "/eventos"
  | "/sobre"


  | "/dashboard/colaborador"
  | "/dashboard/medicamentos"
  | "/dashboard/doacoes"
  | "/dashboard/admin"
  | "/dashboard/voluntario";

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
  if (window.location.pathname === "/") {
    return "/";
  }
  if (window.location.pathname === "/eventos") {
    return "/eventos";
  }
  if (window.location.pathname === "/sobre") {
    return "/sobre";
  }
  if (window.location.pathname === "/login") {
    return "/login";
  }
  if (window.location.pathname === "/dashboard/colaborador") {
    return "/dashboard/colaborador";
  }
  if (window.location.pathname === "/dashboard/medicamentos") {
    return "/dashboard/medicamentos";
  }
  if (window.location.pathname === "/dashboard/doacoes") {
    return "/dashboard/doacoes";
  }
  if (window.location.pathname === "/dashboard/admin") {
    return "/dashboard/admin";
  }
  if (window.location.pathname === "/dashboard/voluntario") {
    return "/dashboard/voluntario";
  }
  return "/";
}

export default function AppRoutes() {
  const [route, setRoute] = useState<Route>(getCurrentRoute);

  useEffect(() => {
    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/eventos" &&
      window.location.pathname !== "/sobre" &&
      window.location.pathname !== "/dashboard/colaborador" &&
      window.location.pathname !== "/dashboard/medicamentos" &&
      window.location.pathname !== "/dashboard/doacoes" &&
      window.location.pathname !== "/dashboard/admin" &&
      window.location.pathname !== "/dashboard/voluntario"
    ) {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    function handlePopState() {
      setRoute(getCurrentRoute());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (route === "/") {
    return <Home />;
  }

  if (route === "/login") {
    return <LoginPage />;
  }

  if (route === "/eventos") {
    return <Eventos />;
  }
  if (route === "/sobre") {
    return <Sobre />;
  }
  if (route === "/dashboard/colaborador") {
    return <DashboardColaborador dadosIniciais={DADOS_PREVIEW} />;
  }

  if (route === "/dashboard/doacoes") {
    return <DashboardDoacoes />;
  }

  if (route === "/dashboard/medicamentos") {
    return (
      <DashboardMedicamentos
        medicamentosIniciais={DADOS_MEDICAMENTOS_PREVIEW}
      />
    );
  }

  if (route === "/dashboard/admin") {
    return <DashboardAdmin />;
  }

  if (route === "/dashboard/voluntario") {
    return <DashboardVoluntario />;
  }

  return <Home />;
}
