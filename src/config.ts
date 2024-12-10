import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('jwt not defined');
}

export default {
    jwtSecret: JWT_SECRET,
};
