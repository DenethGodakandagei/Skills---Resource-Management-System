import type { Request, Response } from "express";
import { pool } from "../config/db.js";

export const matchPersonnel = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;

    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.role,

        JSON_ARRAYAGG(
          JSON_OBJECT(
            'skill', s.name,
            'proficiency', ps.proficiency_level,
            'required', pr.min_proficiency_level
          )
        ) AS skills,

        ROUND(
          (
            COUNT(DISTINCT CASE 
              WHEN ps.proficiency_level >= pr.min_proficiency_level 
              THEN pr.skill_id 
            END)
            /
            (SELECT COUNT(*) 
             FROM project_requirements 
             WHERE project_id = ?)
          ) * 100
        ) AS match_score

      FROM personnel p
      JOIN personnel_skills ps ON p.id = ps.personnel_id
      JOIN skills s ON ps.skill_id = s.id
      LEFT JOIN project_requirements pr 
        ON pr.skill_id = ps.skill_id 
       AND pr.project_id = ?

      GROUP BY p.id
      HAVING match_score > 0
      ORDER BY match_score DESC;
      `,
      [projectId, projectId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Skill matching failed" });
  }
};
