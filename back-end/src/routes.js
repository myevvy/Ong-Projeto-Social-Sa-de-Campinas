import express from "express";
const routes = express.Router();
import usuarioC from "./controllers/usuarioController.js";
import middleware from './middlewares/verificoesUsuario.js'
import eventoC from "./controllers/eventoController.js";
import remedioC from "./controllers/remedioController.js";

routes.post("/cadastro", usuarioC.cadastro);

routes.post("/login" ,usuarioC.login);

routes.get("/pagAdm", middleware.verificaToken ,middleware.verificaAdm, (req,res)=>{
    res.json({mensagem: "Acesso Permitido!", usuario: req.usuario});
}); //no front verificar se a resposta enviada pelo token é o certo

routes.get("/pagFunc", middleware.verificaToken ,middleware.verificaFunc, (req,res)=>{
    res.json({mensagem: "Acesso Permitido!", usuario: req.usuario});
}); //no front verificar se a resposta enviada pelo token é o certo

routes.get("/funcionarios", middleware.verificaToken ,middleware.verificaAdm ,usuarioC.getFuncionarios);
routes.post("/funcionarios", middleware.verificaToken ,middleware.verificaAdm ,usuarioC.cadastro);
routes.put("/funcionarios/:id", middleware.verificaToken ,middleware.verificaAdm ,usuarioC.putUsuarioC);
routes.delete("/funcionarios/:id", middleware.verificaToken ,middleware.verificaAdm ,usuarioC.deleteUsuarioC);

routes.get("/eventos", eventoC.getEventoC);
routes.post("/eventos", middleware.verificaToken ,middleware.verificaAdmFunc ,eventoC.postEventoC);
routes.put("/eventos/:id", middleware.verificaToken ,middleware.verificaAdmFunc ,eventoC.putEventoC);
routes.delete("/eventos/:id", middleware.verificaToken ,middleware.verificaAdmFunc ,eventoC.deleteUsuarioC);

routes.get("/remedio", remedioC.getRemedioC);
routes.post("/remedio", middleware.verificaToken ,middleware.verificaAdm , remedioC.postRemedioC);
routes.put("/remedio/:id", middleware.verificaToken ,middleware.verificaAdm ,remedioC.putRemedioC);
routes.put("/remedio/:id/quantidade", middleware.verificaToken ,middleware.verificaFunc ,remedioC.putRemedioQuantidadeC);
routes.delete("/remedio/:id", middleware.verificaToken ,middleware.verificaAdm ,remedioC.deleteRemedioC);

export default routes;
