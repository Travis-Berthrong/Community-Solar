import Project, { IProject } from '../datamodels/Project';
import { HydratedDocument } from "mongoose";
import { ObjectId } from "bson";

export default class ProjectService {
    public static async getProjects(): Promise<HydratedDocument<IProject>[]> {
        return Project.find();
    }

    public static async getProjectById(id: ObjectId): Promise<HydratedDocument<IProject>> {
        return Project.findById(id);
    }

    public static async createProject(project: IProject): Promise<HydratedDocument<IProject>> {
        return Project.create(project);
    }

    public static async updateProject(id: ObjectId, project: IProject): Promise<HydratedDocument<IProject>> {
        return Project.findByIdAndUpdate(id, project, { new: true });
    }

    public static async deleteProject(id: ObjectId): Promise<HydratedDocument<IProject>> {
        return Project.findByIdAndDelete(id);
    }
}