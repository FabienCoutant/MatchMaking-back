import {expect} from "chai";
import {IPlayerData, Player} from "../src/entity/player";
import {IPlayerState, MatchMaker} from "../src/entity/matchMaker";


describe("Matching", () => {

    describe("---- Initialization ----", () => {
        it("should add 1 player to the matching pool", () => {
            //function launch when 2 players get matched
            function runMatch(players: Player[]) {
                console.log(players)
            }

            //init matchMaker
            const matchMaking = new MatchMaker<Player>(
                runMatch,
                p => p.getId(),
                {
                    checkInterval: 2000,
                    maxWaitingTime: 10000
                }
            );

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
        it("should add 2 players to the matching pool", () => {
            //function launch when 2 players get matched
            function runMatch(players: Player[]) {
                console.log(players)
            }

            //init matchMaker
            const matchMaking = new MatchMaker<Player>(
                runMatch,
                p => p.getId(),
                {
                    checkInterval: 2000,
                    maxWaitingTime: 10000
                }
            );

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
        it("should add 3 players and remove one to the pool",()=>{
            //function launch when 2 players get matched
            function runMatch(players: Player[]) {
                console.log(players)
            }

            //init matchMaker
            const matchMaking = new MatchMaker<Player>(
                runMatch,
                p => p.getId(),
                {
                    checkInterval: 2000,
                    maxWaitingTime: 10000
                }
            );

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
    });
});
