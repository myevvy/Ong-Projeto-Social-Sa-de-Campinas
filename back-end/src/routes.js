import express from "express";
const routes = express.Router();
import usuarioC from "./controllers/usuarioController.js";
import middleware from './middlewares/verificaToken.js'

routes.post("/cadastro", usuarioC.cadastro);
routes.post("/login",usuarioC.login);

export default routes;
