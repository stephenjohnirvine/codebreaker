import React from 'react';
import { Transmission, Code } from '../../types/gameState';
import './TransmissionHistory.css';

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

  const fourArr = [0, 1, 2, 3];

  return (
    <div className="transmissionHistory">
      <p>Team transmission history</p>
      <div className="historyRow">
        {fourArr.map((num) => (
          <div className="historyIndex historyRowItem" key={num}>{`${
            num + 1
          }`}</div>
        ))}
      </div>
      {tableContents.map((row, index) => (
        <div key={index} className="historyRow">
          {fourArr.map((num) => (
            <div
              className={`${
                row[num] === '' ? '' : 'historyEntry'
              } historyRowItem`}
              key={num}
            >
              {row[num]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
