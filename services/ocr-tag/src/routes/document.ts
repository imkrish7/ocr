import { Router } from "express";
import {
	createDocumentController,
	getDocumentWithFilters,
	getDocumentWithTagController,
	getPresignedURLDocumentController,
	updateDocumentUploadController,
	getDocumentViewController,
	chatToDocumentController,
} from "../contollers/document.controllers.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";

const routes = Router({
	caseSensitive: true,
});

routes.post(
	"/docs",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	createDocumentController,
);

routes.get(
	"/folders/{:id}/docs",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getDocumentWithTagController,
);
routes.get(
	"/search",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getDocumentWithFilters,
);

routes.post(
	"/{:folderId}/upload",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	getPresignedURLDocumentController,
);
routes.post(
	"/{:folderId}/upload/update",
	authMiddleware,
	roleMiddleware(["admin", "user"]),
	updateDocumentUploadController,
);

routes.get(
	"/{:docid}/view",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	getDocumentViewController,
);

routes.post(
	"/{:docid}/chat",
	authMiddleware,
	roleMiddleware(["admin", "user", "moderator", "support"]),
	chatToDocumentController,
);

export { routes as documentRoutes };
