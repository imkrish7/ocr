import { Router } from "express";
import { ocrController } from "../contollers/webhook.controllers.ts";

const routes = Router();

routes.post("/webhooks/ocr", ocrController);
