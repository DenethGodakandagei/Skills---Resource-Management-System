import type { Request, Response } from "express";
import { pool } from "../config/db.js";

export const matchPersonnel = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.role,
        GROUP_CONCAT(
          CONCAT(s.name, ' (', ps.proficiency_level, ')')
        ) AS skills
      FROM personnel p
      JOIN personnel_skills ps ON p.id = ps.personnel_id
      JOIN skills s ON ps.skill_id = s.id
      JOIN project_requirements pr ON ps.skill_id = pr.skill_id
      WHERE pr.project_id = ?
        AND ps.proficiency_level >= pr.min_proficiency_level
      GROUP BY p.id
      HAVING COUNT(DISTINCT pr.skill_id) =
        (SELECT COUNT(*) FROM project_requirements WHERE project_id = ?)
    `;

    const [rows] = await pool.query(sql, [projectId, projectId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
