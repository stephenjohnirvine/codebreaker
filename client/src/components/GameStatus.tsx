import React from 'react';
import { GameState } from '../types/gameState';

type GameStatusProps = {
  game: GameState;
};

export const GameStatus = ({ game }: GameStatusProps) => {
  return (
    <div>
      <h3>Game Status:</h3>
      <p>Turn: {Math.floor(game.history.length / 2) + 1}</p>
      <p>
        Interceptions: (Red: {game['red'].interceptions}) (Blue:{' '}
        {game['blue'].interceptions})
      </p>
      <p>
        Failed Transmissions: (Red: {game['red'].transmission_fails}) (Blue:{' '}
        {game['blue'].transmission_fails})
      </p>
    </div>
  );
};
