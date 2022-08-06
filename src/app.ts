import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config';

//routes
import userRouter from './routes/user.routes';

class App {
  private app: Application;

  constructor() {
    this.app = express();
    /*this.config();
    this.routes();*/
  }

  config(): void {
    this.app.set('port', config.PORT);
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes(): void {
    this.app.use('/user', userRouter);
  }

  listen(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server on port', this.app.get('port'));
    }
    );
  }
}

export default App;