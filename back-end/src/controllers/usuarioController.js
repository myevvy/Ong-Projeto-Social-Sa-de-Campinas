import userModel from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verificaIdade from '../utils/verificarIdade.js'

const cadastro = async (req, res) => {
  const { email, senha, tipo } = req.body;
  const usuario = await userModel.buscarPorEmail(email);
  if (usuario) {
    return res.status(400).json({ mensagem: "Usuário já cadastrado!" });
  }

  if(tipo === "func"){
    const idade = verificaIdade(req.body.aniversario);

    if(idade < 18){
      return res.status(403).json({mensagem: "Você deve ser maior de idade para voluntariar!"});
    }
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const dados = { ...req.body, senha: senhaHash };

  const idUser = await userModel.postUserM(dados);

  const token = jwt.sign({ id: idUser, tipo }, process.env.ASSINATURA_TOKEN, {
    expiresIn: "3d",
  });

  return res.status(201).json({
    mensagem: "Cadastro realizado com sucesso",
    token,
  });
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await userModel.buscarPorEmail(email);
    if (!usuario)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const confereSenha = await bcrypt.compare(senha, usuario.senha_usuario);

    if (!confereSenha)
      return res.status(401).json({ mensagem: "Email ou senha incorretos!" });

    const token = jwt.sign(
      { id: usuario.ID_usuario, tipo: usuario.tipo_usuario },
      process.env.ASSINATURA_TOKEN,
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao realizar login.",
      error: error.message,
    });
  }
};

export default { cadastro, login };
