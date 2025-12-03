import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";
import { metricsController } from "../contollers/metrics.controller.ts";

const routes = Router();

routes.get(
	"/metrics",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	metricsController
);

export { routes as metricsRoutes };
