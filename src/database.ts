import mongoose, { ConnectOptions } from 'mongoose';
import config from './config';

export async function connectDB() {
    try{
        //TODO: Add to the config the user and password for the mongo db
        const options: ConnectOptions = {
            auth: {
                username: config.MONGO_USER,
                password: config.MONGO_PASSWORD
            },
            authSource: "admin"
        }

        mongoose.set("strictQuery", false);
        const db = await mongoose.connect(`mongodb://mongo:hlbrvI3SX5DRh5We8xOa@containers-us-west-195.railway.app:5838/kyodo`);
        console.log(`Database connected: ${db.connection.name}`);
    }
    catch(err){
        console.log(`mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DATABASE}`)
        console.log(err);
    }   
}