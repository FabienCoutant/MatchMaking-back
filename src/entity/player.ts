
export interface IPlayerData {
    id:string
    rankedLevel:number
    name:string
}

export class Player {

    private id:string;

    private rankedLevel : number;

    private name : string;


    constructor(initData:IPlayerData) {
        this.id = initData.id;
        this.name = initData.name;
        this.rankedLevel = initData.rankedLevel;
    }

    getId():string{
        return this.id;
    }

    getRankedLevel():number{
        return this.rankedLevel;
    }

    getName():string{
        return this.name
    }
}
