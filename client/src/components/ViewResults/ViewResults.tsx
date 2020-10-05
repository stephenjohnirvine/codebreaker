import React from 'react';
import { Code, Transmission, TeamID } from '../../types/gameState';
import { ArrayVis } from '../Code/ArrayVis';
import './ViewResults.css';

export type ViewResultsProps = {
  code: Code;
  transmission: Transmission;
  guesses: {
    red: Code;
    blue: Code;
  };
  transmitterTeam: TeamID;
  onEndTurn: () => void;
};
export const ViewResults = ({
  code,
  transmission,
  guesses,
  transmitterTeam,
  onEndTurn,
}: ViewResultsProps) => {
  const interceptingTeam = transmitterTeam === 'red' ? 'blue' : 'red';

  const wasInterception =
    JSON.stringify(guesses[interceptingTeam]) === JSON.stringify(code);
  const wasTransmissionFailure =
    JSON.stringify(guesses[transmitterTeam]) !== JSON.stringify(code);

  const teams: TeamID[] = ['red', 'blue'];

  const extra = {
    [transmitterTeam]: wasTransmissionFailure ? (
      <div className="resultTransFail resultShared">Transmission Failure</div>
    ) : undefined,
    [interceptingTeam]: wasInterception ? (
      <div className="resultInterception resultShared">Interception</div>
    ) : undefined,
  };

  return (
    <div className="resultMain">
      <div>
        The code was <ArrayVis data={code} />
      </div>
      <div>
        The {transmitterTeam} team transmitted <ArrayVis data={transmission} />
      </div>
      {teams.map((team) => (
        <div key={team}>
          The {team} team guessed <ArrayVis data={guesses[team]} />
          {extra[team]}
        </div>
      ))}

      <div className="resultEndRow">
        <button className="resultEndTurn" onClick={onEndTurn}>
          End Turn
        </button>
      </div>
    </div>
  );
};
