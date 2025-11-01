import { Router } from "express";
import {
	createDocumentController,
	getDocumentWithFilters,
	getDocumentWithTagController,
	getFoldersController,
} from "../contollers/document.controllers.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";

const routes = Router();

// routes.post()
routes.post(
	"/docs",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	createDocumentController
);
routes.get(
	"/folders",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	getFoldersController
);
routes.get(
	"/folders/{:id}/docs",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	getDocumentWithTagController
);
routes.get(
	"/search",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	getDocumentWithFilters
);

export { routes as documentRoutes };
