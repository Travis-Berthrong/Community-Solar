import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'bson';
import Project, { IProject } from '../src/datamodels/Project';
import ProjectService from '../src/services/ProjectService';

describe('ProjectService', () => {
    let project: HydratedDocument<IProject>;

    beforeEach(() => {
        project = {
            _id: new ObjectId(),
            title: 'Test Project',
            description: 'Test Description',
            address: 'Test Address',
            latitude: 0,
            longitude: 0,
            landSize: 100,
            fundingGoal: 100000,
            fundingCurrent: 0,
            estimatedElectricityOutput: 1000,
            estimatedCO2Savings: 100,
            estimatedRevenue: 10000,
            estimatedROI: 10,
            owner: {
                userId: 'testUserId',
                firstName: 'Test',
                lastName: 'User'
            },
            investors: [],
            comments: [],
            created_at: new Date(),
            updated_at: new Date()
        } as unknown as HydratedDocument<IProject>;

    });

    it('should get all projects', async () => {
        jest.spyOn(Project, 'find').mockResolvedValueOnce([project]);
        const projects = await ProjectService.getProjects();
        expect(projects).toBeDefined();
        expect(projects.length).toBeGreaterThan(0);
    });

    it('should get a project by id', async () => {
        jest.spyOn(Project, 'findById').mockResolvedValueOnce(project);
        const res = await ProjectService.getProjectById(project._id);
        expect(res).toBeDefined();
        expect(res._id).toEqual(project._id);
    });

    it('should create a project', async () => {
        jest.spyOn(Project.prototype, 'save').mockResolvedValueOnce(project);
        const res = await ProjectService.createProject(project);
        expect(res).toBeDefined();
        expect(res._id).toEqual(project._id);
    });

    it('should update a project', async () => {
        const updatedProject = {
            ...project,
            title: 'Updated Test Project'
        } as unknown as HydratedDocument<IProject>;
        jest.spyOn(Project, 'findByIdAndUpdate').mockResolvedValueOnce(updatedProject);
        const res = await ProjectService.updateProject(project._id, { ...project, title: 'Updated Test Project' });
        expect(res).toBeDefined();
        expect(res.title).toEqual('Updated Test Project');
    });

    it('should delete a project', async () => {
        jest.spyOn(Project, 'findByIdAndDelete').mockResolvedValueOnce(project);
        const deletedProject = await ProjectService.deleteProject(project._id);
        expect(deletedProject).toBeDefined();
        expect(deletedProject._id).toEqual(project._id);
        expect(Project.findByIdAndDelete).toHaveBeenCalledWith(project._id);
    });

    it('should add an investor to a project', async () => {
        const investorId = 'testInvestorId';
        const investorFirstName = 'Test';
        const investorLastName = 'Investor';
        const investedAmount = 1000;
        const updatedProject = {
            ...project,
            investors: [
                {
                    userId: investorId,
                    amount: investedAmount,
                    firstName: investorFirstName,
                    lastName: investorLastName
                }
            ],
            fundingCurrent: investedAmount
        } as unknown as HydratedDocument<IProject>;
        jest.spyOn(Project, 'findByIdAndUpdate').mockResolvedValueOnce(updatedProject);
        const res = await ProjectService.addInvestor(project._id, investorId, investorFirstName, investorLastName, investedAmount);
        expect(res).toBeDefined();
        expect(res.investors.length).toBeGreaterThan(0);
        expect(res.investors[0]).not.toBeNull();
        expect(res.investors[0]?.userId).toEqual(investorId);
        expect(res.investors[0]?.amount).toEqual(investedAmount);
        expect(res.fundingCurrent).toEqual(investedAmount);
    });
});