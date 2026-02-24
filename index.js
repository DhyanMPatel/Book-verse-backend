import express from 'express';
import "dotenv/config";
import appRouter from './appRouter.js';
import { connectDB } from './config/db.js';
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// CORS Connection
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}))

// Connect to Database
connectDB();

app.use("/api",appRouter);

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