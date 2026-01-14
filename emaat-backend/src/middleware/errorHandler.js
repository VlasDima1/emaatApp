/**
 * Global Error Handler Middleware
 */

class AppError extends Error {
    constructor(message, statusCode, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Async handler wrapper to avoid try-catch in every route
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not Found handler
 */
const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
    next(error);
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let code = err.code || 'INTERNAL_ERROR';
    
    // Log error for debugging
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            statusCode
        });
    }
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
    }
    
    if (err.code === 'EREQUEST' || err.code === 'ESOCKET') {
        statusCode = 500;
        message = 'Database error occurred';
        code = 'DATABASE_ERROR';
    }
    
    // SQL Server specific errors
    if (err.number === 2627) { // Unique constraint violation
        statusCode = 409;
        message = 'Duplicate entry. This record already exists.';
        code = 'DUPLICATE_ENTRY';
    }
    
    if (err.number === 547) { // Foreign key violation
        statusCode = 400;
        message = 'Invalid reference. Related record not found.';
        code = 'FOREIGN_KEY_ERROR';
    }
    
    res.status(statusCode).json({
        success: false,
        error: message,
        code,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = {
    AppError,
    asyncHandler,
    notFoundHandler,
    errorHandler
};
