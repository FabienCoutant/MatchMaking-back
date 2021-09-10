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
    constructor(resolver, rejected, getKey, getRankedLevel, options) {
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
        this.getPlayerByQueueId = (id) => {
            return this.queue[id];
        };
        this.makeMatch = () => {
            let playersMatched = [];
            let closedPlayerRankedLevel;
            for (let i = 0; i < this.queue.length; i++) {
                let p1 = this.getPlayerByQueueId(i);
                closedPlayerRankedLevel = {
                    player: p1.player,
                    queueIndex: i,
                    delta: 0
                };
                let isWaitingToLong = (Date.now() - p1.timeJoined >= this.instantMatchingWaitingTime);
                for (let y = i; y < this.queue.length; y++) {
                    let p2 = this.getPlayerByQueueId(y);
                    if (this.isMatch(p1.player, p2.player, this.instantMatchingRankedLevelDelta)) {
                        this.queue.splice(i, 1);
                        this.queue.splice(y - 1, 1);
                        playersMatched.push(p1.player);
                        playersMatched.push(p2.player);
                        this.resolver(playersMatched);
                        playersMatched = [];
                        closedPlayerRankedLevel = {
                            player: p1.player,
                            queueIndex: i,
                            delta: 0
                        };
                        break;
                    }
                    else {
                        if (p2 && Date.now() - p2.timeJoined >= this.maxWaitingTime) {
                            this.rejected(p2.player);
                            break;
                        }
                        else if (isWaitingToLong) {
                            const delta = this.getRankedLevelDelta(p1.player, p2.player);
                            if (closedPlayerRankedLevel.player != p2.player) {
                                if (delta < closedPlayerRankedLevel.delta || closedPlayerRankedLevel.delta === 0) {
                                    closedPlayerRankedLevel = {
                                        player: p2.player,
                                        queueIndex: y,
                                        delta
                                    };
                                }
                            }
                            else {
                                closedPlayerRankedLevel = {
                                    player: p2.player,
                                    queueIndex: y,
                                    delta
                                };
                            }
                        }
                    }
                }
                if (closedPlayerRankedLevel.player !== p1.player) {
                    this.queue.splice(i, 1);
                    this.queue.splice(closedPlayerRankedLevel.queueIndex - 1, 1);
                    playersMatched.push(p1.player);
                    playersMatched.push(closedPlayerRankedLevel.player);
                    this.resolver(playersMatched);
                    playersMatched = [];
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
        this.rejected = (player) => {
            this.leaveQueue(player);
            rejected(player);
        };
        this.getKey = getKey;
        this.getRankedLevel = getRankedLevel;
        this.queue = [];
        this.inGame = [];
        this.nextGameId = Number.MIN_SAFE_INTEGER;
        this.maxRankedLevelDelta = (options && options.maxRankedLevelDelta && options.maxRankedLevelDelta > 0 && options.maxRankedLevelDelta) || 20;
        this.instantMatchingRankedLevelDelta = (options && options.instantMatchingRankedLevelDelta && options.instantMatchingRankedLevelDelta > 0 && options.instantMatchingRankedLevelDelta) || 5;
        this.maxWaitingTime = (options && options.maxWaitingTime && options.maxWaitingTime >= 10000 && options.maxWaitingTime) || 300000; //by default 5 minutes and must be > 10s
        this.instantMatchingWaitingTime = (options && options.instantMatchingWaitingTime && options.instantMatchingWaitingTime > 0 && options.instantMatchingWaitingTime) || 30000; //by default 30s
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
}
exports.MatchMaker = MatchMaker;
//# sourceMappingURL=matchMaker.js.map