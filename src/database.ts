import mongoose, { ConnectOptions } from 'mongoose';
import config from './config';

export async function connectDB() {
    try{
        //TODO: Add to the config the user and password for the mongo db
        const options: ConnectOptions = {
            user: config.MONGO_USER,
            pass: config.MONGO_PASSWORD,
        }

        mongoose.set("strictQuery", false);
        const db = await mongoose.connect(`mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DATABASE}`);
        console.log(`Database connected: ${db.connection.name}`);
    }
    catch(err){
        console.log(err);
    }   
}