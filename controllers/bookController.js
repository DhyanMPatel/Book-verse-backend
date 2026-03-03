import BookModal from "../modal/bookModal.js";
import APIResponse from "../utils/APIResponse.js";

export const getBookController = async (req, res) => {
    try {
        const Books = await BookModal.find();
        // res.status(200).json(Books);

        APIResponse.successResponse(res, {
                    books: Books,
                }, "Books fetched successfully", 200)
    } catch (error) {
        // res.status(500).json({ message: error.message });

        APIResponse.errorResponse(res, error.message, 500)
    }
}

// export const createBookController = async (req, res) => {
//     try {
//         const {} = req.body
//         const Books = await BookModal.find();
//         // res.status(200).json(Books);

//         APIResponse.successResponse(res, {
//                     books: Books,
//                 }, "Books created successfully", 201)
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }
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