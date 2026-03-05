import BookModal from "../modal/bookModal.js";
import APIResponse from "../utils/APIResponse.js";

export const getBookController = async (req, res) => {
    try {
        const Books = await BookModal.find();
        // res.status(200).json(Books);

        APIResponse.successResponse(
            res,
            {
                books: Books,
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

        console.log("Cover Image Path:", coverImagePath);
        console.log("File Path:", filePath);

        // Validate required fields
        // if (!title || !author || !description || !category || !price || !format || !pages || !language || !publisher || !publishedDate) {
        //     return APIResponse.errorResponse(res, "Missing required fields", 400);
        // }

        // Create new book
        const newBook = new BookModal({
            title,
            author,
            description,
            category,
            price: parseFloat(price),
            coverImage: coverImagePath,
            fileUrl: filePath,
            format,
            pages: parseInt(pages),
            stock: parseInt(stock) || 0,
            language,
            publisher,
            publishedDate: new Date(publishedDate),
            isbn: isbn || undefined,
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
        
        if(!bookDetail) {
            APIResponse.errorResponse(res, "Book not found", 404)
        }

        APIResponse.successResponse(res, {bookDetail}, "Book Details Fetched Successfully", 200);

    } catch (err) {
        APIResponse.errorResponse(res, err?.message || err, 500)
    }
}
