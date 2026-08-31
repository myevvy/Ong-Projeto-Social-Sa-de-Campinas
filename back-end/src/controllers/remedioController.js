import remedioModel from '../models/remediosModel.js';

const getRemedioC = async (req, res)=>{
    const resposta = await remedioModel.getRemedios();
    res.json({mensagem: resposta});
}

const postRemedioC = async (req, res)=>{
    await remedioModel.postRemedio({...req.body,user_add: req.usuario.id});
    return res.status(200).json({mensagem: "Remédio cadastrado com sucesso!"});
}

const putRemedioC = async (req, res)=>{
    const idRemedio = req.params.id;
    await remedioModel.putRemedio({...req.body, funcionario_id: req.usuario.id}, idRemedio);
    return res.status(200).json({mensagem: "Remédio alterado com sucesso!"});
}

const deleteRemedioC = async (req, res)=>{
    const idRemedio = req.params.id;
    await remedioModel.deleteRemedio(idRemedio);
    return res.status(200).json({mensagem: "Remédio deletado com sucesso!"});
}

export default {getRemedioC, postRemedioC , putRemedioC, deleteRemedioC}