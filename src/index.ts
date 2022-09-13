import App from './app'
import * as db from './database'
import config from './config';

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