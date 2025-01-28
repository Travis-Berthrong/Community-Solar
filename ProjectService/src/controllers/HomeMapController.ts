import { Router, Request, Response } from 'express';
import HomeMapService from '../services/HomeMapService';
import { Logger } from "sitka";

export class HomeMapController {
    public path = '/home-map'; // Define the path for the map-related routes
    public router = Router();
    private readonly logger = Logger.getLogger({ name: 'HomeMapController' });

    constructor() {
        this.initRoutes(); // Initialize the routes
    }

    public initRoutes() {
        this.router.post(this.path, this.getHomeMap); // Post method to get home map
    }

    // Controller method to fetch home map
    getHomeMap = async (req: Request, res: Response) => {
        try {
            await HomeMapService.generateMap(req, res); // Call the service to generate the map
        } catch (error) {
            this.logger.error(error);
            res.status(500).send({ message: "Internal server error" });
        }
    };
}

