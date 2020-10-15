import { MockServer } from "../../support/mockServer";

describe("when it is your turn to transmit", () => {


    let mockServer: undefined | MockServer;

    beforeEach(() => {
        cy.visit("http://localhost:3000/game/dummygameid", {
            onBeforeLoad: (win) => {
                (win as any).mockServerConstructor = (gameId: string, playerId: string) => {
                    mockServer = new MockServer(gameId, playerId, new Map());
                    return mockServer;
                }
            }
        });
    })

    it("dumb test", () => {
        console.log("Mock Server", mockServer);
        mockServer.sendWelcome({ id: "p1", name: "POne", status: "connected" });

        mockServer.sendGameState({
            blue: {
                cypher: ['b_c_1', 'b_c_2', 'b_c_3', 'b_c_4'],
                interceptions: 0,
                last_transmitter: "p1",
                players: ["p1", "p2"],
                transmission_fails: 0
            },
            red: {
                cypher: ['r_c_1', 'r_c_2', 'r_c_3', 'r_c_4'],
                interceptions: 0,
                last_transmitter: "p3",
                players: ["p3", "p4"],
                transmission_fails: 0
            },
            current_transmitter: "p1",
            history: [
                {
                    code: [1, 2, 3],
                    encryptor: "p1",
                    encryptorTeam: "blue",
                    type: "INCOMPLETE"
                }
            ],
            players: [
                {
                    id: "p1",
                    name: "POne",
                    status: "connected"
                },
                {
                    id: "p2",
                    name: "PTwo",
                    status: "connected"
                },
                {
                    id: "p3",
                    name: "PThree",
                    status: "connected"
                },
                {
                    id: "p4",
                    name: "PFour",
                    status: "connected"
                }
            ],
            state: "RUNNING",
            winner: undefined
        });
        cy.wait(5000);
    });
});
