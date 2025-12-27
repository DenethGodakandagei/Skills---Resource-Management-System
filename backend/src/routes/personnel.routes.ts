import { Router } from "express";
import * as controller from "../controllers/personnel.controller.js";

const router = Router();

router.post("/", controller.createPersonnel);
router.get("/", controller.getAllPersonnel);
router.get("/:id", controller.getPersonnelById);
router.put("/:id", controller.updatePersonnel);
router.delete("/:id", controller.deletePersonnel);

router.post("/:id/skills", controller.assignSkill);

export default router;
