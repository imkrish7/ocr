import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { getUserController } from "../contollers/user.controllers.ts";

const routes = Router();

routes.get("/me", authMiddleware, getUserController);

export { routes as userRoutes };
