import { ApiError } from './../utils/api-error.utils.js';
import { catchError } from './error/catch-error.middleware.js';

const reqKeys = ['body', 'params', 'query', 'headers', 'file'];


export const validatorMiddleware = (schema) => {
    return catchError(async (req, res, next) => {
        let validationErrors = []; // Array to collect any validation errors found
        for (const key of reqKeys) {
            // Check if the schema contains a validation rule for the current key
            if (schema[key]) {
                // Find the validation errors in the request 
                let { error } = schema[key].validate(req[key], { abortEarly: false });
                if (error) { validationErrors.push(...error.details); }
            }
        }

        // If there are any validation errors, format and pass them to the next middleware as an ApiError
        if (validationErrors.length) {
            let errsMsg = validationErrors.map(err => ({
                key: err.context.key,
                message: err.message
            }));
            return next(new ApiError(`validation error`, 400, 'validation', errsMsg))
        }

        // No validation errors, call the next middleware or handler
        next();
    }
    )
};