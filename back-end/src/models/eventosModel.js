import connection from "./connection.js";

const getEventoM = async ()=>{
  connection.execute("UPDATE evento SET status = false WHERE data_evento < CURDATE();");
  const [eventoAtivo] = await connection.execute("SELECT * FROM evento WHERE status = true");
  return eventoAtivo;
}

const buscarPorNome = async (nome)=>{
    const [evento] = await connection.execute("SELECT * FROM evento WHERE nome_evento = ? AND status= ?", [nome, true]);
    return evento[0];
}

const postEventoM = async (evento) => {
  const { nome, data, localizacao, desc} =
    evento;
  const query =
    "INSERT INTO evento(nome_evento, data_evento, localizacao, desc_evento) VALUES(?, ?, ?, ?)";
  const [resposta] = await connection.execute(query, [
    nome,
    data,
    localizacao,
    desc
  ]);
  return resposta.insertId;
};

const putEventoM = async (eventoNovo, idEvento) => {
  const { nome, data, localizacao, desc, status } = eventoNovo;
  const query = `UPDATE evento SET nome_evento = ?, data_evento = ?, localizacao = ?, desc_evento = ?, status = ? WHERE ID_evento = ?`;

  const resposta = await connection.execute(query, [
    nome,
    data,
    localizacao,
    desc,
    status,
    idEvento
  ]);

  return resposta.affectedRows;
};

const deleteEventoM = async (idEvento) => {
  const [resposta] = await connection.execute(
    "UPDATE evento SET status = false WHERE ID_evento = ?",
    [idEvento]
  );
  return resposta.affectedRows;
};

export default { postEventoM, buscarPorNome, getEventoM, putEventoM, deleteEventoM };
