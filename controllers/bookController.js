import "dotenv/config";
import BookModal from "../modal/bookModal.js";
import { CategoryModal } from "../modal/categoryModel.js";
import APIResponse from "../utils/APIResponse.js";
import fs from "fs/promises";
import mongoose from "mongoose";


export const getBookController = async (req, res) => {
    try {
        const Books = await BookModal.find();

        
        const booksData = await Promise.all(Books.map(async (book) => {
            const Category = await CategoryModal.findById(book.categoryId);
            return {
                id: book._id,
                title: book.title,
                author: book.author,
                description: book.description,
                category: Category?.name || book.categoryId || book.categoryId?.name || "" ,
                price: book.price,
                discount: book.discount,
                coverImage: `${process.env.BASE_URL}/${book.coverImage}`,
                avgRating: book.avgRating || 0,
                totalReviews: book.totalReviews || 0,
            }
        }))

        if (booksData.length === 0) {
            return APIResponse.successResponse(res, [], "No books found", 200)
        }

        APIResponse.successResponse(
            res,
            {
                books: booksData,
            },
            "Books fetched successfully",
            200,
        );
    } catch (error) {
        // res.status(500).json({ message: error.message });

        APIResponse.errorResponse(res, error?.message || error, 500);
    }
};

export const createBookController = async (req, res) => {
    try {
        const {
            title,
            author,
            description,
            category,
            price,
            discount,
            stock,
            format,
            pages,
            language,
            publisher,
            publishedDate,
            isbn,
        } = req.body;

        // Get file paths from uploaded files
        const coverImagePath = req.files?.coverImage?.[0]?.path;
        const filePath = req.files?.file?.[0]?.path;

        // Get authenticated user ID
        const userId = req.user.id;

        // Validate required fields
        if (!title || !author || !description || !category || !price || !coverImagePath || !filePath || !format || !pages || !language || !publisher || !discount || !publishedDate) {
            return APIResponse.errorResponse(res, "Missing required fields", 400);
        }

        const categoryData = await CategoryModal.findOne({ name: category.trim().toLowerCase() });

        if (!categoryData) {
            return APIResponse.errorResponse(res, "Category not Found", 400);
        }

        // Create new book
        const newBook = new BookModal({
            title,
            author,
            description,
            categoryId: categoryData?._id,
            price: parseFloat(price),
            discount: parseInt(discount || 0),
            coverImage: coverImagePath,
            fileUrl: filePath,
            format,
            pages: parseInt(pages),
            stock: parseInt(stock) || 1,
            language,
            publisher,
            publishedDate: new Date(publishedDate),
            isbn: isbn || undefined,
            createdBy: userId,
            updatedBy: userId,
        });

        const savedBook = await newBook.save();

        APIResponse.successResponse(
            res,
            {
                book: savedBook,
            },
            "Book created successfully",
            201,
        );
    } catch (error) {
        console.error("Error creating book:", error);
        APIResponse.errorResponse(res, error.message, 500);
    }
};

// export const patchBookController = async (req, res) => {
//     try {
//         const Books = await BookModal.find();
//         res.status(200).json(Books);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }
// export const putBookController = async (req, res) => {
//     try {
//         const Books = await BookModal.find();
//         res.status(200).json(Books);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }
// export const deleteBookController = async (req, res) => {
//     try {
//         const Books = await BookModal.find();
//         res.status(200).json(Books);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }


// Book Details

export const getBookDetailsController = async (req, res) => {
    try {
        const id = req.params.id;

        const bookDetail = await BookModal.findById(id)
        const category = await CategoryModal.findById(bookDetail.categoryId);

        const bookDetailData = {
            id: bookDetail._id,
            title: bookDetail.title,
            author: bookDetail.author,
            description: bookDetail.description,
            category: category.name || bookDetail?.categoryId || "",
            price: bookDetail.price,
            discount: bookDetail.discount,
            coverImage: `${process.env.BASE_URL}/${bookDetail.coverImage}`,
            fileUrl: `${process.env.BASE_URL}/${bookDetail.fileUrl}`,
            format: bookDetail.format,
            pages: bookDetail.pages,
            stock: bookDetail.stock,
            language: bookDetail.language,
            publisher: bookDetail.publisher,
            publishedDate: bookDetail.publishedDate,
            isbn: bookDetail.isbn,
            avgRating: bookDetail.avgRating || 0,
            totalReviews: bookDetail.totalReviews || 0,
        }

        if (!bookDetail) {
            APIResponse.errorResponse(res, "Book not found", 404)
        }

        APIResponse.successResponse(res, { bookDetailData }, "Book Details Fetched Successfully", 200);

    } catch (err) {
        APIResponse.errorResponse(res, err?.message || err, 500)
    }
}

export const deleteBookController = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await BookModal.findById(id);

        if (!book) {
            return APIResponse.errorResponse(res, "Book not found", 404);
        }

        // Delete files
        try {
            if (book.coverImage) await fs.unlink(book.coverImage);
        } catch (err) {}

        try {
            if (book.fileUrl) await fs.unlink(book.fileUrl);
        } catch (err) {}

        // Delete DB record
        await BookModal.findByIdAndDelete(id);

        return APIResponse.successResponse(res, null, "Book deleted successfully", 200);
    } catch (error) {
        console.error("Error deleting book:", error);
        return APIResponse.errorResponse(res, error.message, 500);
    }
};


