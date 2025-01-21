import { config } from 'dotenv';
import { AppDataSource } from './infrastructure/data-source';
import app from './app';

config();
const PORT = process.env.PORT ?? 8080;

const startApp = async (): Promise<void> => {
    AppDataSource.initialize().then(async () => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/auth`);
        }).on('error', (error) => {
            console.error(`Server encountered an error: ${error.message}`);
        });
    });
};

startApp();
export default startApp;
