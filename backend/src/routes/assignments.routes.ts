import { Router } from "express";
import {
  assignPersonnel,
  getAssignedPersonnel,
  removeAssignment
} from "../controllers/assignments.controller.js";

const router = Router();


router.post("/", assignPersonnel);
router.get("/project/:id", getAssignedPersonnel);
router.delete("/:projectId/:personnelId", removeAssignment);

export default router;