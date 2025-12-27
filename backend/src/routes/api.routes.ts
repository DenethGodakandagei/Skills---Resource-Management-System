import { Router } from 'express';
import { getAllPersonnel, createPersonnel, assignSkill } from '../controllers/personnel.controller.js';
import { matchPersonnelToProject } from '../controllers/matching.controller.js';

const router = Router();

// Personnel Routes
router.get('/personnel', getAllPersonnel);
router.post('/personnel', createPersonnel);
router.post('/personnel/skills', assignSkill);

// Matching Route
router.get('/projects/:projectId/match', matchPersonnelToProject);

// Default test route
router.get('/', (req, res) => {
    res.send("API is working!");
});

export default router;