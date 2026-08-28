import express from "express";
const routes = express.Router();
import usuarioC from "./controllers/usuarioController.js";
import eventoC from "./controllers/eventoController.js";
// import remedioC from "./controllers/remediosController.js";
import middleware from './middlewares/verificoesUsuario.js'

routes.post("/cadastro", usuarioC.cadastro);

routes.post("/login",middleware.verificaToken ,usuarioC.login);

routes.get("/pagAdm", middleware.verificaToken ,middleware.verificaAdm, (req,res)=>{
    res.json({mensagem: "Acesso Permitido!", usuario: req.usuario});
}); //no front verificar se a resposta enviada pelo token é o certo

routes.get("/pagFunc", middleware.verificaToken ,middleware.verificaFunc, (req,res)=>{
    res.json({mensagem: "Acesso Permitido!", usuario: req.usuario});
}); //no front verificar se a resposta enviada pelo token é o certo

routes.post("/cadFuncionario", middleware.verificaToken ,middleware.verificaAdm ,usuarioC.cadastro);

routes.post("/cadEvento", middleware.verificaToken ,middleware.verificaAdmFunc ,eventoC.postEventoC);

routes.get("/eventos", middleware.verificaToken ,eventoC.getEventoC);


// routes.post("/cadRemedio", middleware.verificaToken ,middleware.verificaAdm ,usuarioC.cadastro);


export default routes;
