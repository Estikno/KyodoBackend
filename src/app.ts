import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config';

//routes
import userRouter from './routes/user.routes';
import roomTypeRouter from './routes/roomType.routes';
import authRouter from './routes/auth.routes'
import profileRouter from './routes/profile.routes';

class App {
  private app: Application; //! Do not give public access to the app object

  //TODO: Call all the config and routes methods, and also make that methods private
  constructor() {
    this.app = express();
    /*this.config();
    this.routes();*/
  }

  public config(): void {
    this.app.set('port', config.PORT);
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());

    //! Use this middleware to upload files only on the necessary routes that need it
    /*this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: './uploads'
    }));*/
    
    this.app.use(express.urlencoded({ extended: false }));
  }

  //* Impotant to add the routes here, otherwise the routes will not be available, and also set the prefix for the routes
  public routes(): void {
    this.app.use('/user', userRouter);
    this.app.use('/roomType', roomTypeRouter);
    this.app.use('/auth', authRouter);
    this.app.use('/profile', profileRouter);
  }

  public listen(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server on port', this.app.get('port'));
    }
    );
  }
}

export default App;