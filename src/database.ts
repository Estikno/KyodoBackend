import mongoose, { ConnectOptions } from 'mongoose';
import config from './config';

export async function connectDB() {
    try{
        const options: ConnectOptions = {
            /* user: config.MONGO_USER,
            pass: config.MONGO_PASSWORD */
        }

        const db = await mongoose.connect(`mongodb://${config.MONGO_HOST}/${config.MONGO_DATABASE}`, options);
        console.log(`Database connected: ${db.connection.name}`);
    }
    catch(err){
        console.log(err);
    }   
}