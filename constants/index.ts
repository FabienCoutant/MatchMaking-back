import * as WebSocket from "ws";

//// CONSTANTS
export const MAX_TIME_IN_QUEUE = 20000;
export const POOL_POLL_INTERVAL = 1000;


export type UnmatchedPlayer = {
    //any properties your player objects need (MUST HAVE UNIQUE ID)
    id: string;
    time_joined: number;
    val_1: number;
    val_2: Array<string>;
    //etc
};

export interface MatchingPlayer {
    player: UnmatchedPlayer;
    socket: WebSocket;
}
