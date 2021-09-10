
export interface IPlayerData {
    id:number
    rankedLevel:number
    name:string
    spaceShip:string[]
}

export class Player {

    private id:number;

    private rankedLevel : number;

    private name : string;

    private spaceShip : string[];

    constructor(initData:IPlayerData) {
        this.id = initData.id;
        this.name = initData.name;
        this.rankedLevel = initData.rankedLevel;
        this.spaceShip = initData.spaceShip;
    }

    getId():number{
        return this.id;
    }

    getRankedLevel():number{
        return this.rankedLevel;
    }

    getName():string{
        return this.name
    }

    getSpaceShipById(id:number):string{
        return this.spaceShip[id];
    }

    getSpaceShipList():string[]{
        return this.spaceShip;
    }

}
