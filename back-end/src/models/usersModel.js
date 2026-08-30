import connection from "./connection.js";

const getFuncM = async () => {
  const [funcionarios] = await connection.execute(
    "SELECT * FROM usuarios WHERE tipo_usuario = 'func' AND status = TRUE",
  );
  return funcionarios;
};

const postUserM = async (usuario) => {
  const { nome, email, senha, end, cep, tel, tipo, aniversario, sobre } =
    usuario;
  const query = `INSERT INTO usuarios(nome_usuario,
    email_usuario,
    senha_usuario,
    endereco_usuario,
    CEP_usuario,
    telefone_usuario,
    tipo_usuario,
    data_nasc,
    sobre_usuario) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const resposta = await connection.execute(query, [
    nome,
    email,
    senha,
    end,
    cep,
    tel,
    tipo,
    aniversario,
    sobre,
  ]);
  // o aniversario deve ser string e ANO/MES/DIA
  return resposta.insertId;
};

const buscarPorEmail = async (email) => {
  const [usuario] = await connection.execute(
    "SELECT * FROM usuarios WHERE email_usuario = ?",
    [email],
  );
  return usuario[0];
};

const buscarPorEmailNome = async (email, nome) => {
  const [usuario] = await connection.execute(
    "SELECT * FROM usuarios WHERE email_usuario = ? OR nome_usuario = ?",
    [email, nome],
  );
  return usuario[0];
};

const putFuncM = async (usuarioNovo, idFunc) => {
  const { nome, email, senha, end, cep, tel, tipo } = usuarioNovo;
  const query = `
    UPDATE usuarios 
    SET nome_usuario = ?,
        email_usuario = ?,
        senha_usuario = ?,
        endereco_usuario = ?,
        CEP_usuario = ?,
        telefone_usuario = ?,
        tipo_usuario = ?
    WHERE ID_usuario = ?
  `;

  const resposta = await connection.execute(query, [
    nome,
    email,
    senha,
    end,
    cep,
    tel,
    tipo,
    idFunc,
  ]);

  return resposta.affectedRows;
};

const deleteFuncM = async (idFuncionario) => {
  const [resposta] = await connection.execute(
    "UPDATE usuarios SET status = false WHERE ID_usuario = ?",
    [idFuncionario],
  );
  return resposta.affectedRows;
};

export default {
  postUserM,
  buscarPorEmail,
  buscarPorEmailNome,
  getFuncM,
  putFuncM,
  deleteFuncM,
};
