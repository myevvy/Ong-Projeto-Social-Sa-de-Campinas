import connection from "./connection.js";

const postRemedio = async (remedio) => {
  const { nome, apresentacao, quantidade, data, lote, armazenamento, id } =
    remedio;
  const query =
    "INSERT INTO usuarios(nome_remedio, apresentacao, quantidade, data_validade, lote, local_armazenamento, adm_adicionou) VALUES(?, ?, ?, ?, ?, ?, ?)";
  const resposta = await connection.execute(query, [
    nome,
    apresentacao,
    quantidade,
    data,
    lote,
    armazenamento,
    id,
  ]);
  return resposta.InsertID;
};

export default { postRemedio };
