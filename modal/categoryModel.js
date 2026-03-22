import mongoose from "mongoose";

export const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // ✅ this is enough
        trim: true,
        lowercase: true
    }
});

export const CategoryModal = mongoose.model("category", CategorySchema);