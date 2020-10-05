import React from 'react';
import { Code, Transmission } from '../../types/gameState';
import './GuessSubmitted.css';

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
        Transmission was:{' '}
        <div className="guessSubCode">[{transmission.join(',')}]</div>
      </div>
      <div className="guessSubRow">
        Your team submitted code:{' '}
        <div className="guessSubCode">[{guess.join(',')}]</div>
      </div>
    </div>
  );
};
