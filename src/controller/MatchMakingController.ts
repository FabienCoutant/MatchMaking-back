import {IMatchMakerOptions, MatchMaker} from "../entity/matchMaker";


interface IMatchMakerOptionsController extends IMatchMakerOptions {
    checkInterval?: number;
}

export class MatchMakingController<P> extends MatchMaker<P> {

    protected checkInterval: number; // Time to check for players, value in milliseconds defaults to 5000
    constructor(
        resolver: (players: P[],message:string) => void,
        rejected: (player: P) => void,
        getKey: (player: P) => number,
        getRankedLevel: (player: P) => number,
        options?: IMatchMakerOptionsController
    ) {
        super(resolver, rejected, getKey, getRankedLevel, options);
        this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 1000;
        setInterval(this.makeMatch, this.checkInterval);
    }
}
