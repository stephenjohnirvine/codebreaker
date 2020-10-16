import React from 'react';
import { TeamID } from '../../types/gameState';
import './Scores.css';

export type TeamScores = {
  transmissionFailures: number;
  interceptions: number;
};

export type ScoresProps = {
  red: TeamScores;
  blue: TeamScores;
};

const InterceptionLabel = () => (
  <div className="scoresLabel">Interceptions</div>
);
const FailedTransmissionLabel = () => (
  <div className="scoresLabel">Failed Transmissions</div>
);
const Number = ({ num }: { num: number }) => (
  <div className="scoresNumberBox">{num}</div>
);

const TeamScore = ({
  team,
  transmissionFailures,
  interceptions,
}: TeamScores & { team: TeamID }) => (
  <div className={`scoresTeam`}>
    <div className={`scoresTeamName ${team}`}>{team}</div>
    <div className="scoresColumns">
      <div className="scoresColumn scoresLabelsColumn">
        <InterceptionLabel />
        <FailedTransmissionLabel />
      </div>
      <div className="scoresColumn">
        <Number num={interceptions} />
        <Number num={transmissionFailures} />
      </div>
    </div>
  </div>
);

export const Scores = ({ blue, red }: ScoresProps) => (
  <div className="scoresMain">
    <TeamScore
      team={'red'}
      transmissionFailures={red.transmissionFailures}
      interceptions={red.transmissionFailures}
    />
    <TeamScore
      team={'blue'}
      transmissionFailures={blue.transmissionFailures}
      interceptions={blue.transmissionFailures}
    />
  </div>
);
