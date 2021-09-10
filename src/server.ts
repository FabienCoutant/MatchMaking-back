import * as express from 'express';
import * as http from 'http';
import {socketServer} from "./websocket";

const app = express();
app.set("port", process.env.PORT || 8999);

//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
socketServer({server})
//start server
server.listen(app.get("port"), () => {
    console.log(`Server started on port : ${app.get("port")}`);
});
