import { IProject } from '../datamodels/Project';
import ProjectService from './ProjectService';
import { HydratedDocument } from "mongoose";
import L from 'leaflet';
import { Request, Response } from 'express';

class HomeMapService {
    public static async generateMap(req: Request, res: Response) {
        try {
            // Fetch all projects
            const projects = await ProjectService.getProjects();
            
            
            const { latitude: userLat, longitude: userLong } = req.body.userLocation;

            // Create a Leaflet map centered around the user's location
            const map = L.map('map').setView([userLat, userLong], 10);

            // Add a tile layer to the map (replace with your tile layer URL)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            // Marker for current user's location with custom icon using L.icon
            L.marker([userLat, userLong])
                .bindPopup('Your location')
                .setIcon(L.icon({
                    iconUrl: '../../assests/person-icon.jpeg',  // Your custom icon image
                    iconSize: [40, 40],  // Size of the icon
                    iconAnchor: [20, 40],  // Anchor point to position the icon
                    popupAnchor: [0, -40],  // Adjust popup position
                    className: 'user-icon'  // Add a custom class for styling if needed
                }))
                .addTo(map);

            // Add project markers with custom icons using L.icon
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
                    .setIcon(L.icon({
                        iconUrl: '../../assests/project-icon.jpeg',  // Your custom project icon
                        iconSize: [40, 40],  // Size of the icon
                        iconAnchor: [20, 40],  // Anchor point to position the icon
                        popupAnchor: [0, -40],  // Adjust popup position
                        className: 'project-icon'  // Add a custom class for styling if needed
                    }))
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
