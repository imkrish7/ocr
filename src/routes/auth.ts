import { Router } from "express";
import {
	loginController,
	refreshTokenController,
	signupController,
} from "../contollers/auth.controller.ts";

const routes = Router();

routes.post("/login", loginController);
routes.post("/signup", signupController);
routes.post("/refresh-session", refreshTokenController);

export { routes as authRoutes };
