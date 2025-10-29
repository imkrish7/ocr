import { Router } from "express";
import {
	createDocumentController,
	getFoldersController,
} from "../contollers/document.controllers.ts";

const routes = Router();

// routes.post()
routes.post("/docs", createDocumentController);
routes.get("/folder", getFoldersController);
