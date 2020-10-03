import React from 'react';
import { Player } from '../types/player';

export interface TeamsProps {
  players: Player[];
}

export const Teams = ({ players }: TeamsProps) => {
  const redTeam = players.filter((player) => player.team === 'red');
  const blueTeam = players.filter((player) => player.team === 'blue');
  return (
    <div>
      Total Players: {players.length}
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Red Team</th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {redTeam.map((player: any) => {
            return (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Blue Team</th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {blueTeam.map((player: any) => {
            return (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
