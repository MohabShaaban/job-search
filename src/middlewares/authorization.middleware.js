import { ApiError } from "../utils/api-error.utils.js"
import { catchError } from './error/catch-error.middleware.js';


export const athorization = (allowedRoles) => {
    return catchError(async (req, res, next) => {

        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return next(new ApiError('You are not allowed to access this route.', 403, 'Authorization Error'))
        }

        next();
    });
}
