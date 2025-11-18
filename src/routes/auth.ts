import { Router } from "express";
import {
	loginController,
	logoutController,
	refreshTokenController,
	signupController,
} from "../contollers/auth.controller.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";

const routes = Router();

routes.post("/login", loginController);
routes.post("/signup", signupController);
routes.post("/refresh-session", refreshTokenController);
routes.get("/logout", authMiddleware, logoutController);

export { routes as authRoutes };
