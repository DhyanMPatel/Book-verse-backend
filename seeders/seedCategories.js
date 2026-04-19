import { CategoryModal } from "../modal/categoryModel.js";

// Dummy categories data
const categories = [
    {
        name: "traveling"
    },
    {
        name: "knowledge"
    },
    {
        name: "business"
    },
    {
        name: "study"
    },
    {
        name: "non-fiction"
    },
    {
        name: "mystery"
    },
    {
        name: "thriller"
    },
    {
        name: "romance"
    },
    {
        name: "science fiction"
    },
    {
        name: "fantasy"
    },
    {
        name: "horror"
    },
    {
        name: "historical fiction"
    },
    {
        name: "biography"
    },
    {
        name: "autobiography"
    },
    {
        name: "self-help"
    },
    {
        name: "personal development"
    },
    {
        name: "psychology"
    },
    {
        name: "philosophy"
    },
    {
        name: "religion & spirituality"
    },
    {
        name: "science"
    },
    {
        name: "technology"
    },
    {
        name: "economics"
    },
    {
        name: "politics"
    },
    {
        name: "law"
    },
    {
        name: "education / study"
    },
    {
        name: "health & fitness"
    },
    {
        name: "medicine"
    },
    {
        name: "travel"
    },
    {
        name: "cooking / food"
    },
    {
        name: "art & photography"
    },
    {
        name: "music"
    },
    {
        name: "poetry"
    },
    {
        name: "drama / plays"
    },
    {
        name: "comics & graphic novels"
    },
    {
        name: "young adult"
    },
    {
        name: "children’s books"
    },
    {
        name: "parenting"
    },
    {
        name: "true crime"
    },
    {
        name: "adventure"
    },
    {
        name: "dystopian"
    },
    {
        name: "environmental / nature"
    },
    {
        name: "crafts & hobbies"
    },
    {
        name: "mythology"
    },
    {
        name: "astrology"
    },
    {
        name: "cultural studies"
    },
    {
        name: "nothing"
    },
    {
        name: "fiction"
    }
]

export const seedCategories = async () => {
    try {
        await CategoryModal.deleteMany({});
        const createdCategories = await CategoryModal.insertMany(categories);
        console.log("✅ Categories seeded successfully");
        // Return a map of category name (lowercase) to ObjectId
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.name.toLowerCase()] = cat._id;
        });
        return categoryMap;
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
        throw error;
    }
}
