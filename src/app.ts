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
    /**
     * Initializes the app property as an instance of Express
     */
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    /**
     * Sets various configurations for the Express server, such as the port to listen on, the logging middleware, and CORS. It also sets up JSON and URL-encoded body parsing.
     */
    private config(): void {
        this.app.set("port", config.PORT);
        this.app.use(morgan("dev"));
        this.app.use(cors());
        this.app.use(express.json());

        this.app.use(express.urlencoded({ extended: false }));
    }

    //* Impotant to add the routes here, otherwise the routes will not be available, and also set the prefix for the routes
    /**
     * Defines the routes for various resources and adds them to the Express server instance.
     */
    private routes(): void {
        this.app.use("/user", userRouter);
        this.app.use("/auth", authRouter);
        this.app.use("/profile", profileRouter);
        this.app.use("/admin", adminRouter);
    }

    /**
     * Initializes the Apollo Server and sets up the /graphql route on the Express server instance.
     * @param server the apollo server to initialize
     */
    public async startGraphqlRoute(server: ApolloServer): Promise<void> {
        await server.start();
        this.app.use("/graphql", expressMiddleware(server));
    }

    /**
     * Starts the server listening on the configured port
     * @param httpServer the http server to initialize
     */
    public listen(httpServer: Server): void {
        httpServer.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
        });
    }

    /**
     * Returns the Express server instance
     * @returns Express server instance
     */
    public getServer(): Application {
        return this.app;
    }
}

export default App;
