import { ApiError } from "../utils/api-error.utils.js";
import { catchError } from "./error/catch-error.middleware.js";



export const checkOwnerMiddleware = (Model, ownerField) => {
    return catchError(async (req, res, next) => {
        const docFounded = await Model.findById(req.params.id);

        if (!docFounded) return next(new ApiError('Oops,not found!', 404, 'check Owner Middleware'));

        if (docFounded[ownerField].toString() !== req.user._id.toString()) {
            return next(new ApiError(`You are not allowed to perform this action.`, 403, 'check Owner Middleware'));
        }

        req.docFounded = docFounded;
        next();
    })
}
