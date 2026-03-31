import cors from "cors";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import express from 'express';
import appRouter from './appRouter.js';
import { connectDB } from './config/db.js';

const app = express();
const env = dotenv.config({
    path: process.env.Node_Env ? `.env.${process.env.Node_Env || "development"}` : ".env"
});
dotenvExpand.expand(env);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/files", express.static("files"))

// CORS Connection
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}))

// Connect to Database
connectDB();

app.use("/api", appRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        timestamp: new Date().toISOString()
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}/api`);
})