import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(import.meta.dirname, "..", "files");

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        if (file.fieldname === "file") {
            return cb(null, uploadPath);
        } else {
            const finalPath = path.join(uploadPath, file.fieldname);

            if (!fs.existsSync(finalPath)) {
                fs.mkdirSync(finalPath);
            }

            return cb(null, finalPath);
        }

    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
    ]

    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf("."))     // Get last part after the dot

    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error(
            `Invalid file type: ${file.mimetype}. Only PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF, and WEBP files are allowed.`
        ), false);
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // Max 5 MB
        files: 10, // Max 10 files at once
    }
})