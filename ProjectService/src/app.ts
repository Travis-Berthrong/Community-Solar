import express from "express";
import cors from "cors";
import { ProjectController } from "./controllers/ProjectController";

const app = express();
app.use(express.json());
app.use(cors());

const projectController = new ProjectController();
app.use("/api", projectController.router);

export default app;