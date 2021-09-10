import * as WebSocket from "ws";
import {ServerOptions} from "ws";
import {Player} from "../entity/player";
import {MatchMakingController} from "../controller/MatchMakingController";

export interface MatchingPlayer {
    player: Player;
    socket: WebSocket;
}



export const socketServer = (serverToBind: ServerOptions) => {

    const wss = new WebSocket.Server(serverToBind);
    const playersPool = new Map<number, MatchingPlayer>();
    const options = {
        checkInterval: 2000,
        instantMatchingWaitingTime: 2000,
        maxWaitingTime: 10000,
        instantMatchingRankedLevelDelta: 5,
        maxRankedLevelDelta: 20
    }
    const launchBattle = async (players: Player[]) => {
        const playerPoolA = playersPool.get(players[0].getId());
        const playerPoolB = playersPool.get(players[1].getId());
        console.log("players Matched",players)
        if (playerPoolA && playerPoolB) {
            playerPoolA.socket.send(`${playerPoolA.player.getId()} you were matched with ${playerPoolB.player.getId()}`);
            playerPoolB.socket.send(`${playerPoolB.player.getId()} you were matched with ${playerPoolA.player.getId()}`);
            playerPoolA.socket.close();
            playerPoolB.socket.close();
            playersPool.delete(playerPoolA.player.getId());
            playersPool.delete(playerPoolB.player.getId());

        }
    }
    const removePlayer = (player: Player) => {
        const playerPool = playersPool.get(player.getId());
        if (playerPool) {
            playerPool.socket.send(`${playerPool.player.getId()} didn't find a match`);
            playerPool.socket.close();
            playersPool.delete(playerPool.player.getId());
        }
    }

    const matchMaking = new MatchMakingController(
        launchBattle,
        removePlayer,
        p => p.getId(),
        p => p.getRankedLevel(),
        options
    )

    wss.on('connection', (ws: WebSocket, req) => {

        //connection is up, let's add a simple event
        ws.on('message', (message: JSON) => {
            //log the received message and send it back to the client
            console.log(JSON.parse(message.toString()));
            const player = JSON.parse(message.toString());
            const p: Player = new Player(player)
            if (!playersPool.has(p.getId())) {
                playersPool.set(p.getId(), {socket: ws, player: p});
                matchMaking.push(p);
            } else {
                ws.close();
            }
            console.log("Player in queue",matchMaking.playersInQueue);
        });

        const ip = req.socket.remoteAddress ? req.socket.remoteAddress.slice(7) : '';
        console.log(req.socket.remoteAddress)
        console.log('received connection from: ' + ip);
        ws.send("connected")
    });


}



