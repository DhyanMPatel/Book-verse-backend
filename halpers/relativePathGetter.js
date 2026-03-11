import path from "path";

// Helper function to convert absolute path to relative path
export const getRelativeFilePath = (absolutePath) => {
    const projectRoot = path.join(import.meta.dirname, "..");
    return path.relative(projectRoot, absolutePath).replace(/\\/g, '/');
};

// Helper function to convert relative path to absolute path
export const getAbsoluteFilePath = (relativePath) => {
    const projectRoot = path.join(import.meta.dirname, "..");
    return path.join(projectRoot, relativePath);
};

// Middleware to modify req.files to contain relative paths instead of absolute paths
export const processFilePaths = (req, res, next) => {
    // Handle multiple files upload (upload.fields() creates an object)
    if (req.files && typeof req.files === 'object') {
        Object.keys(req.files).forEach(fieldName => {
            if (Array.isArray(req.files[fieldName])) {
                req.files[fieldName] = req.files[fieldName].map(file => ({
                    ...file,
                    path: getRelativeFilePath(file.path),
                    destination: getRelativeFilePath(file.destination)
                }));
            }
        });
    }
    // Handle single file upload (upload.single() creates a file object)
    else if (req.file) {
        req.file = {
            ...req.file,
            path: getRelativeFilePath(req.file.path),
            destination: getRelativeFilePath(req.file.destination)
        };
    }
    // Handle array of files (upload.array() creates an array)
    else if (req.files && Array.isArray(req.files)) {
        req.files = req.files.map(file => ({
            ...file,
            path: getRelativeFilePath(file.path),
            destination: getRelativeFilePath(file.destination)
        }));
    }
    next();
};