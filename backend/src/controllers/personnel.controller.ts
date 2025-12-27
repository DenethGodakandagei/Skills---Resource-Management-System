import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import type { RowDataPacket } from "mysql2";

/* CREATE PERSONNEL */
export const createPersonnel = async (req: Request, res: Response) => {
  try {
    const { name, email, role, experience_level } = req.body;

    await pool.query(
      `INSERT INTO personnel 
       (name, email, role, experience_level) 
       VALUES (?, ?, ?, ?)`,
      [name, email, role, experience_level]
    );

    res.status(201).json({ message: "Personnel created" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* GET ALL PERSONNEL */
export const getAllPersonnel = async (_: Request, res: Response) => {
  try {
    console.log("Fetching all personnel");
    const [rows] = await pool.query("SELECT * FROM personnel");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getPersonnelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); // ensure it's a number
console.log("Fetching personnel with ID:", id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM personnel WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Get personnel by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* UPDATE PERSONNEL */
export const updatePersonnel = async (req: Request, res: Response) => {
  try {
    const { name, email, role, experience_level } = req.body;
    const { id } = req.params;

    await pool.query(
      `UPDATE personnel 
       SET name=?, email=?, role=?, experience_level=? 
       WHERE id=?`,
      [name, email, role, experience_level, id]
    );

    res.json({ message: "Personnel updated" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* DELETE PERSONNEL */
export const deletePersonnel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM personnel WHERE id=?", [id]);

    res.json({ message: "Personnel deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/* ASSIGN SKILL TO PERSONNEL */
export const assignSkill = async (req: Request, res: Response) => {
  try {
    const { skill_id, proficiency_level } = req.body;
    const { id } = req.params;

    await pool.query(
      `INSERT INTO personnel_skills 
       (personnel_id, skill_id, proficiency_level) 
       VALUES (?, ?, ?)`,
      [id, skill_id, proficiency_level]
    );

    res.json({ message: "Skill assigned" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
