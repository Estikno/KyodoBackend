import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config";
import { Server } from "http";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";

//routes
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import adminRouter from "./routes/admin.routes";

class App {
    private app: Application; //! Do not give public access to the app object

    //TODO: Call all the config and routes methods, and also make that methods private
    constructor() {
        this.app = express();
        /*this.config();
    this.routes();*/
    }

    public config(): void {
        this.app.set("port", config.PORT);
        this.app.use(morgan("dev"));
        this.app.use(cors());
        this.app.use(express.json());

        this.app.use(express.urlencoded({ extended: false }));
    }

    //* Impotant to add the routes here, otherwise the routes will not be available, and also set the prefix for the routes
    public routes(): void {
        this.app.use("/user", userRouter);
        this.app.use("/auth", authRouter);
        this.app.use("/profile", profileRouter);
        this.app.use("/admin", adminRouter);
    }

    public async startGraphqlRoute(server: ApolloServer): Promise<void> {
        await server.start();
        this.app.use("/graphql", expressMiddleware(server));
    }

    public listen(httpServer: Server): void {
        httpServer.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
        });
    }

    public getServer(): Application {
        return this.app;
    }
}

export default App;
