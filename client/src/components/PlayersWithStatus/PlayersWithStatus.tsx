import React from 'react';
import { PlayerID, TeamID } from '../../types/gameState';
import { Player } from '../../types/player';
import { Player as PlayerComponent } from '../Player/Player';
import './PlayersWithStatus.css';

const TeamStatus = ({ team }: { team: TeamID }) => {
  return <div className={`teamStatusBlob ${team}`} />;
};

const TransmittingStatus = () => {
  return (
    <div className="transmittingStatus">
      <img
        className="transmittingImage"
        src="/transmitting.svg"
        alt="React Logo"
      />
    </div>
  );
};

export type PlayersWithStatusProps = {
  players: Player[];
  red: PlayerID[];
  blue: PlayerID[];
  transmitting: PlayerID | undefined;
};

export const PlayersWithStatus = ({
  players,
  red,
  blue,
  transmitting,
}: PlayersWithStatusProps) => {
  const getPlayerTeam = (playerId: PlayerID): TeamID => {
    const idEqual = (id: PlayerID) => id === playerId;
    const redIdx = red.findIndex(idEqual);
    if (redIdx !== -1) return 'red';

    const blueIdx = blue.findIndex(idEqual);
    if (blueIdx !== -1) return 'blue';

    throw new Error(`Player id ${playerId} not found in either team`);
  };

  return (
    <div className="playersWithStatusMain">
      {players.map((player, index) => {
        const items = [
          <TeamStatus key="status" team={getPlayerTeam(player.id)} />,
          <PlayerComponent key="player" player={player} />,
        ];

        if (transmitting !== undefined && transmitting === player.id) {
          items.push(<TransmittingStatus key="transmitting" />);
        }

        return (
          <div key={index} className="playersWithStatusRow">
            {items}
          </div>
        );
      })}
    </div>
  );
};
