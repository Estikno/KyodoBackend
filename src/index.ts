import App from "./app";
import * as db from "./database";
import config from "./config";
import {io_setup} from "./socket";

const app: App = new App();

//configure the application
app.config();
app.routes();

//start application
app.listen();

console.log(config.MONGO_USER)
console.log(config.MONGO_PASSWORD)

//connect to the database
db.connectDB();

//io
io_setup();