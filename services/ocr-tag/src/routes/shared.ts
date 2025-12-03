import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { getSharedResourcesController } from "../contollers/shared.controller.ts";

const routes = Router({
	caseSensitive: true,
});

routes.get("/", authMiddleware, getSharedResourcesController);

export { routes as sharedRoutes };
