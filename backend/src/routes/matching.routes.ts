import { Router } from "express";
import { matchPersonnel } from "../controllers/matching.controller.js";

const router = Router();

router.get("/project/:id", matchPersonnel);

export default router;
