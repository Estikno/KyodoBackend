import dotenv from 'dotenv';

dotenv.config();

/**
 * * Put all the important configs here and import it in the other scripts
 * ! Put the really important configs in the .env, such as: username, password, etc.
 */
export default {
    MONGO_DATABASE: process.env.MONGO_DATABASE || 'kyodo',
    MONGO_USER: process.env.MONGO_USER || 'admin',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'admin',
    MONGO_HOST: process.env.MONGO_HOST || 'localhost',
    PORT: process.env.PORT || 4758
}