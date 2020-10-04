import React from 'react';

import { Player } from '../../types/player';

interface PlayersProps {
  players: Player[];
}

export const Players = ({ players }: PlayersProps) => (
  <table>
    <thead>
      <tr>
        <th colSpan={2}>Players</th>
      </tr>
      <tr>
        <th>ID</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      {players.map((player: any) => {
        return (
          <tr key={player.id}>
            <td>{player.id}</td>
            <td>{player.name}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
