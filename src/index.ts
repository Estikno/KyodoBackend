import App from './app'
import * as db from './database'
import config from './config';
import {Server} from 'socket.io';

const app: App = new App();

//configure the application
app.config();
app.routes();

//io
const io = new Server(5050, {cors: {origin: "*"}})

io.on('connection', (socket) => {
    console.log("user connected");

    io.emit("hello", "wolrd");
});

//start application
app.listen();

//connect to the database
db.connectDB();

//configure the initial values of the database
app.dbInitialValues();