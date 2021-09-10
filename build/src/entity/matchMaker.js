"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMaker = exports.IPlayerState = void 0;
let errorMessages = {
    playerInQueue: "Player is already in queue",
    playerNotInQueue: "Player is not in queue",
    playerNotInGame: "Player is not in game",
    gameDoesNotExists: "Game does not exists"
};
var IPlayerState;
(function (IPlayerState) {
    IPlayerState[IPlayerState["NONE"] = 0] = "NONE";
    IPlayerState[IPlayerState["INQUEUE"] = 1] = "INQUEUE";
    IPlayerState[IPlayerState["PLAYING"] = 2] = "PLAYING";
})(IPlayerState = exports.IPlayerState || (exports.IPlayerState = {}));
class MatchMaker {
    constructor(resolver, getKey, getRankedLevel, options) {
        this.push = (player) => {
            if (this.indexOnQueue(player) != -1)
                throw Error(errorMessages.playerInQueue);
            this.queue.push({ player, timeJoined: Date.now() });
        };
        this.indexOnQueue = (player) => {
            let playerKey = this.getKey(player);
            let index;
            index = this.queue.findIndex((queue) => {
                return this.getKey(queue.player) == playerKey;
            });
            return index;
        };
        this.makeMatch = () => {
            if (this.queue.length < 2) {
                return;
            }
            let playersMatched;
            for (const p1 of this.queue) {
                for (const p2 of this.queue) {
                    if (this.isMatch(p1.player, p2.player, this.instantMatchingRankedLevelDelta)) {
                    }
                }
            }
        };
        this.isMatch = (playerA, playerB, delta) => {
            if (playerA !== playerB) {
                if (this.getRankedLevelDelta(playerA, playerB) <= delta) {
                    return true;
                }
            }
            return false;
        };
        this.getRankedLevelDelta = (playerA, playerB) => {
            const rankedLevelA = this.getRankedLevel(playerA);
            const rankedLevelB = this.getRankedLevel(playerB);
            if (rankedLevelA > rankedLevelB) {
                return rankedLevelA - rankedLevelB;
            }
            else if (rankedLevelB > rankedLevelA) {
                return rankedLevelB - rankedLevelA;
            }
            return rankedLevelA;
        };
        this.resolver = (players) => {
            this.inGame.push({ players, id: this.nextGameId++ });
            resolver(players);
        };
        this.getKey = getKey;
        this.getRankedLevel = getRankedLevel;
        this.queue = [];
        this.inGame = [];
        this.nextGameId = Number.MIN_SAFE_INTEGER;
        this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 3000;
        this.maxRankedLevelDelta = (options && options.maxRankedLevelDelta && options.maxRankedLevelDelta > 0 && options.maxRankedLevelDelta) || 20;
        this.instantMatchingRankedLevelDelta = (options && options.instantMatchingRankedLevelDelta && options.instantMatchingRankedLevelDelta > 0 && options.instantMatchingRankedLevelDelta) || 5;
        this.maxWaitingTime = (options && options.maxWaitingTime) || 300000; //by default 5 minutes
    }
    get playersInQueue() {
        return this.queue.length;
    }
    getPlayerState(player) {
        let playerKey = this.getKey(player);
        if (this.queue.find((queue) => playerKey == this.getKey(queue.player))) {
            return IPlayerState.INQUEUE;
        }
        else if (this.inGame.find((game) => {
            return game.players.find((gamePlayer) => playerKey == this.getKey(gamePlayer));
        })) {
            return IPlayerState.PLAYING;
        }
        return IPlayerState.NONE;
    }
    leaveQueue(player) {
        let index = this.indexOnQueue(player);
        if (index == -1)
            throw Error(errorMessages.playerNotInQueue);
        this.queue.splice(index, 1);
    }
    endGame(players) {
        players = (players instanceof Array) ? players : [players];
        let gameIndex = -1;
        for (let player of players) {
            let playerKey = this.getKey(player);
            gameIndex = this.inGame.findIndex((game) => {
                return game.players.find((gamePlayer) => playerKey == this.getKey(gamePlayer));
            });
            if (gameIndex != -1) {
                break;
            }
        }
        if (gameIndex == -1)
            throw Error(errorMessages.gameDoesNotExists);
        this.inGame.splice(gameIndex, 1);
    }
}
exports.MatchMaker = MatchMaker;
//# sourceMappingURL=matchMaker.js.map