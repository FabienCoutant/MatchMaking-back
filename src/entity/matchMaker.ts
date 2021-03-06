let errorMessages = {
    playerInQueue: "Player is already in queue",
    playerNotInQueue: "Player is not in queue",
};

export enum IPlayerState {
    NONE,
    INQUEUE,
    PLAYING
}

export interface IMatchMakerOptions {
    instantMatchingRankedLevelDelta?: number;
    maxRankedLevelDelta?: number;
    maxWaitingTime?: number;
    instantMatchingWaitingTime?: number;
}

interface Game<P> {
    players: P[];
    id: number;
}

interface Queue<P> {
    player: P;
    timeJoined: number;
}

interface ClosestPlayer<P> {
    player: P;
    queueIndex: number;
    delta: number
}

export class MatchMaker<P> {
    protected resolver: (players: P[], text: string) => void;
    protected rejected: (player: P) => void;
    protected getKey: (player: P) => string;
    protected getRankedLevel: (player: P) => number;
    protected queue: Queue<P>[];
    protected inGame: Game<P>[];

    private nextGameId: number;

    protected instantMatchingRankedLevelDelta: number;
    protected maxRankedLevelDelta: number;
    protected maxWaitingTime: number;
    protected instantMatchingWaitingTime: number;


    get playersInQueue(): number {
        return this.queue.length;
    }

    constructor(
        resolver: (players: P[], message: string) => void,
        rejected: (player: P) => void,
        getKey: (player: P) => string,
        getRankedLevel: (player: P) => number,
        options?: IMatchMakerOptions
    ) {
        this.resolver = (players: P[], message: string) => {
            this.inGame.push({players, id: this.nextGameId++});
            resolver(players, message);
        };
        this.rejected = (player: P) => {
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

    public push = (player: P): void => {
        if (this.indexOnQueue(player) != -1)
            throw Error(errorMessages.playerInQueue);
        this.queue.push({player, timeJoined: Date.now()});
    }

    public getPlayerState(player: P): IPlayerState {
        let playerKey = this.getKey(player);
        if (this.queue.find((queue: Queue<P>) => playerKey == this.getKey(queue.player))) {
            return IPlayerState.INQUEUE;
        } else if (this.inGame.find((game: Game<P>) => {
            return game.players.find((gamePlayer: P) => playerKey == this.getKey(gamePlayer))
        })) {
            return IPlayerState.PLAYING;
        }
        return IPlayerState.NONE;
    }

    public leaveQueue(player: P): void {
        let index = this.indexOnQueue(player);
        if (index == -1)
            throw Error(errorMessages.playerNotInQueue);
        this.queue.splice(index, 1);
    }


    public indexOnQueue = (player: P): number => {
        let playerKey = this.getKey(player);
        let index;
        index = this.queue.findIndex((queue: Queue<P>) => {
            return this.getKey(queue.player) == playerKey;
        });
        return index;
    }

    public getPlayerByQueueId = (id: number): Queue<P> => {
        return this.queue[id];
    }

    public makeMatch = (): void => {
        let playersMatched: P[] = [];
        let closestPlayerRankedLevel: ClosestPlayer<P>;
        for (let i = 0; i < this.queue.length; i++) {
            let p1 = this.getPlayerByQueueId(i);
            closestPlayerRankedLevel = {
                player: p1.player,
                queueIndex: i,
                delta: 100
            }
            let isWaitingToLong = (Date.now() - p1.timeJoined >= this.instantMatchingWaitingTime)
            for (let y = i; y < this.queue.length; y++) {
                let p2 = this.getPlayerByQueueId(y);
                if (this.isMatch(p1.player, p2.player, this.instantMatchingRankedLevelDelta)) {
                    this.queue.splice(i, 1);
                    this.queue.splice(y - 1, 1);
                    playersMatched.push(p1.player);
                    playersMatched.push(p2.player);
                    this.resolver(playersMatched, "Instant match");
                    playersMatched = [];
                    closestPlayerRankedLevel = {
                        player: p1.player,
                        queueIndex: i,
                        delta: 100
                    }
                    break;
                } else {
                    if (p2 && Date.now() - p2.timeJoined >= this.maxWaitingTime) {
                        this.rejected(p2.player);
                        break;
                    } else if (isWaitingToLong && (p1.player !== p2.player)) {
                        const delta = this.getRankedLevelDelta(p1.player, p2.player)
                        if (delta < closestPlayerRankedLevel.delta && delta <= this.maxRankedLevelDelta) {
                            closestPlayerRankedLevel = {
                                player: p2.player,
                                queueIndex: y,
                                delta
                            };

                        }
                    }
                }
            }
            if (closestPlayerRankedLevel.player !== p1.player) {
                this.queue.splice(i, 1);
                this.queue.splice(closestPlayerRankedLevel.queueIndex - 1, 1);
                playersMatched.push(p1.player);
                playersMatched.push(closestPlayerRankedLevel.player);
                this.resolver(playersMatched, "Closest opponent");
                playersMatched = [];
            }
        }

    }


    private isMatch = (playerA: P, playerB: P, delta: number): boolean => {
        if (playerA !== playerB) {
            if (this.getRankedLevelDelta(playerA, playerB) <= delta) {
                return true;
            }
        }
        return false;
    }
    private getRankedLevelDelta = (playerA: P, playerB: P): number => {
        const rankedLevelA: number = this.getRankedLevel(playerA);
        const rankedLevelB: number = this.getRankedLevel(playerB);
        if (rankedLevelA >= rankedLevelB) {
            return rankedLevelA - rankedLevelB;
        }
        return rankedLevelB - rankedLevelA;
    }
}
