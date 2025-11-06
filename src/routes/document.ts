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

routes.post(
	"/docs",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	createDocumentController
);
routes.get(
	"/folders",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getFoldersController
);
routes.get(
	"/folders/{:id}/docs",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getDocumentWithTagController
);
routes.get(
	"/search",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getDocumentWithFilters
);

export { routes as documentRoutes };
