export interface IProject {
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    landSize: number;
    fundingGoal: number;
    fundingCurrent: number;
    estimatedElectricityOutput: number;
    estimatedCO2Savings: number;
    estimatedRevenue: number;
    estimatedROI: number;
    owner: {
        userId: string;
        firstName: string;
        lastName: string;
    },
    investors: [{
        userId: string;
        amount: number;
        firstName: string;
        lastName: string;
    }?],
    comments: [{
        userId: string;
        firstName: string;
        lastName: string;
        comment: string;
        commentDate: Date;
    }?]
}

export interface IProjectResponse {
    _id: string;
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    landSize: number;
    fundingGoal: number;
    fundingCurrent: number;
    estimatedElectricityOutput: number;
    estimatedCO2Savings: number;
    estimatedRevenue: number;
    estimatedROI: number;
    owner: {
        userId: string;
        firstName: string;
        lastName: string;
    },
    investors: [{
        userId: string;
        amount: number;
        firstName: string;
        lastName: string;
    }?],
    comments: [{
        userId: string;
        firstName: string;
        lastName: string;
        comment: string;
        commentDate: Date;
    }?],
    created_at: Date;
    updated_at: Date;
}