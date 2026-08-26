import connection from "./connection.js";

const postUserM = async (usuario) => {
  const { nome, email, senha, end, cep, tel, tipo } = usuario;
  const query =
    "INSERT INTO usuarios(nome_usuario, email_usuario, senha_usuario, endereco_usuario, CEP_usuario, telefone_usuario, tipo_usuario) VALUES(?, ?, ?, ?, ?, ?, ?)";
  const resposta = await connection.execute(query, [
    nome,
    email,
    senha,
    end,
    cep,
    tel,
    tipo
  ]);
  return resposta.insertId;
};

const buscarPorEmail = async (email) => {
  const [usuario] = await connection.execute(
    "SELECT * FROM usuarios WHERE email_usuario = ?",
    [email],
  );
  return usuario[0];
};

export default { postUserM, buscarPorEmail };
