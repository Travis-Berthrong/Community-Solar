import { IProject } from '../datamodels/Project';
import ProjectService from './ProjectService';
import { HydratedDocument } from "mongoose";
import { Request } from 'express';

class HomeMapService {
    public static async getHomeMapData(req: Request): Promise<{ message: string; data: any }> {
        try {
            // Fetch all projects from the database
            const projects = await ProjectService.getProjects();
            
            // Extract user's location from the request
            const { latitude: userLat, longitude: userLong } = req.body.userLocation;

            // Prepare the data for the frontend
            const mapData = {
                userLocation: { latitude: userLat, longitude: userLong },
                projects: projects.map((project: HydratedDocument<IProject>) => ({
                    id: project._id,
                    title: project.title,
                    latitude: project.latitude,
                    longitude: project.longitude,
                    owner: `${project.owner.firstName} ${project.owner.lastName}`,
                    fundingCurrent: project.fundingCurrent,
                    fundingGoal: project.fundingGoal,
                }))
            };

            return { message: 'Map data retrieved successfully', data: mapData };

        } catch (error) {
            return { message: 'Error retrieving map data', data: {} };
        }
    }
}

export default HomeMapService;
