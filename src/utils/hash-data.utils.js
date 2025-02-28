import crypto from 'crypto';
import bcrypt from 'bcryptjs';




export const cryptoHashData = (data) => {
    const hashed = crypto.createHash('sha256').update(data).digest('hex');
    return hashed;
}


export const bcryptHashData = (data) => {
    const hashed = bcrypt.hashSync(data, +process.env.BCRYPT_SALT);
    return hashed;
}


export const bcryptCompare = (data, hashData) => {
    const result = bcrypt.compareSync(data, hashData);
    return result;
}