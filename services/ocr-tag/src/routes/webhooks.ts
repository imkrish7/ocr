import { Router } from "express";
import { ocrController } from "../contollers/webhook.controllers.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";

const routes = Router();

routes.post(
	"/webhooks/ocr",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	ocrController
);

export { routes as webhookRoutes };
