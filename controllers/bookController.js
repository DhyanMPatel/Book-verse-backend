import "dotenv/config";
import BookModal from "../modal/bookModal.js";
import { CategoryModal } from "../modal/categoryModel.js";
import APIResponse from "../utils/APIResponse.js";

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
                category: Category?.name || book.categoryId || "",
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
            stock: parseInt(stock) || 0,
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
