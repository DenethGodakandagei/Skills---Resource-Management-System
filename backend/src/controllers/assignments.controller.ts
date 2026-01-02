import type { Request, Response } from "express";
import { pool } from "../config/db.js";

/* ASSIGN PERSONNEL TO PROJECT */
export const assignPersonnel = async (req: Request, res: Response) => {
  try {
    const { projectId, personnelId } = req.body;

    /* Availability check */
    const [busy] = await pool.query(
      `
      SELECT 1
      FROM project_assignments pa
      JOIN projects p1 ON pa.project_id = p1.id
      JOIN projects p2 ON p2.id = ?
      WHERE pa.personnel_id = ?
        AND p1.status = 'Active'
        AND p2.status IN ('Planning','Active')
        AND p1.start_date <= p2.end_date
        AND p1.end_date >= p2.start_date
      `,
      [projectId, personnelId]
    );

    if ((busy as any[]).length > 0) {
      return res
        .status(400)
        .json({ message: "Personnel is not available for this period" });
    }

    await pool.query(
      `INSERT INTO project_assignments (project_id, personnel_id)
       VALUES (?, ?)`,
      [projectId, personnelId]
    );

    res.json({ message: "Personnel assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Assignment failed" });
  }
};

/* GET ASSIGNED PERSONNEL FOR A PROJECT */
export const getAssignedPersonnel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT p.id, p.name, p.role
      FROM project_assignments pa
      JOIN personnel p ON pa.personnel_id = p.id
      WHERE pa.project_id = ?
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

/* REMOVE PERSONNEL FROM PROJECT */
export const removeAssignment = async (req: Request, res: Response) => {
  try {
    const { projectId, personnelId } = req.params;

    await pool.query(
      `DELETE FROM project_assignments
       WHERE project_id = ? AND personnel_id = ?`,
      [projectId, personnelId]
    );

    res.json({ message: "Assignment removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove assignment" });
  }
};
