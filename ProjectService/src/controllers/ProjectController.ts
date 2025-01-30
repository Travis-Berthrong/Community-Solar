import { Router, Request, Response } from 'express';
import ProjectService from '../services/ProjectService';
import { ObjectId } from 'bson';

import { Logger } from "sitka";
import { IProject } from 'src/datamodels/Project';

export class ProjectController {
    public path = '/projects';
    public router = Router();
    private readonly logger = Logger.getLogger({ name: 'ProjectController' });

    constructor() {
    this.initRoutes();
    }

    public initRoutes() {
        this.router.get(this.path, this.getAllProjects);
        this.router.get(`${this.path}/:id`, this.getProjectById);
        this.router.post(this.path, this.createProject);
        this.router.put(`${this.path}/:id`, this.updateProject);
        this.router.delete(`${this.path}/:id`, this.deleteProject);
        this.router.post(`${this.path}/:id/investor`, this.addInvestor);
        this.router.post(`${this.path}/forecast`, this.forecastProject);
    }

    getAllProjects = async (_req: Request, res: Response) => {
    try {
        const projects = await ProjectService.getProjects();
        res.send(projects);
    } catch (error) {
        this.logger.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
    };

    getProjectById = async (req: Request, res: Response) => {
        try {
            let id: ObjectId;
            try {
                id = new ObjectId(req.params.id);
            } catch (error) {
                res.status(400).send({ message: 'Invalid project id' });
            }
            if (!id) {
                return;
            }
            const project = await ProjectService.getProjectById(id);
            if (!project) {
                res.status(404).send({ message: 'Project not found' });
                return;
            }
            res.send(project);
        } catch (error) {
            this.logger.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    };

    createProject = async (req: Request, res: Response) => {
        try {
            const project = req.body;
            const newProject = await ProjectService.createProject(project);
            res.status(201).send(newProject);
        } catch (error) {
            this.logger.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    };

    updateProject = async (req: Request, res: Response) => {
        try {
            let id: ObjectId;
            try {
                id = new ObjectId(req.params.id);
            } catch (error) {
                res.status(400).send({ message: 'Invalid project id' });
            }
            if (!id) {
                return;
            }
            const project: IProject = req.body;
            await ProjectService.updateProject(id, project);
            res.send("Project updated successfully");
        } catch (error) {
            this.logger.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    };

    deleteProject = async (req: Request, res: Response) => {
        try {
            let id: ObjectId;
            try {
                id = new ObjectId(req.params.id);
            } catch (error) {
                res.status(400).send({ message: 'Invalid project id' });
            }
            if (!id) {
                return;
            }
            const projectExists = await ProjectService.getProjectById(id);
            if (!projectExists) {
                res.status(404).send({ message: 'Project not found' });
                return;
            }
            await ProjectService.deleteProject(id);
            res.send("Project deleted successfully");
        } catch (error) {
            this.logger.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    };

    addInvestor = async (req: Request, res: Response) => {
        try {
            let projectId: ObjectId;
            try {
                projectId = new ObjectId(req.params.id);
            } catch (error) {
                res.status(400).send({ message: 'Invalid project id' });
            }
            if (!projectId) {
                return;
            }
            const { investorId, investorFirstName, investorLastName, investedAmount } = req.body;
            const project = await ProjectService.addInvestor(projectId, investorId, investorFirstName, investorLastName, investedAmount);
            res.send(project);
        } catch (error) {
            this.logger.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    };

    forecastProject = async (req: Request, res: Response) => {
        try {
            const { projectLat, projectLong, projectArea } = req.body;
            const forecast = await ProjectService.projectForecasting(projectLat, projectLong, projectArea);
            res.send(forecast);
        } catch (error) {
            this.logger.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    };
}