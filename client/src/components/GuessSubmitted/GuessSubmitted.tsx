import React from 'react';
import { Code, Transmission } from '../../types/gameState';

type GuessSubmittedProps = {
  guess: Code;
  transmission: Transmission;
};

export const GuessSubmitted = ({
  guess,
  transmission,
}: GuessSubmittedProps) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td colSpan={3}>Guess Submitted:</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{transmission[0]}</td>
            <td>{transmission[1]}</td>
            <td>{transmission[2]}</td>
          </tr>
          <tr>
            <td>
              <input disabled value={guess[0]} />
            </td>
            <td>
              <input disabled value={guess[1]} />
            </td>
            <td>
              <input disabled value={guess[2]} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
