import type{ Request, Response } from 'express';
import { pool } from '../config/db.js';

export const matchPersonnelToProject = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;

  try {
    // 1. Get Project Requirements
    const [requirements]: any = await pool.query(
      `SELECT skill_id, min_proficiency_level, s.name as skill_name 
       FROM project_requirements pr
       JOIN skills s ON pr.skill_id = s.id
       WHERE project_id = ?`,
      [projectId]
    );

    if (requirements.length === 0) {
      return res.status(400).json({ message: "No requirements defined for this project." });
    }

    // 2. Get All Personnel Skills
    const [personnelRows]: any = await pool.query(
      `SELECT p.id, p.name, p.role, ps.skill_id, ps.proficiency_level 
       FROM personnel p
       JOIN personnel_skills ps ON p.id = ps.personnel_id`
    );

    // 3. Algorithm: Process Logic in JS
    const personnelMap = new Map();
    personnelRows.forEach((row: any) => {
      if (!personnelMap.has(row.id)) {
        personnelMap.set(row.id, {
          id: row.id, 
          name: row.name, 
          role: row.role, 
          skills: {} 
        });
      }
      personnelMap.get(row.id).skills[row.skill_id] = row.proficiency_level;
    });

    const perfectMatches: any[] = [];
    const nearMatches: any[] = [];

    personnelMap.forEach((person) => {
      let matchScore = 0;
      let missingSkills: string[] = [];
      let lowProficiencySkills: string[] = [];
      let isPerfect = true;

      requirements.forEach((req: any) => {
        const userLevel = person.skills[req.skill_id];
        
        if (!userLevel) {
          isPerfect = false;
          missingSkills.push(req.skill_name);
        } else if (userLevel < req.min_proficiency_level) {
          isPerfect = false;
          lowProficiencySkills.push(`${req.skill_name} (Lv${userLevel}/${req.min_proficiency_level})`);
        } else {
          matchScore++;
        }
      });

      const percent = Math.round((matchScore / requirements.length) * 100);
      const result = { ...person, matchPercentage: percent, missingSkills, lowProficiencySkills };

      if (isPerfect) perfectMatches.push(result);
      else if (percent >= 50) nearMatches.push(result);
    });

    // Sort Results
    perfectMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    nearMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ perfect_matches: perfectMatches, near_matches: nearMatches });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Algorithm failed" });
  }
};