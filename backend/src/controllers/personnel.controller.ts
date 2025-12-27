import type { Request, Response } from 'express';
import { pool } from '../config/db.js';

// GET All Personnel
export const getAllPersonnel = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM personnel ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching personnel' });
  }
};

// POST Create Personnel
export const createPersonnel = async (req: Request, res: Response) => {
  const { name, email, role, experience_level } = req.body;
  try {
    const [result]: any = await pool.query(
      'INSERT INTO personnel (name, email, role, experience_level) VALUES (?, ?, ?, ?)',
      [name, email, role, experience_level]
    );
    res.status(201).json({ id: result.insertId, name, email, role, experience_level });
  } catch (error) {
    res.status(500).json({ message: 'Error creating personnel', error });
  }
};

// POST Assign Skill
export const assignSkill = async (req: Request, res: Response) => {
  const { personnel_id, skill_id, proficiency_level } = req.body;
  try {
    await pool.query(
      'INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE proficiency_level = ?',
      [personnel_id, skill_id, proficiency_level, proficiency_level]
    );
    res.json({ message: 'Skill assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning skill' });
  }
};