import { AppError } from "../utils/AppError.js";
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    console.error('Unexpected error: ', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });
};
//# sourceMappingURL=errorHandler.js.map