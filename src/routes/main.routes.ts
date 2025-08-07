import express from "express"
import { MainControler } from "../controlers/query.controler"

export const MainRoutes = express.Router()

MainRoutes.post("/query", MainControler.processQuery);
MainRoutes.get("/config", MainControler.getConfig);
MainRoutes.get("/", MainControler.getStatus);