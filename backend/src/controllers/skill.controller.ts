import type { Request, Response } from "express";
import { pool } from "../config/db.js";

/* CREATE SKILL */
export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, description } = req.body;

    await pool.query(
      "INSERT INTO skills (name, category, description) VALUES (?, ?, ?)",
      [name, category, description]
    );

    res.status(201).json({ message: "Skill created" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* GET ALL SKILLS */
export const getAllSkills = async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM skills");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* UPDATE SKILL */
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, description } = req.body;
    const { id } = req.params;

    await pool.query(
      "UPDATE skills SET name=?, category=?, description=? WHERE id=?",
      [name, category, description, id]
    );

    res.json({ message: "Skill updated" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* DELETE SKILL */
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM skills WHERE id=?", [id]);

    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
