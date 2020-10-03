import React from 'react';
import { CompletedTurn } from '../types/gameState';

export type TeamHistoryProps = {
  turns: CompletedTurn[];
};

export const TeamHistory = ({ turns }: TeamHistoryProps) => {
  const tableContents = turns.map((turn): [string, string, string, string] => {
    const c = turn.code;
    const idxs = [
      c.findIndex((num) => num === 1),
      c.findIndex((num) => num === 2),
      c.findIndex((num) => num === 3),
      c.findIndex((num) => num === 4),
    ];

    return [
      idxs[0] !== -1 ? turn.transmission[idxs[0]] : '',
      idxs[1] !== -1 ? turn.transmission[idxs[1]] : '',
      idxs[2] !== -1 ? turn.transmission[idxs[2]] : '',
      idxs[3] !== -1 ? turn.transmission[idxs[3]] : '',
    ];
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </thead>
        <tbody>
          {tableContents.map((row, index) => (
            <tr key={index}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
              <td>{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
