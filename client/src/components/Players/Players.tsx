import React from 'react';

import { Player as PlayerClass } from '../../types/player';
import { Player } from '../Player/Player';

export type PlayersProps = {
  players: PlayerClass[];
};

export const Players = ({ players }: PlayersProps) => (
  <table>
    <thead>
      <tr>
        <th colSpan={2}>Players</th>
      </tr>
    </thead>
    <tbody>
      {players.map((player: any) => {
        return (
          <tr key={player.id}>
            <Player player={player} />
          </tr>
        );
      })}
    </tbody>
  </table>
);
