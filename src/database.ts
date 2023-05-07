import mongoose, { ConnectOptions } from "mongoose";
import config from "./config";

/**
 * Connects to a MongoDB database using the Mongoose library and the config in the .env file
 */
export async function connectDB() {
    try {
        //TODO: Add to the config the user and password for the mongo db
        const options: ConnectOptions = {
            auth: {
                username: config.MONGO_USER,
                password: config.MONGO_PASSWORD,
            },
            authSource: "admin",
        };

        mongoose.set("strictQuery", true);
        const db = await mongoose.connect(
            `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DATABASE}` //, options
        );
        console.log(`Database connected: ${db.connection.name}`);
    } catch (err) {
        console.log(err);
    }
}

export async function closeDB() {
    await mongoose.connection.close();
}