import { PlayerID, Team, TeamID, Turn } from "../../../client/src/types/gameState";
import { getCode } from "../codes/getCode";

export type PartialTeam = {
    players: PlayerID[]
};

export type PartialTurn = {
    encryptorTeam: TeamID,
    encryptor: PlayerID
}

export type PartialGameState = {
    history: PartialTurn[],
    red: PartialTeam,
    blue: PartialTeam
};

export const newTurn = (gameState: PartialGameState): Turn => {
    const firstTurn = gameState.history.length === 0;
    if (firstTurn) {
        return {
            type: "INCOMPLETE",
            encryptor: gameState.red.players[0],
            encryptorTeam: "red",
            code: getCode(),
        };
    }

    const previousTurn = gameState.history[gameState.history.length - 1];
    const lastTeam = previousTurn.encryptorTeam;
    const nextTeam = lastTeam === "red" ? "blue" : "red";

    const previousEncryptor =
        gameState.history.slice().reverse().find((turn) => turn.encryptorTeam === nextTeam)
            ?.encryptor ?? gameState[nextTeam].players[0];

    const teamMemberIds = gameState[nextTeam].players;
    const lastEncryptorIndex = teamMemberIds.findIndex(
        (playerId) => playerId === previousEncryptor
    );
    const nextEncryptorId =
        teamMemberIds[(lastEncryptorIndex + 1) % teamMemberIds.length];

    return {
        encryptor: nextEncryptorId,
        encryptorTeam: nextTeam,
        code: getCode(),
        type: "INCOMPLETE",
    };
};
