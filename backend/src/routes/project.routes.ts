import { Router } from "express";
import * as controller from "../controllers/project.controller.js";

const router = Router();

router.post("/", controller.createProject);
router.get("/", controller.getAllProjects);
router.get("/:id", controller.getProjectById);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

router.get("/:id/requirements", controller.getProjectRequirements);
router.post("/:id/requirements", controller.addRequirement);
router.delete("/:id/requirements/:skillId", controller.deleteRequirement);


export default router;
