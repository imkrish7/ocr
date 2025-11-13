import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";
import { getFoldersController } from "../contollers/folders.controllers.ts";

const routes = Router();

routes.post("/create", authMiddleware);
routes.get(
	"/",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getFoldersController
);
routes.get(
	"/primary",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getFoldersController
);

export { routes as folderRoutes };
