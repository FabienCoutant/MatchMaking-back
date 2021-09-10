"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMakingController = void 0;
const matchMaker_1 = require("../entity/matchMaker");
class MatchMakingController extends matchMaker_1.MatchMaker {
    constructor(resolver, rejected, getKey, getRankedLevel, options) {
        super(resolver, rejected, getKey, getRankedLevel, options);
        this.checkInterval = (options && options.checkInterval && options.checkInterval > 0 && options.checkInterval) || 5000;
        setInterval(this.makeMatch, this.checkInterval);
    }
}
exports.MatchMakingController = MatchMakingController;
//# sourceMappingURL=MatchMakingController.js.map