import * as WebSocket from "ws";
import { ServerOptions } from "ws";

export const socketServer = (serverToBind:ServerOptions) => {

    const wss = new WebSocket.Server(serverToBind);

    wss.on('connection', (ws: WebSocket) => {

        //connection is up, let's add a simple event
        ws.on('message', (message: string) => {
            //log the received message and send it back to the client
            console.log('received: %s', message);
            ws.send(`Hello, you sent -> ${message}`);
        });

        ws.send("connected")
    });
}
