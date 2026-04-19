import mongoose from "mongoose";
import { seedBooksOnly } from "./seedBooks.js";
import { seedCategories } from "./seedCategories.js";
import "dotenv/config";
import { seedUsers } from "./seedUsers.js";

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bookverse");
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

// Main seeding function
const seedData = async () => {
    console.log("🌱 Starting database seeding...");

    await connectDB();

    // Seed users first (needed for book references)
    const users = await seedUsers();
    const adminUser = users.find(u => u.role === 'admin');

    // Seed categories (needed for book references)
    const categoryMap = await seedCategories();

    // Seed books with proper references
    await seedBooksOnly(adminUser._id, categoryMap);

    console.log("✅ Seeding completed!");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
};

// Run seeder
seedData().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});