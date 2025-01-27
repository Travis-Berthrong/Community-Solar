import { Schema, model } from 'mongoose';

//TODO Add more percise geomapping data (lat & long )
export interface IProject {
    title: string;
    description: string;
    address: string;
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

const ProjectSchema = new Schema<IProject>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    landSize: { type: Number, required: true },
    fundingGoal: { type: Number, required: true },
    fundingCurrent: { type: Number, required: true },
    estimatedElectricityOutput: { type: Number, required: true },
    estimatedCO2Savings: { type: Number, required: true },
    estimatedRevenue: { type: Number, required: true },
    estimatedROI: { type: Number, required: true },
    owner: {
        userId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    investors: [{
        userId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    }],
    comments: [{
        userId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        comment: { type: String, required: true },
        commentDate: { type: Date, required: true }
    }]
}, { timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}});

export default model<IProject>('Project', ProjectSchema);