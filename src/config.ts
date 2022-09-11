import dotenv from 'dotenv';

dotenv.config();

/**
 * * Put all the important configs here and import it in the other scripts
 * ! Put the really important configs in the .env, such as: username, password, etc.
 */
export default {
    MONGO_DATABASE: process.env.MONGO_DATABASE,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_HOST: process.env.MONGO_HOST,
    PORT: process.env.PORT,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.CLOUD_API_KEY,
    API_SECRET: process.env.CLOUD_API_SECRET,
    DEFAULT_AVATAR_URL: process.env.DEFAULT_AVATAR_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_DURATION: process.env.JWT_DURATION,
}