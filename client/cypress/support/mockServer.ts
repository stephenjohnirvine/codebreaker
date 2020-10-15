import { Server } from "../../src/server/server";
import { Code, GameState, PlayerID, TeamID, Transmission } from "../../src/types/gameState";
import { Player } from "../../src/types/player";



export class MockServer implements Server {

    public readonly gameId: string;
    public readonly userId: PlayerID;
    private readonly mocks: Map<string, any>;
    private welcomeCallback: undefined | ((player: Player) => void);
    private gameStateCallback: undefined | ((gameState: GameState) => void);

    constructor(gameId: string, userId: PlayerID, mocks: Map<string, any>) {
        this.gameId = gameId;
        this.userId = userId;
        this.mocks = mocks;
    }


    sendWelcome(player: Player): void {
        this.welcomeCallback(player)
    }

    sendGameState(gameState: GameState): void {
        this.gameStateCallback(gameState)
    }

    // onWelcome: () => void;
    onWelcome(callback: (player: Player) => void): void {
        this.welcomeCallback = callback;
    }
    onGameState(callback: (gameState: GameState) => void): void {
        this.gameStateCallback = callback;
    }

    emitPlayerName(name: string): void {
        this.mocks["emitPlayerName"] && this.mocks["emitPlayerName"](name)
    }
    emitStartGame(): void {
        this.mocks["emitStartGame"] && this.mocks["emitStartGame"]()
    }
    emitEndTurn(): void {
        this.mocks["emitEndTurn"] && this.mocks["emitEndTurn"]()
    }
    emitGuess(team: TeamID, guess: Code): void {
        this.mocks["emitGuess"] && this.mocks["emitGuess"](team, guess)
    }
    emitTransmission(transmission: Transmission): void {
        this.mocks["emitTransmission"] && this.mocks["emitTransmission"](transmission)
    }
    emitDisconnect(): void {
        this.mocks["emitDisconnect"] && this.mocks["emitDisconnect"]()
    }
}
