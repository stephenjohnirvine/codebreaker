import React from 'react';
import { Transmission, Code } from '../../types/gameState';

export type CompletedTransmision = {
  code: Code;
  transmission: Transmission;
};

export type TeamHistoryProps = {
  transmissions: CompletedTransmision[];
};

export const TransmissionHistory = ({ transmissions }: TeamHistoryProps) => {
  const tableContents = transmissions.map(
    ({
      code,
      transmission,
    }: CompletedTransmision): [string, string, string, string] => {
      const c = code;
      const idxs = [
        c.findIndex((num) => num === 1),
        c.findIndex((num) => num === 2),
        c.findIndex((num) => num === 3),
        c.findIndex((num) => num === 4),
      ];

      return [
        idxs[0] !== -1 ? transmission[idxs[0]] : '',
        idxs[1] !== -1 ? transmission[idxs[1]] : '',
        idxs[2] !== -1 ? transmission[idxs[2]] : '',
        idxs[3] !== -1 ? transmission[idxs[3]] : '',
      ];
    }
  );

  return (
    <div>
      <h4>Team transmission history</h4>
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
