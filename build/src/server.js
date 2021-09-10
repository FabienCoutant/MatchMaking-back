"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const websocket_1 = require("./websocket");
const app = express();
app.set("port", process.env.PORT || 8999);
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
websocket_1.socketServer({ server });
//start server
server.listen(app.get("port"), () => {
    console.log(`Server started on post : ${app.get("port")}`);
});
//# sourceMappingURL=server.js.map