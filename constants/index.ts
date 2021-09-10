import * as WebSocket from "ws";
import {Player} from "../src/entity/player";

export interface MatchingPlayer {
    player: Player;
    socket: WebSocket;
}
