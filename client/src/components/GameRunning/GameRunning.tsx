import React from 'react';
import {
  GameState,
  TeamID,
  Transmission,
  Code,
  PlayerID,
} from '../../types/gameState';
import { Player } from '../../types/player';
import { YourTeam } from '../YourTeam/YourTeam';
import { OtherTeam } from '../OtherTeam/OtherTeam';
import { GameStatus } from '../GameStatus/GameStatus';
import { Players } from '../Players/Players';

interface GameRunningProps {
  players: Player[];
  game: GameState;
  myId: PlayerID;
  onTeamGuess: (team: TeamID, guess: Code) => void;
  onTransmit: (transmission: Transmission) => void;
}

export const GameRunning = ({
  game,
  myId,
  onTransmit,
  onTeamGuess,
}: GameRunningProps) => {
  const myTeam = game.red.players.find((player) => player === myId)
    ? 'red'
    : 'blue';

  const otherTeam = myTeam === 'red' ? 'blue' : 'red';

  return (
    <div>
      <YourTeam
        me={myId}
        game={game}
        team={myTeam}
        onGuess={(code: Code) => onTeamGuess(myTeam, code)}
        onTransmit={onTransmit}
      />
      <OtherTeam team={otherTeam} game={game} />
      <GameStatus game={game} />
      <Players players={game.players} />
    </div>
  );
};
