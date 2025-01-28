import express from "express";
import cors from "cors";
import { ProjectController } from "./controllers/ProjectController";
import { HomeMapController } from "./controllers/HomeMapController";

const app = express();
app.use(express.json());
app.use(cors());

const projectController = new ProjectController();
const homeMapController = new HomeMapController();

app.use("/api", projectController.router);
app.use("/api", homeMapController.router);

export default app;