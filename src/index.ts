import App from "./app";
import * as db from "./database";
import config from "./config";
import { Server, Socket } from "socket.io";
import Message from "./models/Message";
import User from "./models/User";
import {createMessage, getMessages} from './utils/message.util';

const app: App = new App();

//configure the application
app.config();
app.routes();

//start application
app.listen();

//connect to the database
db.connectDB();

//io
const io = new Server(5050, { cors: { origin: "*" } });

io.on("connection", (socket: Socket) => {
    
    socket.on("add-user", async (user) => {
        const allMessages: string[] = (await getMessages()).map(each => each.message)
        socket.emit("all-msg", (allMessages).toString());
    });

    socket.on("send-msg", async (msg) => {
        const foundUser = await User.findOne({ username: msg.person });
        
        if (foundUser) {
            await createMessage(foundUser._id, msg.message);
            socket.broadcast.emit("msg", msg.message);
        }
    });
});
