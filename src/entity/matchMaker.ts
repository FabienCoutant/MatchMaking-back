let errorMessages = {
    playerInQueue: "Player is already in queue",
    playerNotInQueue: "Player is not in queue",
    playerNotInGame: "Player is not in game",
    gameDoesNotExists: "Game does not exists"
};

export enum IPlayerState {
    NONE,
    INQUEUE,
    PLAYING
}

export interface IMatchMakerOptions {
    checkInterval?: number;
    maxWaitingTime?: number;
}

interface Game<P> {
    players: P[];
    id: number;
}

export class MatchMaker<P> {
    protected resolver: (players: P[]) => void;
    protected getKey: (player: P) => number;
    protected queue: P[];
    protected inGame: Game<P>[];

    private nextGameId: number;

    protected checkInterval: number; // Time to check for players, value in milliseconds defaults to 5000
    protected maxWaitingTime: number;

    get playersInQueue(): number {
        return this.queue.length;
    }

    constructor(resolver: (players: P[]) => void, getKey: (player: P) => number, options?: IMatchMakerOptions) {
        this.resolver = (players: P[]) => {
            this.inGame.push({ players, id: this.nextGameId++ });
            resolver(players);
        };
        this.getKey = getKey
        this.queue = [];
        this.inGame = [];

        this.nextGameId = Number.MIN_SAFE_INTEGER;

        this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 5000;
        this.maxWaitingTime = (options && options.maxWaitingTime) || 300000; //by default 5 minutes
    }

    public push = (player: P): void => {
        if (this.indexOnQueue(player) != -1)
            throw Error(errorMessages.playerInQueue);
        this.queue.push(player);
    }

    public getPlayerState(player: P): IPlayerState {
        let playerKey = this.getKey(player);
        if (this.queue.find((queuePlayer: P) => playerKey == this.getKey(queuePlayer))) {
            return IPlayerState.INQUEUE;
        }
        else if (this.inGame.find((game: Game<P>) => { return game.players.find((gamePlayer: P) => playerKey == this.getKey(gamePlayer)) })) {
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

    public endGame(players: P | P[]): void {
        players = (players instanceof Array) ? players : [players];
        let gameIndex: number = -1;
        for (let player of players) {
            let playerKey = this.getKey(player);
            gameIndex = this.inGame.findIndex((game: Game<P>) => { return game.players.find((gamePlayer: P) => playerKey == this.getKey(gamePlayer)) })
            if (gameIndex != -1) {
                break;
            }
        }
        if (gameIndex == -1)
            throw Error(errorMessages.gameDoesNotExists);
        this.inGame.splice(gameIndex, 1);
    }

    public indexOnQueue = (player: P): number => {
        let playerKey = this.getKey(player);
        let index;
        index = this.queue.findIndex((player) => { return this.getKey(player) == playerKey; });
        return index;
    }
}
