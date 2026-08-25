import { useEffect, useState } from "react";
import type { UsuarioAutenticado } from "../types/auth";
import LoginPage from "../pages/Login/LoginPage";

type Route = "/login";

function getCurrentRoute(): Route {
  return "/login";
}

export default function AppRoutes() {
  const [route, setRoute] = useState<Route>(getCurrentRoute);
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);

  useEffect(() => {
    if (window.location.pathname !== "/login") {
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

  if (usuario) {
    return (
      <main>
        <h1>Olá, {usuario.nome}!</h1>
        <p>Você está autenticado no sistema.</p>
      </main>
    );
  }

  return route === "/login" ? <LoginPage onLoginSuccess={setUsuario} /> : null;
}
