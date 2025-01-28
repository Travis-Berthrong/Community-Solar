import { IProject } from '../datamodels/Project';
import ProjectService from './ProjectService';
import { HydratedDocument } from "mongoose";
import L from 'leaflet'; // Assuming Leaflet is used for mapping
import { Request, Response } from 'express';

class HomeMapService {
    public static async generateMap(req: Request, res: Response) {
        try {
            // Fetch all projects
            const projects = await ProjectService.getProjects();
            
            // Assuming the user's location is passed in the request body for simplicity
            const { latitude: userLat, longitude: userLong } = req.body.userLocation;

            // Create a Leaflet map centered around the user's location
            const map = L.map('map').setView([userLat, userLong], 10);

            // Add a tile layer to the map (replace with your tile layer URL)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            // Marker for current user's location
            L.marker([userLat, userLong])
                .bindPopup('Your location')
                .setIcon(L.icon({ iconUrl: '../../assests/person-icon.jpeg' }))
                .addTo(map);

            // Add project markers
            projects.forEach((project: HydratedDocument<IProject>) => {
                const { latitude, longitude, title, owner, fundingCurrent, fundingGoal } = project;
                const popupContent = `
                    <b>${title}</b><br>
                    <b>Project ID:</b> ${project._id}<br>
                    <b>Creator:</b> ${owner.firstName} ${owner.lastName}<br>
                    <b>Funds Raised:</b> ${fundingCurrent} / ${fundingGoal}<br>
                `;
                
                // Add marker for each project
                L.marker([latitude, longitude])
                    .bindPopup(popupContent)
                    .setIcon(L.icon({ iconUrl: '../../assests/project-icon.jpeg' }))
                    .addTo(map);
            });

            // Return the map object (can be rendered on the client)
            return res.json({ message: 'Map generated successfully' });

        } catch (error) {
            return res.status(500).json({ message: 'Error generating map', error });
        }
    }
}

export default HomeMapService;
