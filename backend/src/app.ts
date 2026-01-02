import express from "express";
import cors from "cors";

import personnelRoutes from "./routes/personnel.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import projectRoutes from "./routes/project.routes.js";
import matchRoutes from "./routes/matching.routes.js";
import assignmentsRoutes from "./routes/assignments.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/personnel", personnelRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/assignments", assignmentsRoutes);

export default app;
