import * as WebSocket from "ws";
import {Player} from "../src/entity/player";

//// CONSTANTS
export const MAX_TIME_IN_QUEUE = 20000;
export const POOL_POLL_INTERVAL = 1000;



export interface MatchingPlayer {
    player: Player;
    socket: WebSocket;
}
