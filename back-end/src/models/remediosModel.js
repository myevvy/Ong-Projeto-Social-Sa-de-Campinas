import connection from "./connection.js";

// O valor de apresentacao vai ser um select com as opcoes comprimido
// injetável, pomada, xarope, soluções, injetáveis e géiss

// Além do estoque disponível, a plataforma permitiria manter
// uma lista dos medicamentos e insumos em falta ou com baixo estoque. 
// Essa lista poderia ser compartilhada com parceiros e doadores para facilitar campanhas de arrecadação
// direcionadas às reais necessidades da ONG.

// Pesquisa rápida Busca por nome do medicamento. 
// Busca por categoria.
// Filtros por validade,
// quantidade ou disponibilidade. 

// Pesquisa rápida Busca por nome do medicamento. 
// Busca por categoria.
// Filtros por validade,
// quantidade ou disponibilidade. 

const getRemedios = async () => {
  const [remediosBD] = await connection.execute("SELECT * FROM remedio WHERE status = true");
  const remedios = remediosBD.map((remedio) =>{
    if(new Date(remedio.data_validade) < new Date()){
      remedio.vencido = true;
    }
    return remedio;
  });

  return remedios;
};

const postRemedio = async (remedio) => {
  const { nome, apresentacao, quantidade, data, lote, armazenamento, user_add } =
    remedio;
  const query =
    "INSERT INTO remedio(nome_remedio, apresentacao, quantidade, data_validade, lote, local_armazenamento, usuario_adicionou) VALUES(?, ?, ?, ?, ?, ?, ?)";
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

const putRemedio = async (remedio, idRemedio) => {
  const { nome, apresentacao, quantidade, data, lote, armazenamento, funcionario_id } =
    remedio;
  const query =
    `UPDATE remedio SET nome_remedio = ?, apresentacao = ?, quantidade = ?, data_validade = ?, lote = ?, 
    local_armazenamento = ?, func_alterou = ? WHERE ID_remedio = ?`;
  const resposta = await connection.execute(query, [
    nome,
    apresentacao,
    quantidade,
    data,
    lote,
    armazenamento,
    funcionario_id,
    idRemedio
  ]);
  return resposta;
};

const putQuantidadeRemedio = async (remedio, idRemedio) => {
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

const deleteRemedio = async (idRemedio) => {
  const resposta = await connection.execute("UPDATE remedio SET status = false WHERE ID_remedio = ?", [idRemedio]);
  return resposta;
};

export default { getRemedios, postRemedio, putRemedio, deleteRemedio };

