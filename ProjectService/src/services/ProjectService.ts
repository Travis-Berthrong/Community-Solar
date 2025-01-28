import Project, { IProject } from '../datamodels/Project';
import { HydratedDocument } from "mongoose";
import { ObjectId } from "bson";

export default class ProjectService {
    public static async getProjects(): Promise<HydratedDocument<IProject>[]> {
        return await Project.find();
    }

    public static async getProjectById(id: ObjectId): Promise<HydratedDocument<IProject>> {
        return await Project.findById(id);
    }

    public static async createProject(project: IProject): Promise<HydratedDocument<IProject>> {
        const newProject = new Project(project);
        return await newProject.save();
    }

    public static async updateProject(id: ObjectId, project: IProject): Promise<HydratedDocument<IProject>> {
        return await Project.findByIdAndUpdate(id, project, { new: true });
    }

    public static async deleteProject(id: ObjectId): Promise<HydratedDocument<IProject>> {
        return await Project.findByIdAndDelete(id);
    }

    public static async addInvestor(projectId: ObjectId, investorId: string, investorFirstName: string, investorLastName: string, investedAmount: number): Promise<HydratedDocument<IProject>> {
        return await Project.findByIdAndUpdate(projectId, {
            $push: {
                investors: {
                    userId: investorId,
                    amount: investedAmount,
                    firstName: investorFirstName,
                    lastName: investorLastName
                }
            },
            $inc: {
                fundingCurrent: investedAmount
            }
        }, { new: true });
    }
}