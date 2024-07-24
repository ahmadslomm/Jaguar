import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import Route from './route';
import { DbInstance } from './db';

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1',Route);

DbInstance.then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
        try {
            console.log(`Server is running at ${port}`);
        } catch (error) {
            console.log(`Getting error for running at ${port}`, error);
        }
    })
}).catch( (error) => {
    console.log("Getting error for database connection", error);
});

