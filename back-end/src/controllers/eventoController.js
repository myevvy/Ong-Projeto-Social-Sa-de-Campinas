import eventoModel from "../models/eventosModel.js";

const getEventoC = async (_req, res) => {
  const resposta = await eventoModel.getEventoM();
  return res.json(resposta);
};

const postEventoC = async (req, res) => {
  const existeEvento = await eventoModel.buscarPorNome(req.body.nome);
  if (existeEvento) {
    return res.json({ mensagem: "Esse evento já foi cadastrado!" });
  }
  const resposta = await eventoModel.postEventoM(req.body);
  return res.json({ idEvento: resposta });
};

const putEventoC = async (req, res) => {
  const idEvento = req.params.id;
  try {
    const resposta = await eventoModel.putEventoM(req.body, idEvento);

    if (resposta !== 0) {
      return res.status(200).json({ mensagem: "Evento alterado com sucesso!" });
    }

    return res.status(404).json({ mensagem: "Evento não encontrado." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteUsuarioC = async (req, res) => {
  try {
    const resposta = await eventoModel.deleteEventoM(req.params.id);

    if (resposta !== 0) {
      return res.status(200).json({ mensagem: "Evento desativado com sucesso!" });
    }

    return res.status(404).json({ mensagem: "Evento não encontrado." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro ao desativar evento." });
  }
};

export default { postEventoC, getEventoC, putEventoC, deleteUsuarioC };
