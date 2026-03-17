import mongoose from "mongoose";

export const CategorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true, // ✅ this is enough
        trim: true
    }
});

export const CategoryModal = mongoose.model("category", CategorySchema);