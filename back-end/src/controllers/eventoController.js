import eventoModel from "../models/eventosModel.js";

const getEventoC = async (req,res)=>{
  const resposta = await eventoModel.getEventoM();
  res.json(resposta);
}

const postEventoC = async (req, res) => {
  const existeEvento = await eventoModel.buscarPorNome(req.body.nome);
  if(existeEvento){
    return res.json({mensagem: "Esse evento já foi cadastrado!"});
  }
  const resposta = await eventoModel.postEventoM(req.body);
  return res.json({idEvento: resposta});
};

export default { postEventoC, getEventoC };
