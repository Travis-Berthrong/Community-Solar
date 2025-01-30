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

    public static async projectForecasting(_projectLat: number, _projectLong: number, _projectArea: number) {
        // This function will calculate the estimated electricity output, CO2 savings, revenue, and ROI for a project
        // based on the project's latitude, longitude, and land size.
        // The calculation will be based on the project's location and size, and will use a predefined algorithm
        // to estimate the project's performance.
        // The estimated values will be returned as an object with the following properties:
        // - estimatedElectricityOutput: number
        // - estimatedCO2Savings: number
        // - estimatedRevenue: number
        // - estimatedROI: number

        return {
            projectCost: 10000,
            estimatedElectricityOutput: 1000,
            estimatedCO2Savings: 500,
            estimatedRevenue: 1000,
            estimatedROI: 0.1
        };
    }
}