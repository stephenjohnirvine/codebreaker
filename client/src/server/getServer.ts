import { PlayerID } from "../types/gameState";
import { RealServer } from "./realServer";
import { Server } from "./server";

export const getServer = (gameId: string, userId: PlayerID): Server => {
    const mockConstructor = (window as any).mockServerConstructor
    if (mockConstructor !== undefined) {
        return mockConstructor(gameId, userId);
    }
    return new RealServer(gameId, userId);
}
