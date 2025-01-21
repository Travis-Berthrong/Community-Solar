import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../datamodels/User';
import { config } from 'dotenv';

config();

if (!(process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD)) {
    console.error('Please provide the necessary environment variables');
    process.exit(1);
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: true,
    logging: false
});