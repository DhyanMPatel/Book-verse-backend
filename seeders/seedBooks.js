import mongoose from "mongoose";
import BookModal from "../modal/bookModal.js";
import "dotenv/config";

// Dummy books data
const books = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the mysterious Jay Gatsby.",
        category: "Fiction",
        price: 12.99,
        stock: 50,
        isbn: "978-0-7432-7356-5",
        coverImage: "https://example.com/covers/great-gatsby.jpg",
        fileUrl: "https://example.com/books/great-gatsby.pdf",
        format: "pdf",
        pages: 180,
        language: "English",
        publisher: "Scribner",
        publishedDate: new Date("1925-04-10")
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        description: "A powerful story of racial injustice and childhood innocence in the American South during the 1930s.",
        category: "Fiction",
        price: 14.99,
        stock: 75,
        isbn: "978-0-06-112008-4",
        coverImage: "https://example.com/covers/mockingbird.jpg",
        fileUrl: "https://example.com/books/mockingbird.pdf",
        format: "pdf",
        pages: 324,
        language: "English",
        publisher: "J.B. Lippincott & Co.",
        publishedDate: new Date("1960-07-11")
    },
    {
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction novel that follows the life of Winston Smith under the totalitarian regime of Big Brother.",
        category: "Fiction",
        price: 13.99,
        stock: 60,
        isbn: "978-0-452-28423-4",
        coverImage: "https://example.com/covers/1984.jpg",
        fileUrl: "https://example.com/books/1984.pdf",
        format: "pdf",
        pages: 328,
        language: "English",
        publisher: "Secker & Warburg",
        publishedDate: new Date("1949-06-08")
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "A romantic novel of manners that charts the emotional development of Elizabeth Bennet and her relationship with Mr. Darcy.",
        category: "Romance",
        price: 11.99,
        stock: 45,
        isbn: "978-0-14-143951-8",
        coverImage: "https://example.com/covers/pride-prejudice.jpg",
        fileUrl: "https://example.com/books/pride-prejudice.pdf",
        format: "pdf",
        pages: 432,
        language: "English",
        publisher: "T. Egerton",
        publishedDate: new Date("1813-01-28")
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        description: "The story of teenage rebellion and angst, following Holden Caulfield's experiences in New York City after being expelled from prep school.",
        category: "Fiction",
        price: 12.99,
        stock: 55,
        isbn: "978-0-316-76948-0",
        coverImage: "https://example.com/covers/catcher-rye.jpg",
        fileUrl: "https://example.com/books/catcher-rye.pdf",
        format: "pdf",
        pages: 234,
        language: "English",
        publisher: "Little, Brown and Company",
        publishedDate: new Date("1951-07-16")
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        description: "An exploration of how Homo sapiens came to dominate the world, examining our species' history from the Stone Age to the present.",
        category: "Non-Fiction",
        price: 18.99,
        stock: 40,
        isbn: "978-0-06-231609-7",
        coverImage: "https://example.com/covers/sapiens.jpg",
        fileUrl: "https://example.com/books/sapiens.pdf",
        format: "pdf",
        pages: 443,
        language: "English",
        publisher: "Harper",
        publishedDate: new Date("2011-09-04")
    },
    {
        title: "The Lean Startup",
        author: "Eric Ries",
        description: "A methodology for developing businesses and products that shortens their development cycles and helps entrepreneurs succeed.",
        category: "Business",
        price: 16.99,
        stock: 35,
        isbn: "978-0-307-88789-4",
        coverImage: "https://example.com/covers/lean-startup.jpg",
        fileUrl: "https://example.com/books/lean-startup.pdf",
        format: "pdf",
        pages: 336,
        language: "English",
        publisher: "Crown Business",
        publishedDate: new Date("2011-09-13")
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        description: "A comprehensive guide to building good habits and breaking bad ones, with practical strategies for self-improvement.",
        category: "Self-Help",
        price: 15.99,
        stock: 65,
        isbn: "978-0-7352-1129-2",
        coverImage: "https://example.com/covers/atomic-habits.jpg",
        fileUrl: "https://example.com/books/atomic-habits.pdf",
        format: "pdf",
        pages: 320,
        language: "English",
        publisher: "Avery",
        publishedDate: new Date("2018-10-16")
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description: "A fantasy adventure following Bilbo Baggins' journey with dwarves to reclaim their mountain home from the dragon Smaug.",
        category: "Fantasy",
        price: 13.99,
        stock: 70,
        isbn: "978-0-547-92822-7",
        coverImage: "https://example.com/covers/hobbit.jpg",
        fileUrl: "https://example.com/books/hobbit.pdf",
        format: "pdf",
        pages: 310,
        language: "English",
        publisher: "George Allen & Unwin",
        publishedDate: new Date("1937-09-21")
    },
    {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        description: "An exploration of cosmology for the general reader, covering the nature of the universe from the Big Bang to black holes.",
        category: "Science",
        price: 14.99,
        stock: 42,
        isbn: "978-0-553-38016-3",
        coverImage: "https://example.com/covers/brief-history-time.jpg",
        fileUrl: "https://example.com/books/brief-history-time.pdf",
        format: "pdf",
        pages: 256,
        language: "English",
        publisher: "Bantam Books",
        publishedDate: new Date("1988-03-01")
    }
];

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

// Seed books only
const seedBooksOnly = async () => {
    try {
        // Clear existing books
        await BookModal.deleteMany({});
        console.log("🗑️  Cleared existing books");

        await BookModal.insertMany(books);
        console.log(`✅ Created ${books.length} books`);
        console.log("\n📚 Books Categories:");
        const categories = [...new Set(books.map(book => book.category))];
        categories.forEach(category => console.log(`📖 ${category}`));
    } catch (error) {
        console.error("❌ Error seeding books:", error);
    }
};

// Main seeding function
const seedData = async () => {
    console.log("🌱 Starting books seeding...");
    
    await connectDB();
    await seedBooksOnly();
    
    console.log("✅ Books seeding completed!");
    
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
};

// Run seeder
seedData().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
