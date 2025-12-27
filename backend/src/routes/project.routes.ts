import { Router } from "express";
import * as controller from "../controllers/project.controller.js";

const router = Router();

router.post("/", controller.createProject);
router.get("/", controller.getAllProjects);
router.post("/:id/requirements", controller.addRequirement);

export default router;
