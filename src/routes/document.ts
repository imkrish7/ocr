import { Router } from "express";
import {
	createDocumentController,
	getDocumentWithFilters,
	getDocumentWithTagController,
	getFoldersController,
} from "../contollers/document.controllers.ts";

const routes = Router();

// routes.post()
routes.post("/docs", createDocumentController);
routes.get("/folders", getFoldersController);
routes.get("/folders/{:id}/docs", getDocumentWithTagController);
routes.get("/search", getDocumentWithFilters);
