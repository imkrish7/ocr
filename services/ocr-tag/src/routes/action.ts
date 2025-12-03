import { Router } from "express";
import {
	getCreditUsagesController,
	runActionController,
} from "../contollers/actions.controller.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";

const routes = Router();

routes.post(
	"/run",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	runActionController
);
routes.get(
	"/usage/month",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	getCreditUsagesController
);

export { routes as actionRoutes };
