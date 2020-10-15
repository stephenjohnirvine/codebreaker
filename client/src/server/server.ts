

import { Code, GameState, TeamID, Transmission } from "../types/gameState";
import { Player } from "../types/player";

export interface Server {
    onWelcome: (callback: (player: Player) => void) => void;
    onGameState: (callback: (gameState: GameState) => void) => void;

    emitPlayerName: (name: string) => void;
    emitStartGame: () => void;
    emitEndTurn: () => void;
    emitGuess: (team: TeamID, guess: Code) => void;
    emitTransmission: (transmission: Transmission) => void;
    emitDisconnect: () => void;
}
