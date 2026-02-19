export default class APIResponse {

    static successResponse(res, data, message = "Success", statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        }

        return res.status(statusCode).json(response);
    }

    static errorResponse(res, message = "Error", statusCode = 500) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        }

        res.status(statusCode).json(response);
    }
}