import React from 'react';
import {
  GameState,
  TeamID,
  Transmission,
  Code,
  PlayerID,
} from '../../types/gameState';
import { YourTeam } from '../YourTeam/YourTeam';
import { OtherTeam } from '../OtherTeam/OtherTeam';
import { GameStatus } from '../GameStatus/GameStatus';
import './GameRunning.css';
import { PlayersWithStatus } from '../PlayersWithStatus/PlayersWithStatus';

export type GameRunningProps = {
  game: GameState;
  myId: PlayerID;
  onTeamGuess: (team: TeamID, guess: Code) => void;
  onTransmit: (transmission: Transmission) => void;
  onEndTurn: () => void;
};

export const GameRunning = ({
  game,
  myId,
  onTransmit,
  onTeamGuess,
  onEndTurn,
}: GameRunningProps) => {
  const myTeam = game.red.players.find((player) => player === myId)
    ? 'red'
    : 'blue';

  const otherTeam = myTeam === 'red' ? 'blue' : 'red';

  return (
    <div className="parent">
      <div className="mainPanel">
        <YourTeam
          me={myId}
          game={game}
          team={myTeam}
          onGuess={(code: Code) => onTeamGuess(myTeam, code)}
          onTransmit={onTransmit}
          onEndTurn={onEndTurn}
        />
      </div>
      <div className="mainPanel">
        <OtherTeam team={otherTeam} game={game} />
      </div>
      <div className="sidePanel">
        <GameStatus game={game} />
        <PlayersWithStatus
          players={game.players}
          red={game.red.players}
          blue={game.blue.players}
          transmitting={game.history[game.history.length - 1].encryptor}
        />
      </div>
    </div>
  );
};
