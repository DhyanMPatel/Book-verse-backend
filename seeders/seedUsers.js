import UserModal from "../modal/userModal.js"
import bcrypt from "bcryptjs";

const getHashedUsers = async () => {
    const saltRounds = 12;
    return [
        {
            name: "Admin",
            email: "admin@example.com",
            password: await bcrypt.hash("Admin@123", saltRounds),
            role: "admin",
            phone: "1234567890"
        },
        {
            name: "User",
            email: "user@example.com",
            password: await bcrypt.hash("User@123", saltRounds),
            role: "user",
            phone: "9876543210"
        }
    ];
};

export const seedUsers = async () => {
    try {
        await UserModal.deleteMany({});
        const users = await getHashedUsers();
        const createdUsers = await UserModal.insertMany(users);
        console.log("✅ Users seeded successfully");
        return createdUsers;
    } catch (error) {
        console.error("❌ Error seeding users:", error);
        throw error;
    }
}