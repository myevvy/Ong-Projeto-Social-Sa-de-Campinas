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

export default { verificaToken };
