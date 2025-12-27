import type { Request, Response } from "express";
import { pool } from "../config/db.js";

/* CREATE PROJECT */
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;

    await pool.query(
      `INSERT INTO projects 
       (name, description, start_date, end_date, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, start_date, end_date, status]
    );

    res.status(201).json({ message: "Project created" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* GET ALL PROJECTS */
export const getAllProjects = async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* ADD PROJECT REQUIREMENT */
export const addRequirement = async (req: Request, res: Response) => {
  try {
    const { skill_id, min_proficiency_level } = req.body;
    const { id } = req.params;

    await pool.query(
      `INSERT INTO project_requirements 
       (project_id, skill_id, min_proficiency_level) 
       VALUES (?, ?, ?)`,
      [id, skill_id, min_proficiency_level]
    );

    res.json({ message: "Requirement added" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
