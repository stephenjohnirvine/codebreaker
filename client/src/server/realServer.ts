import { Code, GameState, PlayerID, TeamID, Transmission } from "../types/gameState";
import { Player } from "../types/player";
import { Server } from "./server";
import io from 'socket.io-client';

export class RealServer implements Server {

    private readonly socket: SocketIOClient.Socket;

    constructor(gameId: string, userId: PlayerID) {
        this.socket = io({
            query: {
                gameId,
                userId
            },
        });
    }

    // onWelcome: () => void;
    onWelcome(callback: (player: Player) => void): void {
        this.socket.on('welcome', callback);
    }
    onGameState(callback: (gameState: GameState) => void): void {
        this.socket.on('game state', callback);
    }

    emitPlayerName(name: string): void {
        this.socket.emit('player name', name);
    }
    emitStartGame(): void {
        this.socket.emit('start game');
    }
    emitEndTurn(): void {
        this.socket.emit('end turn');
    }
    emitGuess(team: TeamID, guess: Code): void {
        this.socket.emit('guess', { team, guess });
    }
    emitTransmission(transmission: Transmission): void {
        this.socket.emit('transmission', transmission);
    }
    emitDisconnect(): void {
        this.socket.emit('disconnect');
    }
}
