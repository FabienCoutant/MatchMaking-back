"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(initData) {
        this.id = initData.id;
        this.name = initData.name;
        this.rankedLevel = initData.rankedLevel;
        this.spaceShip = initData.spaceShip;
    }
    getId() {
        return this.id;
    }
    getRankedLevel() {
        return this.rankedLevel;
    }
    getName() {
        return this.name;
    }
    getSpaceShipById(id) {
        return this.spaceShip[id];
    }
    getSpaceShipList() {
        return this.spaceShip;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map