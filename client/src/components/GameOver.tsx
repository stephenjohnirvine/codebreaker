import React from 'react';
import { TeamID } from '../types/gameState';

type GameOverProps = {
  winner: 'draw' | TeamID;
};

export const GameOver = ({ winner }: GameOverProps) => {
  if (winner === 'draw') {
    return (
      <div>
        <h2>Draw!</h2>
      </div>
    );
  }
  return (
    <div>
      <h2>The {winner} team has won the game!</h2>
    </div>
  );
};
