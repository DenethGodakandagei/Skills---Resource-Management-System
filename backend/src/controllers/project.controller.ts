import type { Request, Response } from "express";
import { pool } from "../config/db.js";

/* =========================
   CREATE PROJECT
========================= */
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

/* =========================
   GET ALL PROJECTS
========================= */
export const getAllProjects = async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* =========================
   GET PROJECT BY ID
========================= */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, status } = req.body;

    await pool.query(
      `UPDATE projects 
       SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?
       WHERE id = ?`,
      [name, description, start_date, end_date, status, id]
    );

    res.json({ message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* =========================
   DELETE PROJECT
========================= */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // delete requirements first (FK safety)
    await pool.query(
      "DELETE FROM project_requirements WHERE project_id = ?",
      [id]
    );

    await pool.query("DELETE FROM projects WHERE id = ?", [id]);

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* =========================
   ADD PROJECT REQUIREMENT
========================= */
export const addRequirement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { skill_id, min_proficiency_level } = req.body;

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


/* =========================
   GET PROJECT REQUIREMENTS
========================= */
export const getProjectRequirements = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
         pr.project_id,
         pr.skill_id,
         s.name AS skill,
         pr.min_proficiency_level
       FROM project_requirements pr
       JOIN skills s ON s.id = pr.skill_id
       WHERE pr.project_id = ?`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* =========================
   DELETE PROJECT REQUIREMENT
========================= */
export const deleteRequirement = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId, skillId } = req.params;

    await pool.query(
      `DELETE FROM project_requirements 
       WHERE project_id = ? AND skill_id = ?`,
      [projectId, skillId]
    );

    res.json({ message: "Requirement removed" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
