import { Router } from "express";
import * as controller from "../controllers/skill.controller.js";

const router = Router();

router.post("/", controller.createSkill);
router.get("/", controller.getAllSkills);
router.put("/:id", controller.updateSkill);
router.delete("/:id", controller.deleteSkill);

export default router;
