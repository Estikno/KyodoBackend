import App from './app'
import * as db from './database'
import config from './config';
import {Server, Socket} from 'socket.io';
import Message from './models/Message';
import User from './models/User';

const app: App = new App();

//configure the application
app.config();
app.routes();

//start application
app.listen();

//connect to the database
db.connectDB();

//configure the initial values of the database
app.dbInitialValues();

//io
const io = new Server(5050, {cors: {origin: "*"}})

const connectedUsers: Map<string, string> = new Map();

io.on('connection', (socket: Socket) => {
    console.log("user connected");

    socket.on('add-user', (user) => {
        console.log("user added");
        connectedUsers.set(user, socket.id);
    })

    socket.on('get-messages', async (room) => {
        const foundUser = await User.findOne({username: room.username});
        const sendUserSocket = connectedUsers.get(room.username);

        if(foundUser && sendUserSocket){
            const messages = await Message.find({idRoom: room.id, idUser: foundUser._id});
            socket.to(sendUserSocket).emit("messages", messages.map(message => message.populate("idUser")));
        }
    })
});