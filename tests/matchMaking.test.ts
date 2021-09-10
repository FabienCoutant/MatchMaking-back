import {expect} from "chai";
import {IPlayerData, Player} from "../src/entity/player";
import {IPlayerState, MatchMaker} from "../src/entity/matchMaker";


describe("---- Matching ----", () => {
    describe("  -- Initialization --", () => {
        let matchMaking: any;
        beforeEach(() => {
            //function launch when 2 players get matched
            function runMatch(players: Player[]) {
                console.log("runMatch", players)
            }

            //function launch when player wait too long
            function runReject(player: Player) {
                console.log("rejected", player)
            }

            //init matchMaker
            matchMaking = new MatchMaker<Player>(
                runMatch,
                runReject,
                p => p.getId(),
                p => p.getRankedLevel(),
                {
                    instantMatchingWaitingTime: 2000,
                    maxWaitingTime: 10000,
                    instantMatchingRankedLevelDelta: 5,
                    maxRankedLevelDelta: 20
                }
            );
        });
        it("should add 1 player to the pool", () => {
            //setup Alice player
            const aliceData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: Math.floor(Math.random() * 100),
                name: "Alice",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const alice = new Player(aliceData);
            expect(alice.getId()).eq(aliceData.id);
            expect(alice.getRankedLevel()).eq(aliceData.rankedLevel);
            expect(alice.getName()).eq(aliceData.name);
            expect(alice.getSpaceShipById(0)).eq(aliceData.spaceShip[0]);
            expect(alice.getSpaceShipList()).eq(aliceData.spaceShip);

            matchMaking.push(alice)
            expect(matchMaking.playersInQueue).eq(1);
            expect(matchMaking.getPlayerState(alice)).eq(IPlayerState.INQUEUE);
        });
        it("should add 2 players to the pool", () => {
            //setup Alice player
            const aliceData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: Math.floor(Math.random() * 100),
                name: "Alice",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const alice = new Player(aliceData);
            expect(alice.getId()).eq(aliceData.id);
            expect(alice.getRankedLevel()).eq(aliceData.rankedLevel);
            expect(alice.getName()).eq(aliceData.name);
            expect(alice.getSpaceShipById(0)).eq(aliceData.spaceShip[0]);
            expect(alice.getSpaceShipList()).eq(aliceData.spaceShip);
            matchMaking.push(alice)
            //setup Alice player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: Math.floor(Math.random() * 100),
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)

            expect(matchMaking.playersInQueue).eq(2);
            expect(matchMaking.getPlayerState(alice)).eq(IPlayerState.INQUEUE);
            expect(matchMaking.getPlayerState(bob)).eq(IPlayerState.INQUEUE);
        });
        it("should add 3 players and remove one to the pool", () => {
            //setup Alice player
            const aliceData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: Math.floor(Math.random() * 100),
                name: "Alice",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const alice = new Player(aliceData);
            expect(alice.getId()).eq(aliceData.id);
            expect(alice.getRankedLevel()).eq(aliceData.rankedLevel);
            expect(alice.getName()).eq(aliceData.name);
            expect(alice.getSpaceShipById(0)).eq(aliceData.spaceShip[0]);
            expect(alice.getSpaceShipList()).eq(aliceData.spaceShip);
            matchMaking.push(alice)

            //setup Bob player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: Math.floor(Math.random() * 100),
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)


            //setup Carol player
            const carolData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: Math.floor(Math.random() * 100),
                name: "Carol",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const carol = new Player(carolData);
            expect(carol.getId()).eq(carolData.id);
            expect(carol.getRankedLevel()).eq(carolData.rankedLevel);
            expect(carol.getName()).eq(carolData.name);
            expect(carol.getSpaceShipById(0)).eq(carolData.spaceShip[0]);
            expect(carol.getSpaceShipList()).eq(carolData.spaceShip);
            matchMaking.push(carol)

            expect(matchMaking.playersInQueue).eq(3);
            expect(matchMaking.getPlayerState(alice)).eq(IPlayerState.INQUEUE);
            expect(matchMaking.getPlayerState(bob)).eq(IPlayerState.INQUEUE);
            expect(matchMaking.getPlayerState(carol)).eq(IPlayerState.INQUEUE);

            matchMaking.leaveQueue(bob);
            expect(matchMaking.playersInQueue).eq(2);
            expect(matchMaking.getPlayerState(alice)).eq(IPlayerState.INQUEUE);
            expect(matchMaking.getPlayerState(bob)).eq(IPlayerState.NONE);
            expect(matchMaking.getPlayerState(carol)).eq(IPlayerState.INQUEUE);
        })
        it("should revert ")
    });
    describe("  -- Matching --", () => {
        let matchMaking: any;
        let matchedPlayers: Player[] = [];
        let rejectedPlayer: Player | undefined;
        let aliceData: IPlayerData;
        let alice: Player;
        beforeEach(() => {
            matchedPlayers = [];
            rejectedPlayer = undefined;

            //function launch when 2 players get matched
            function runMatch(players: Player[]) {
                console.log("runMatch", players)
                matchedPlayers = players;
            }

            //function launch when player wait too long
            function runReject(player: Player) {
                console.log("rejected", player)
                rejectedPlayer = player;
            }

            //init matchMaker
            matchMaking = new MatchMaker<Player>(
                runMatch,
                runReject,
                p => p.getId(),
                p => p.getRankedLevel(),
                {
                    instantMatchingWaitingTime: 2000,
                    maxWaitingTime: 10000,
                    instantMatchingRankedLevelDelta: 5,
                    maxRankedLevelDelta: 20
                }
            );

            //setup Alice player
            aliceData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 100,
                name: "Alice",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            alice = new Player(aliceData);
            expect(alice.getId()).eq(aliceData.id);
            expect(alice.getRankedLevel()).eq(aliceData.rankedLevel);
            expect(alice.getName()).eq(aliceData.name);
            expect(alice.getSpaceShipById(0)).eq(aliceData.spaceShip[0]);
            expect(alice.getSpaceShipList()).eq(aliceData.spaceShip);
            matchMaking.push(alice)


        });
        it("should instant match 2 players with rankedLevel delta less than 5", () => {
            //setup Bob player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 95,
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)

            matchMaking.makeMatch();
            expect(matchMaking.playersInQueue).eq(0);
            expect(matchedPlayers).to.have.length(2);

        });
        it("should not match 2 players with rankedLevel delta greater than 20", () => {
            //setup Bob player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 50,
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)

            matchMaking.makeMatch();
            expect(matchMaking.playersInQueue).eq(2);
            expect(matchedPlayers).to.have.length(0);

        });
        it("should match players 1 and 3 with rankedLevel delta equal or less than 5", () => {
            //setup Bob player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 50,
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)

            //setup Carol player
            const carolData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 95,
                name: "Carol",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const carol = new Player(carolData);
            expect(carol.getId()).eq(carolData.id);
            expect(carol.getRankedLevel()).eq(carolData.rankedLevel);
            expect(carol.getName()).eq(carolData.name);
            expect(carol.getSpaceShipById(0)).eq(carolData.spaceShip[0]);
            expect(carol.getSpaceShipList()).eq(carolData.spaceShip);
            matchMaking.push(carol)

            matchMaking.makeMatch();
            expect(matchMaking.playersInQueue).eq(1);
            expect(matchedPlayers).to.have.length(2);
            expect(matchedPlayers[0].getId()).eq(aliceData.id)
            expect(matchedPlayers[1].getId()).eq(carolData.id)

        });
        it("should match 2 players after 2s with rankedLevel delta greater than 5 but equal or less than 20", async () => {
            //setup Bob player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 80,
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)


            matchMaking.makeMatch();
            expect(matchedPlayers).to.have.length(0);

            console.log("Wait 2s")
            await new Promise(r => setTimeout(r, 2000));
            console.log("Waited 2s")
            matchMaking.makeMatch();
            expect(matchMaking.playersInQueue).eq(0);
            expect(matchedPlayers).to.have.length(2);
            expect(matchedPlayers[0].getId()).eq(aliceData.id)
            expect(matchedPlayers[1].getId()).eq(bobData.id)


        });
        it("should match players 1 and 3 after 2s with rankedLevel delta greater than 5 with the closest with the first user and let's the other in queue",async ()=>{
            //setup Bob player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 50,
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)

            //setup Carol player
            const carolData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 80,
                name: "Carol",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const carol = new Player(carolData);
            expect(carol.getId()).eq(carolData.id);
            expect(carol.getRankedLevel()).eq(carolData.rankedLevel);
            expect(carol.getName()).eq(carolData.name);
            expect(carol.getSpaceShipById(0)).eq(carolData.spaceShip[0]);
            expect(carol.getSpaceShipList()).eq(carolData.spaceShip);
            matchMaking.push(carol)

            matchMaking.makeMatch();
            expect(matchedPlayers).to.have.length(0);

            console.log("Wait 2s")
            await new Promise(r => setTimeout(r, 2000));
            console.log("Waited 2s")

            matchMaking.makeMatch();
            expect(matchMaking.playersInQueue).eq(1);
            expect(matchedPlayers).to.have.length(2);
            expect(matchedPlayers[0].getId()).eq(aliceData.id)
            expect(matchedPlayers[1].getId()).eq(carolData.id)
        })
        it('should remove player who wait more than maxWaitingTime (10s)',async ()=>{
            matchMaking.makeMatch();
            expect(matchedPlayers).to.have.length(0);

            console.log("Wait 10s")
            await new Promise(r => setTimeout(r, 10000));
            console.log("Waited 10s")

            //setup Bob player
            const bobData: IPlayerData = {
                id: Math.floor(Math.random() * 1000),
                rankedLevel: 50,
                name: "Bob",
                spaceShip: ["Jumper", "Prospector", "Space Digger"]
            };
            const bob = new Player(bobData);
            expect(bob.getId()).eq(bobData.id);
            expect(bob.getRankedLevel()).eq(bobData.rankedLevel);
            expect(bob.getName()).eq(bobData.name);
            expect(bob.getSpaceShipById(0)).eq(bobData.spaceShip[0]);
            expect(bob.getSpaceShipList()).eq(bobData.spaceShip);
            matchMaking.push(bob)

            matchMaking.makeMatch();
            expect(matchMaking.playersInQueue).eq(1);
            expect(rejectedPlayer!.getId()).eq(aliceData.id);

        });
    });
});
