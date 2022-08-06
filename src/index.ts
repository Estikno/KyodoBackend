import App from './app'
import * as db from './database'

const app: App = new App();


//configure the application
app.config();
app.routes();
app.listen();

//connect to the database
db.connectDB();