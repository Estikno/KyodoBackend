import App from "./app";
import * as db from "./database";
import config from "./config";
import { Server, Socket } from "socket.io";
import Message from "./models/Message";
import User from "./models/User";
import {createMessage, getMessages} from './utils/message.util';
import {IUserResponse} from './interfaces/IClientResponse';

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

const connectedUsers: Map<string, string> = new Map();

io.on("connection", (socket: Socket) => {
    socket.on("add-user", async (user) => {
        const newUser = await User.findOne({username: user});

        const allMessages: string[] = (await getMessages()).map(each => each.message);
        socket.emit("all-msg", (allMessages).toString());
        
        if(connectedUsers.get(user)) return;
        if(!newUser) return;

        connectedUsers.set(user, socket.id);

        const newUserResponse: IUserResponse = {avatarUrl: newUser.avatarImage.avatarImageUrl, email: newUser.email, username: newUser.username};
        socket.broadcast.emit("new-usr", newUserResponse);
        console.log(user);
    });

    socket.on("send-msg", async (msg) => {
        const foundUser = await User.findOne({ username: msg.person });
        
        if (foundUser) {
            await createMessage(foundUser._id, msg.message);
            socket.broadcast.emit("msg", msg.message);
        }
    });
});
