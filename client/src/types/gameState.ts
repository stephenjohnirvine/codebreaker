export type TeamID = "red" | "blue";
export type PlayerID = number;
export type GameStates = "LOBBY" | "RUNNING" | "FINISHED";

export type Code = [number, number, number];

export type Cypher = [string, string, string, string];

export type Transmission = [string, string, string];

export type Team = {
    interceptions: number,
    transmission_fails: number,
    last_transmitter: PlayerID | undefined,
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
    transmission: Transmission | undefined,
    guesses: {
        red: Code | undefined,
        blue: Code | undefined
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
    current_transmitter: PlayerID | undefined,
    state: GameStates,
    red: Team,
    blue: Team
    history: Array<Turn>
};
