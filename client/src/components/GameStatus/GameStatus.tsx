import React from 'react';
import { GameState } from '../../types/gameState';
import { Scores } from '../Scores/Scores';

type GameStatusProps = {
  game: GameState;
};

export const GameStatus = ({ game }: GameStatusProps) => {
  return (
    <div>
      <h3>Game Status:</h3>
      <p>Turn: {Math.floor(game.history.length / 2) + 1}</p>
      <Scores red={game.red} blue={game.blue} />
    </div>
  );
};
