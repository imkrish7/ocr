import { Router } from "express";
import {
	loginController,
	signupController,
} from "../contollers/auth.controller.ts";

const routes = Router();

routes.post("/login", loginController);
routes.post("/signup", signupController);

export { routes as authRoutes };
