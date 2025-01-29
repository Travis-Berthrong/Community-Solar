import { config } from "dotenv";
import mongoose from "mongoose";
import app from "./app";

config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://myAtlasDBUser:Password1@myatlasclusteredu.5nzxbzz.mongodb.net/project-service?retryWrites=true&w=majority&appName=myAtlasClusterEDU';
const startApp = async (): Promise<void> => {
    try {
        mongoose.connect(`${MONGO_URI}`, {
            serverSelectionTimeoutMS: 5000
          }).then(
            () => {
                console.log('Connected to Mongodb');
                mongoose.connection.on('error', function (err) {
                    console.error(`Mongoose error: ${err}`)
                });
             },
            err => { console.error(`Error connecting to Mongodb: ${err}`) }
        );
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/api`);
        }).on('error', (error) => {
            console.error(`Server encountered an error: ${error.message}`);
        });
    } catch (error) {
        console.error(error);
    }
};

startApp();
export default startApp;
