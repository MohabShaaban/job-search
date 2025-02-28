import { DateTime } from 'luxon';

import { User } from '../../database/models/user.model.js';
import { verifyToken } from '../utils/token.utils.js';
import { ApiError } from '../utils/api-error.utils.js';
import { catchError } from './error/catch-error.middleware.js';
import { userStatus } from '../utils/constants/user-status.js';



export const auth = catchError(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization?.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError('Access denied. You are not login.', 401));
    };

    // check if the valid 
    const decoded = verifyToken(token, process.env.JWT_SECRET_KEY)

    // check if user is exist.
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError('The user that belong to this token does no longer exist.', 401));
    };

    // check if user email is confirm.
    if (!currentUser.isConfirmed) {
        return next(new ApiError('Please confirm your email address.', 401));
    };

    // check if password change after create token 
    if (currentUser.passwordChangedAt) {
        const passChangedAimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        if (passChangedAimestamp > decoded?.iat) {
            return next(new ApiError('User recently changed his password. please login again.', 401));
        };
    };

    // Check if user has logged out
    if (currentUser.status === userStatus.OFFLINE && currentUser.logOut) {
        const currentTime = DateTime.now();
        const logoutTime = DateTime.fromISO(currentUser.logOut);

        if (currentTime > logoutTime) {
            return next(new ApiError('Please login.', 401));
        }
    }

    req.user = currentUser;
    next();
});