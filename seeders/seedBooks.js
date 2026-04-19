import BookModal from "../modal/bookModal.js";

// Base book data (without dynamic references)
const baseBooks = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the mysterious Jay Gatsby.",
        categoryName: "fiction",
        price: 12.99,
        discount: 0,
        stock: 50,
        isbn: "978-0-7432-7356-5",
        coverImage: "files/coverImage/psychology-of-money.png",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "fiction",
        price: 14.99,
        discount: 5,
        stock: 75,
        isbn: "978-0-06-112008-4",
        coverImage: "files/coverImage/hidden-hindu.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "fiction",
        price: 13.99,
        discount: 10,
        stock: 60,
        isbn: "978-0-452-28423-4",
        coverImage: "files/coverImage/rich-dad.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "romance",
        price: 11.99,
        discount: 0,
        stock: 45,
        isbn: "978-0-14-143951-8",
        coverImage: "files/coverImage/effective-people.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "fiction",
        price: 12.99,
        discount: 0,
        stock: 55,
        isbn: "978-0-316-76948-0",
        coverImage: "files/coverImage/atomic-habits.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "non-fiction",
        price: 18.99,
        discount: 15,
        stock: 40,
        isbn: "978-0-06-231609-7",
        coverImage: "files/coverImage/AI.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "business",
        price: 16.99,
        discount: 10,
        stock: 35,
        isbn: "978-0-307-88789-4",
        coverImage: "files/coverImage/deep-work.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "self-help",
        price: 15.99,
        discount: 20,
        stock: 65,
        isbn: "978-0-7352-1129-2",
        coverImage: "files/coverImage/the-lean-startup.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "fantasy",
        price: 13.99,
        discount: 0,
        stock: 70,
        isbn: "978-0-547-92822-7",
        coverImage: "files/coverImage/zero-to-one.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
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
        categoryName: "science",
        price: 14.99,
        discount: 5,
        stock: 42,
        isbn: "978-0-553-38016-3",
        coverImage: "files/coverImage/fast-and-slow.jpeg",
        fileUrl: "files/the-psychology-of-money-timeless-lessons-on-wealth-greed-and-happiness-morgan-housel-z-lib.org_.pdf",
        format: "pdf",
        pages: 256,
        language: "English",
        publisher: "Bantam Books",
        publishedDate: new Date("1988-03-01")
    }
];

// Build books with proper references
const buildBooks = (userId, categoryMap) => {
    return baseBooks.map(book => ({
        ...book,
        categoryId: categoryMap[book.categoryName.toLowerCase()],
        createdBy: userId,
        updatedBy: userId
    }));
};

// Seed books only
export const seedBooksOnly = async (userId, categoryMap) => {
    try {
        if (!userId || !categoryMap) {
            throw new Error("userId and categoryMap are required");
        }

        // Clear existing books
        await BookModal.deleteMany({});
        console.log("🗑️  Cleared existing books");

        const books = buildBooks(userId, categoryMap);
        await BookModal.insertMany(books);
        console.log(`✅ Created ${books.length} books`);
        console.log("\n📚 Books Categories:");
        const categories = [...new Set(baseBooks.map(book => book.categoryName))];
        categories.forEach(category => console.log(`📖 ${category}`));
    } catch (error) {
        console.error("❌ Error seeding books:", error);
    }
};
