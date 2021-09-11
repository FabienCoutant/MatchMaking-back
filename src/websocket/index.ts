import * as WebSocket from "ws";
import {ServerOptions} from "ws";
import {Player} from "../entity/player";
import {MatchMakingController} from "../controller/MatchMakingController";
import * as http from "http";

export interface MatchingPlayer {
    player: Player;
    socket: WebSocket;
}



export const socketServer = (serverToBind: ServerOptions) => {

    const wss = new WebSocket.Server(serverToBind);
    const playersPool = new Map<string, MatchingPlayer>();
    const options = {
        checkInterval: 500,
        instantMatchingWaitingTime: 5000,
        maxWaitingTime: 30000,
        instantMatchingRankedLevelDelta: 5,
        maxRankedLevelDelta: 20
    }
    const launchBattle = async (players: Player[],message:string) => {
        const playerPoolA = playersPool.get(players[0].getId());
        const playerPoolB = playersPool.get(players[1].getId());
        console.log("Matching method: ", message)
        console.log("players Matched ",players)
        if (playerPoolA && playerPoolB) {
            const playerAData = {
                id:playerPoolA.player.getId(),
                name:playerPoolA.player.getName(),
                rankedLevel:playerPoolA.player.getRankedLevel()
            }
            const playerBData = {
                id:playerPoolB.player.getId(),
                name:playerPoolB.player.getName(),
                rankedLevel:playerPoolB.player.getRankedLevel()
            }
            console.log(playerAData)
            console.log(playerBData)
            playerPoolA.socket.send(JSON.stringify({
                type:"Match",
                message:message,
                currentPlayer:playerAData,
                opponentPlayer:playerBData
            }));
            playerPoolB.socket.send(JSON.stringify({
                type:"Match",
                message:message,
                currentPlayer:playerBData,
                opponentPlayer:playerAData
            }));
            playerPoolA.socket.close();
            playerPoolB.socket.close();
            playersPool.delete(playerPoolA.player.getId());
            playersPool.delete(playerPoolB.player.getId());
        }
    }
    const removePlayer = (player: Player) => {
        const playerPool = playersPool.get(player.getId());
        if (playerPool) {
            const playerData = {
                id:playerPool.player.getId(),
                name:playerPool.player.getName(),
                rankedLevel:playerPool.player.getRankedLevel()
            }

            playerPool.socket.send(JSON.stringify({
                type:"NotFound",
                message:"No opponents for you at the moment",
                player:playerData
            }))
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

    wss.on('connection', (ws: WebSocket, req:http.IncomingMessage) => {
        ws.on('message', (message: JSON) => {
            console.log(JSON.parse(message.toString()));
            const data = JSON.parse(message.toString());
            const p: Player = new Player(data.user)
            if(data.type ==="Play"){
                if (!playersPool.has(p.getId())) {
                    playersPool.set(p.getId(), {socket: ws, player: p});
                    matchMaking.push(p);
                    console.log("Player in queue",matchMaking.playersInQueue);
                    ws.send(JSON.stringify({
                        type:"Search",
                        message:"Searching your opponent"
                    }))
                } else {
                    ws.close();
                }

            }else if(data.type === "Leave"){
                const playerPool = playersPool.get(p.getId());
                if (playerPool) {
                    console.log("Player leave queue",matchMaking.playersInQueue);
                    matchMaking.leaveQueue(p);
                    ws.send(JSON.stringify({
                        type:"Leave",
                        message:"Your left the queue"
                    }));
                    playerPool.socket.close();
                    playersPool.delete(playerPool.player.getId());
                }
            }
        });

        const ip = req.socket.remoteAddress ? req.socket.remoteAddress.slice(7) : '';
        console.log('received connection from: ' + ip);
        ws.send(JSON.stringify({
            type:"Connection",
            message:"New connection"
        }))
    });


}



