// src/types/auth.ts
// Tipos compartilhados entre o front (React) e o contrato esperado do back (Node + MySQL).
// Combine estes tipos com sua colega antes dela implementar as rotas.

export type TipoUsuario = "voluntario" | "colaborador";

export interface LoginCredentials {
  email: string;
  senha: string;
  tipoUsuario: TipoUsuario;
}

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
  // Ex.: "gestao_estoque", "financeiro" — opcional, útil se colaboradores tiverem permissões distintas
  permissoes?: string[];
}

export interface LoginResponse {
  usuario: UsuarioAutenticado;
  mensagem?: string;
}

export interface ApiErrorPayload {
  mensagem: string;
  codigo?: "CREDENCIAIS_INVALIDAS" | "USUARIO_NAO_ENCONTRADO" | "MUITAS_TENTATIVAS" | "ERRO_INTERNO";
}
