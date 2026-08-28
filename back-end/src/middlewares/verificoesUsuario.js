<<<<<<< HEAD
import jwt from "jsonwebtoken";

const verificaToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      mensagem: "Token não informado!",
    });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensagem: "Token inválido!",
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.ASSINATURA_TOKEN);
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
};

const verificaAdm = (req, res, next) => {
  if (req.usuario.tipo !== "adm") {
    return res.status(403).json({ mensagem: "Acesso restrito a administradores." });
  }
  next();
};

const verificaFunc = (req, res, next) => {
  if (req.usuario.tipo !== "adm") {
    return res.status(403).json({ mensagem: "Acesso restrito a administradores." });
  }
  next();
};

const verificaAdmFunc = (req, res, next) => {
  if (req.usuario.tipo !== "adm" && req.usuario.tipo !== "func") {
    return res.status(403).json({ mensagem: "Acesso restrito a administradores e funcionários." });
  }
  next();
};

export default { verificaToken, verificaAdm, verificaFunc, verificaAdmFunc };
=======
import jwt from "jsonwebtoken";

const verificaToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      mensagem: "Token não informado!",
    });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      mensagem: "Token inválido!",
    });
  }

  try {
    const usuario = jwt.verify(token, process.env.ASSINATURA_TOKEN);
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
};

const verificaAdm = (req, res, next) => {
  if (req.usuario.tipo !== "adm") {
    return res.status(403).json({ mensagem: "Acesso restrito a administradores." });
  }
  next();
};

const verificaFunc = (req, res, next) => {
  if (req.usuario.tipo !== "func") {
    return res.status(403).json({ mensagem: "Acesso restrito a funcionários." });
  }
  next();
};

export default { verificaToken, verificaAdm, verificaFunc };
>>>>>>> 243349fa0ecf6a0c470b6b76a51c056c34ebd974
