import { ApiError } from "../utils/api-error.utils.js";
import { catchError } from "./error/catch-error.middleware.js";
import { User } from "../../database/models/user.model.js";
import { Company } from "../../database/models/company.model.js";


export const checkUserExist = catchError(async (req, res, next) => {
    const { email, mobileNumber } = req.body;
    const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (user) {
        if (email && user.email === email) {
            return next(new ApiError('Email already in use. Please use a different one.', 409, 'checkUserExist middleware'));
        }
        if (mobileNumber && user.mobileNumber === mobileNumber) {
            return next(new ApiError('Mobile number already in use. Please use a different one.', 409, 'checkUserExist middleware'));
        }
    }
    next();
});


export const checkCompanyExist = catchError(async (req, res, next) => {
    const { companyName, companyEmail } = req.body;
    const { _id } = req.user
    const company = await Company.findOne({
        $or:
            [
                { companyEmail },
                { companyName },
                { companyHR: _id }
            ]
    });
    if (company) {
        if (companyName && company.companyName === companyName) {
            return next(new ApiError('Name already in use. Please use a different one.', 409, 'checkUserExist middleware'));
        }
        if (companyEmail && company.companyEmail === companyEmail) {
            return next(new ApiError('Email already in use. Please use a different one.', 409, 'checkUserExist middleware'));
        }
        if (req.method === 'POST' && company.companyHR.toString() === _id.toString()) {

            return next(new ApiError('Sorry, you can only create one company per account. If you need to manage multiple companies, please contact support for assistance.', 409, 'checkUserExist middleware'));
        }



    }

    next();
});