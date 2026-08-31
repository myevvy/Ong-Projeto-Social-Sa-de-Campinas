import connection from "./connection.js";

// O valor de apresentacao vai ser um select com as opcoes comprimido
// injetável, pomada, xarope, soluções, injetáveis e géis

// Além do estoque disponível, a plataforma permitiria manter
// uma lista dos medicamentos e insumos em falta ou com baixo estoque.
// Essa lista poderia ser compartilhada com parceiros e doadores para facilitar campanhas de arrecadação
// direcionadas às reais necessidades da ONG.

// Pesquisa rápida Busca por nome do medicamento.
// Busca por categoria.
// Filtros por validade,
// quantidade ou disponibilidade.

const getRemedios = async () => {
  const [remediosBD] = await connection.execute(
    "SELECT * FROM remedio WHERE status = true",
  );
  const remedios = remediosBD.map((remedio) => {
    if (new Date(remedio.data_validade) < new Date()) {
      remedio.vencido = true;
    }
    return remedio;
  });

  return remedios;
};

const getRemediosID = async (idRemedio) => {
  const [remedio] = await connection.execute(
    "SELECT * FROM remedio WHERE ID_remedio = ?",
    [idRemedio],
  );
  return remedio;
};

const postRemedio = async (remedio) => {
  const {
    nome,
    apresentacao,
    quantidade,
    data,
    lote,
    armazenamento,
    user_add,
  } = remedio;
  const query =
    `INSERT INTO remedio(nome_remedio, apresentacao, quantidade,
    data_validade, lote, local_armazenamento, usuario_adicionou) VALUES(?, ?, ?, ?, ?, ?, ?)`;
  const resposta = await connection.execute(query, [
    nome,
    apresentacao,
    quantidade,
    data,
    lote,
    armazenamento,
    user_add,
  ]);
  return resposta.InsertID;
};

const postRemedio_Func = async (idRemedio, idColaborador)=>{
  const query = `INSERT INTO remedio_usuario(ID_remedio, ID_colaborador, data_alteracao) VALUES (?, ?, NOW())`; 
  const resposta = await connection.execute(query, [idRemedio, idColaborador]);
  return resposta.affectedRows;
}

const putRemedio = async (remedio, idRemedio) => {
  const {
    nome,
    apresentacao,
    quantidade,
    data,
    lote,
    armazenamento,
    funcionario_id,
  } = remedio;

  const query = `UPDATE remedio SET nome_remedio = ?, apresentacao = ?, quantidade = ?, data_validade = ?, lote = ?, 
  local_armazenamento = ? WHERE ID_remedio = ?`;

  const [resposta] = await connection.execute(query, [
    nome,
    apresentacao,
    quantidade,
    data,
    lote,
    armazenamento,
    idRemedio,
  ]);

  await postRemedio_Func(idRemedio, funcionario_id);

  return resposta.affectedRows;
};

const putQuantidadeRemedio = async (quantidade, idFunc, idRemedio) => {
  const [resposta] = await connection.execute(
    "UPDATE remedio SET quantidade = ? WHERE ID_remedio = ?",
    [quantidade, idFunc, idRemedio],
  );

  await postRemedio_Func(idRemedio, idFunc);
  return resposta.affectedRows;
};

const deleteRemedio = async (idRemedio) => {
  const resposta = await connection.execute(
    "UPDATE remedio SET status = false WHERE ID_remedio = ?",
    [idRemedio],
  );
  return resposta;
};

export default {
  getRemedios,
  getRemediosID,
  postRemedio,
  putRemedio,
  putQuantidadeRemedio,
  deleteRemedio,
};
