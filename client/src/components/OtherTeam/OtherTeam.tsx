import React from 'react';
import { GameState, TeamID, CompletedTurn } from '../../types/gameState';
import { TransmissionHistory } from '../TransmissionHistory/TransmissionHistory';

type OtherTeamProps = {
  game: GameState;
  team: TeamID;
};

export const OtherTeam = ({ game, team }: OtherTeamProps) => {
  const teamTurnHistory = game.history.filter(
    (turn) => turn.type === 'COMPLETE' && turn.encryptorTeam === team
  ) as CompletedTurn[];

  return (
    <div>
      <div className={`teamTitle ${team}Team`}>The {team} team</div>
      <TransmissionHistory transmissions={teamTurnHistory} />
    </div>
  );
};