// update book controller

export const updateBookController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return APIResponse.errorResponse(res, "Book ID is required", 400);
        }

        const book = await BookModal.findById(id);

        if (!book) {
            return APIResponse.errorResponse(res, "Book not found", 404);
        }

        const {
            title,
            author,
            description,
            category,
            price,
            discount,
            stock,
            format,
            pages,
            language,
            publisher,
            publishedDate,
            isbn,
        } = req.body;

        const userId = req.user.id;

        // Handle category
        let categoryId = book.categoryId;

        if (category) {
            const categoryData = await CategoryModal.findOne({
                name: category.trim().toLowerCase(),
            });

            if (!categoryData) {
                return APIResponse.errorResponse(res, "Category not found", 400);
            }

            categoryId = categoryData._id;
        }

        // ✅ Check for new uploaded files
        const newCoverImage = req.files?.coverImage?.[0]?.path;
        const newFile = req.files?.file?.[0]?.path;

        // ✅ Check for existing paths sent as strings from frontend
        const existingCoverImagePath = req.body.coverImage;
        const existingFilePath = req.body.file;

        // 🔥 Delete old files only if new ones are uploaded
        if (newCoverImage && book.coverImage) {
            try {
                await fs.unlink(book.coverImage);
            } catch (err) {
                console.error("Failed to delete old cover image:", err);
            }
        }

        if (newFile && book.fileUrl) {
            try {
                await fs.unlink(book.fileUrl);
            } catch (err) {
                console.error("Failed to delete old file:", err);
            }
        }

        // Update text fields (only if provided)
        book.title = title ?? book.title;
        book.author = author ?? book.author;
        book.description = description ?? book.description;
        book.categoryId = categoryId;
        book.price = price ? parseFloat(price) : book.price;
        book.discount = discount ? parseInt(discount) : book.discount;
        book.stock = stock ? parseInt(stock) : book.stock;
        book.format = format ?? book.format;
        book.pages = pages ? parseInt(pages) : book.pages;
        book.language = language ?? book.language;
        book.publisher = publisher ?? book.publisher;
        book.publishedDate = publishedDate ? new Date(publishedDate) : book.publishedDate;
        book.isbn = isbn ?? book.isbn;

        // ✅ Update coverImage:
        // new file uploaded → use new path
        // existing string path sent from frontend → keep it
        // nothing sent → keep current db value
        if (newCoverImage) {
            book.coverImage = newCoverImage;
        } else if (existingCoverImagePath && typeof existingCoverImagePath === "string") {
            book.coverImage = existingCoverImagePath;
        }

        // ✅ Same logic for file
        if (newFile) {
            book.fileUrl = newFile;
        } else if (existingFilePath && typeof existingFilePath === "string") {
            book.fileUrl = existingFilePath;
        }

        // Update user
        book.updatedBy = userId;

        const updatedBook = await book.save();

        return APIResponse.successResponse(
            res,
            { book: updatedBook },
            "Book updated successfully",
            200
        );
    } catch (error) {
        console.error("Error updating book:", error);
        return APIResponse.errorResponse(res, error.message, 500);
    }
};

export const downloadBookController = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await BookModal.findById(id);

        if (!book) {
            return APIResponse.errorResponse(res, "Book not found", 404);
        }

        if (!book.fileUrl) {
            return APIResponse.errorResponse(res, "No file available for this book", 404);
        }

        // Verify file exists on disk
        try {
            await fs.access(book.fileUrl);
        } catch {
            return APIResponse.errorResponse(res, "File not found on server", 404);
        }

        // Build a clean filename: e.g. "the-great-gatsby.pdf"
        const extension = book.fileUrl.split(".").pop();
        const filename = `${book.title.replace(/\s+/g, "-").toLowerCase()}.${extension}`;

        // Set headers to trigger browser download
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        // Stream the file to the response
        const { createReadStream } = await import("fs");
        const fileStream = createReadStream(book.fileUrl);

        fileStream.on("error", () => {
            return APIResponse.errorResponse(res, "Error reading file", 500);
        });

        fileStream.pipe(res);

    } catch (error) {
        console.error("Error downloading book:", error);
        return APIResponse.errorResponse(res, error.message, 500);
    }
};

// admin side analytics - genre distribution

export const getGenreAnalyticsController = async (req, res) => {
    try {
        // Get all books with their category
        const books = await BookModal.find().populate("categoryId", "name");

        // Count books per category in memory
        const genreMap = {};

        books.forEach(book => {
            const categoryName = book.categoryId?.name || "Unknown";
            if (genreMap[categoryName]) {
                genreMap[categoryName]++;
            } else {
                genreMap[categoryName] = 1;
            }
        });

        // Convert to array format for frontend chart
        const genres = Object.entries(genreMap)
            .map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value
            }))
            .sort((a, b) => b.value - a.value);

        return APIResponse.successResponse(
            res,
            { genres },
            "Genre analytics fetched successfully",
            200
        );

    } catch (err) {
        console.error("Genre analytics error:", err.message);
        return APIResponse.errorResponse(res, err.message, 500);
    }
};
