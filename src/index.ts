import App from "./app";
import * as db from "./database";
import { io_setup } from "./socket";
import http from "http";
import { Server } from "socket.io";
import dbBasicData from "./utils/dbBasicData";
import { ApolloServer } from "@apollo/server";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

const app: App = new App();
const server = http.createServer(app.getServer());
const io = new Server(server, { cors: { origin: "*" } });
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
});

//configure the application
//app.config();
//app.routes();
app.startGraphqlRoute(apollo);

//start application
app.listen(server);

//connect to the database
db.connectDB();

//io
io_setup(io);

//set basic data
dbBasicData();