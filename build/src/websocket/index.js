"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = void 0;
const WebSocket = require("ws");
const player_1 = require("../entity/player");
const MatchMakingController_1 = require("../controller/MatchMakingController");
const socketServer = (serverToBind) => {
    const wss = new WebSocket.Server(serverToBind);
    const playersPool = new Map();
    const options = {
        checkInterval: 2000,
        instantMatchingWaitingTime: 2000,
        maxWaitingTime: 10000,
        instantMatchingRankedLevelDelta: 5,
        maxRankedLevelDelta: 20
    };
    const launchBattle = (players) => __awaiter(void 0, void 0, void 0, function* () {
        const playerPoolA = playersPool.get(players[0].getId());
        const playerPoolB = playersPool.get(players[1].getId());
        console.log("players Matched", players);
        if (playerPoolA && playerPoolB) {
            playerPoolA.socket.send(`${playerPoolA.player.getId()} you were matched with ${playerPoolB.player.getId()}`);
            playerPoolB.socket.send(`${playerPoolB.player.getId()} you were matched with ${playerPoolA.player.getId()}`);
            playerPoolA.socket.close();
            playerPoolB.socket.close();
            playersPool.delete(playerPoolA.player.getId());
            playersPool.delete(playerPoolB.player.getId());
        }
    });
    const removePlayer = (player) => {
        const playerPool = playersPool.get(player.getId());
        if (playerPool) {
            playerPool.socket.send(`${playerPool.player.getId()} didn't find a match`);
            playerPool.socket.close();
            playersPool.delete(playerPool.player.getId());
        }
    };
    const matchMaking = new MatchMakingController_1.MatchMakingController(launchBattle, removePlayer, p => p.getId(), p => p.getRankedLevel(), options);
    wss.on('connection', (ws, req) => {
        //connection is up, let's add a simple event
        ws.on('message', (message) => {
            //log the received message and send it back to the client
            const player = JSON.parse(message.toString());
            const p = new player_1.Player(player);
            if (!playersPool.has(p.getId())) {
                playersPool.set(p.getId(), { socket: ws, player: p });
                matchMaking.push(p);
            }
            else {
                ws.close();
            }
        });
        const ip = req.socket.remoteAddress ? req.socket.remoteAddress.slice(7) : '';
        console.log(req.socket.remoteAddress);
        console.log('received connection from: ' + ip);
        ws.send("connected");
    });
};
exports.socketServer = socketServer;
//# sourceMappingURL=index.js.map