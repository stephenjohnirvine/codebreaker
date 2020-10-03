import React from 'react';
import { GameState, TeamID, CompletedTurn } from '../types/gameState';
import { TeamHistory } from './TeamHistory';

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
      <h3>Other Team History</h3>
      <TeamHistory turns={teamTurnHistory} />
    </div>
  );
};
