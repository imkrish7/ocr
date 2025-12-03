import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { getRecentResourcesController } from "../contollers/recents.controller.ts";

const routes = Router();

routes.get("/", authMiddleware, getRecentResourcesController);

export { routes as recentRoutes };
