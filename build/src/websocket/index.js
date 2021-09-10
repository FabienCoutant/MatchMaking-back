"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = void 0;
const WebSocket = require("ws");
const socketServer = (serverToBind) => {
    const wss = new WebSocket.Server(serverToBind);
    wss.on('connection', (ws) => {
        //connection is up, let's add a simple event
        ws.on('message', (message) => {
            //log the received message and send it back to the client
            console.log('received: %s', message);
            ws.send(`Hello, you sent -> ${message}`);
        });
        ws.send("connected");
    });
};
exports.socketServer = socketServer;
//# sourceMappingURL=index.js.map