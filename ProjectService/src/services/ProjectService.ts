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

    public static async projectForecasting(projectLat: number, _projectLong: number, projectArea: number) {
        // Constants for solar calculations
        const SOLAR_CONSTANT = 1361; // Solar constant in W/m²
        const PANEL_EFFICIENCY = 0.20; // Modern solar panel efficiency (20%)
        const SYSTEM_LOSSES = 0.14; // System losses (inverter, wiring, etc.)
        const PANEL_DEGRADATION = 0.005; // Annual panel degradation rate (0.5%)
        const PROJECT_LIFETIME = 25; // Project lifetime in years
        const MAINTENANCE_COST_PER_KW = 20; // Annual maintenance cost per kW
        const ELECTRICITY_PRICE = 0.12; // Average electricity price per kWh
        const PANEL_COST_PER_M2 = 150; // Cost per m² for panels and mounting
        const INSTALLATION_COST_MULTIPLIER = 1.3; // Installation cost multiplier
    
        const calculateSolarIrradiance = (latitude: number): number => {
            // Adjust solar constant based on latitude
            const latitudeRadians = Math.abs(latitude) * (Math.PI / 180);
            const atmosphericLoss = Math.cos(latitudeRadians);
            const seasonalAdjustment = 0.85; // Account for seasonal variations
            return SOLAR_CONSTANT * atmosphericLoss * seasonalAdjustment;
        };
    
        // Calculate system capacity and performance
        const calculateSystemPerformance = (area: number, latitude: number) => {
            const dailyIrradiance = calculateSolarIrradiance(latitude);
            const hoursOfSunlight = Math.max(8 - Math.abs(latitude) / 10, 4); // Estimate sunlight hours based on latitude
            const systemEfficiency = PANEL_EFFICIENCY * (1 - SYSTEM_LOSSES);
            
            // Daily energy production in kWh
            const dailyEnergy = (dailyIrradiance * area * systemEfficiency * hoursOfSunlight) / 1000;
            
            // Annual energy production in kWh
            const annualEnergy = dailyEnergy * 365.25;
            
            return annualEnergy;
        };
    
        const calculateProjectCosts = (area: number, annualEnergy: number) => {
            const equipmentCost = area * PANEL_COST_PER_M2;
            const totalInstallationCost = equipmentCost * INSTALLATION_COST_MULTIPLIER;
            
            const systemCapacityKW = (annualEnergy / 365.25) / 4; // Rough estimate of system capacity
            const annualMaintenance = systemCapacityKW * MAINTENANCE_COST_PER_KW;
            
            return {
                totalInstallationCost,
                annualMaintenance
            };
        };
    
        const calculateFinancials = (annualEnergy: number, costs: { totalInstallationCost: number, annualMaintenance: number }) => {
            let totalRevenue = 0;
            let totalCosts = costs.totalInstallationCost;
            let currentEnergyOutput = annualEnergy;
    
            // Calculate lifetime revenue and costs
            for (let year = 0; year < PROJECT_LIFETIME; year++) {
                const yearlyRevenue = currentEnergyOutput * ELECTRICITY_PRICE;
                totalRevenue += yearlyRevenue;
    
                totalCosts += costs.annualMaintenance;
    
                currentEnergyOutput *= (1 - PANEL_DEGRADATION);
            }
    
            const totalProfit = totalRevenue - totalCosts;
            const roi = (totalProfit / costs.totalInstallationCost) * 100;
    
            return {
                totalRevenue,
                totalProfit,
                roi
            };
        };
    
        const calculateCO2Savings = (annualEnergy: number) => {
            const CO2_PER_KWH = 0.4; // Average CO2 emissions per kWh from traditional sources (kg)
            return annualEnergy * CO2_PER_KWH;
        };
    
        try {
            if (!projectLat || !projectArea || projectArea <= 0) {
                throw new Error('Invalid input parameters');
            }
    
            const annualEnergy = calculateSystemPerformance(projectArea, projectLat);
    
            const costs = calculateProjectCosts(projectArea, annualEnergy);
    
            const financials = calculateFinancials(annualEnergy, costs);
    
            const annualCO2Savings = calculateCO2Savings(annualEnergy);
    
            return {
                projectCost: Math.round(costs.totalInstallationCost),
                estimatedElectricityOutput: Math.round(annualEnergy),
                estimatedCO2Savings: Math.round(annualCO2Savings),
                estimatedRevenue: Math.round(financials.totalRevenue / PROJECT_LIFETIME),
                estimatedROI: Math.round(financials.roi * 100) / 100
            };
    
        } catch (error) {
            console.error('Error in project forecasting:', error);
            throw error;
        }
    }
}