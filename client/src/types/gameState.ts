import { Player } from "./player";

export type TeamID = "red" | "blue";
export type PlayerID = string;
export type GameStates = "LOBBY" | "RUNNING" | "FINISHED";

export type Code = [number, number, number];

export type Cypher = [string, string, string, string];

export type Transmission = [string, string, string];

export type Team = {
    interceptions: number,
    transmissionFailures: number,
    lastTransmitter: PlayerID | undefined,
    cypher: [string, string, string, string],
    players: Array<PlayerID>
};

export type Turn = IncompleteTurn | CompletedTurn;

type CommonTurn = {
    encryptor: PlayerID,
    encryptorTeam: TeamID,
    code: Code,
}

export type IncompleteTurn = CommonTurn & {
    type: "INCOMPLETE"
    transmission?: Transmission,
    guesses?: {
        red?: Code,
        blue?: Code
    }
};

export type CompletedTurn = CommonTurn & {
    type: "COMPLETE"
    transmission: Transmission,
    guesses: {
        red: Code,
        blue: Code
    }
}

export type GameState = {
    players: Player[],
    state: GameStates,
    red: Team,
    blue: Team
    history: Array<Turn>
    winner: undefined | "draw" | TeamID
};
