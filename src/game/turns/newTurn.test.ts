import { PlayerID } from "../../../client/src/types/gameState";
import { newTurn, PartialGameState } from "./newTurn";






describe("newTurn", () => {
    const baseInput = (): PartialGameState => ({
        history: [],
        red: {
            players: ["r1", "r2"]
        },
        blue: {
            players: ["b1", "b2"]
        }
    });

    it("returns an incomplete turn if there were no previous turns", () => {
        const output = newTurn(baseInput());
        expect(output).toMatchObject({ type: "INCOMPLETE" })
    });

    it("returns a new turn with the opposite team to the previous", () => {
        const input: PartialGameState = {
            ...baseInput(),
            history: [
                {
                    encryptorTeam: "red",
                    encryptor: "r1",
                }
            ]
        };
        const output = newTurn(input);
        expect(output).toMatchObject({
            type: "INCOMPLETE",
            encryptorTeam: "blue"
        });
        expect(output.encryptor).toContain("b");

        input.history.push(output);
        const output2 = newTurn(input);

        expect(output2).toMatchObject({
            type: "INCOMPLETE",
            encryptorTeam: "red"
        });
        expect(output2.encryptor).toContain("r");
    });

    it("doesn't alter the input", () => {
        const base = baseInput();
        const makeInput = (): PartialGameState => ({
            ...base,
            history: [
                {
                    encryptor: "b2",
                    encryptorTeam: "blue",
                },
                {
                    encryptor: "r1",
                    encryptorTeam: "red",
                },
                {
                    encryptor: "r2",
                    encryptorTeam: "red",
                },
            ]
        });

        const input = makeInput();
        newTurn(input);

        expect(input).toMatchObject(makeInput());
    });

    it("cycles through all 4 players in the game before giving someone a second turn", () => {
        const playersWithoutATurnYet: PlayerID[] = ['r1', 'r2', 'b1', 'b2'];
        let inputState = { ...baseInput() };
        while (playersWithoutATurnYet.length > 0) {
            const nextTurn = newTurn(inputState);

            expect(playersWithoutATurnYet).toContain(nextTurn.encryptor);
            playersWithoutATurnYet.splice(playersWithoutATurnYet.findIndex((id: PlayerID) => id === nextTurn.encryptor), 1);

            inputState.history.push(nextTurn);
        };
    });

    it("cycles through all 8 players in the game before giving someone a second turn", () => {
        const playersWithoutATurnYet: PlayerID[] = ['r1', 'r2', 'r3', 'r4', 'b1', 'b2', 'b3', 'b4',];
        const base = baseInput();
        const inputState: PartialGameState = {
            ...base,
            red: {
                players: [...base.red.players, 'r3', 'r4']
            },
            blue: {
                players: [...base.blue.players, 'b3', 'b4']
            }
        };
        while (playersWithoutATurnYet.length > 0) {
            const nextTurn = newTurn(inputState);

            expect(playersWithoutATurnYet).toContain(nextTurn.encryptor);
            playersWithoutATurnYet.splice(playersWithoutATurnYet.findIndex((id: PlayerID) => id === nextTurn.encryptor), 1);

            inputState.history.push(nextTurn);
        };
    });


});
