import React from 'react';
import { Code, Transmission } from '../../types/gameState';
import './GuessSubmitted.css';
import { ArrayVis } from '../Code/ArrayVis';

type GuessSubmittedProps = {
  guess: Code;
  transmission: Transmission;
};

export const GuessSubmitted = ({
  guess,
  transmission,
}: GuessSubmittedProps) => {
  return (
    <div className="guessSub">
      <div className="guessSubRow">
        Transmission was: <ArrayVis data={transmission} />
      </div>
      <div className="guessSubRow">
        Your team submitted code: <ArrayVis data={guess} />
      </div>
    </div>
  );
};
