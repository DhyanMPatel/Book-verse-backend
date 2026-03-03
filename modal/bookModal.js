import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
        maxlength: [100, "Author name cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business', 'Self-Help', 'Biography', 'History', 'Romance', 'Mystery', 'Fantasy', 'Other'],
        trim: true,
        maxlength: [50, "Category cannot exceed 50 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover Image is required"],
        trim: true,
    },
    fileUrl: {
        type: String,
        required: [true, "File URL is required"],
        trim: true,
    },
    format: {
        type: String,
        enum: ["pdf", "epub", "mobi", "audiobook"],
        required: [true, "Format is required"],
        default: "pdf",
        trim: true
    },
    pages: {
        type: Number,
        required: [true, "Number of pages is required"],
        min: [1, "Pages must be at least 1"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    isbn: {
        type: String,
        required: [true, "ISBN is required"],
        unique: true,
        trim: true,
        match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please enter a valid ISBN']
    },
    language: {
        type: String,
        required: [true, "Language is required"],
        trim: true,
        maxlength: [50, "Language cannot exceed 50 characters"]
    },
    publisher: {
        type: String,
        required: [true, "Publisher is required"],
        trim: true,
        maxlength: [100, "Publisher name cannot exceed 100 characters"]
    },
    publishedDate: {
        type: Date,
        required: [true, "Published date is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const BookModal = mongoose.model("books", bookSchema);
export default BookModal;