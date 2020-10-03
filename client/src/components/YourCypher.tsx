import React from 'react';
import { Cypher } from '../types/gameState';

export type YourCypherProps = {
  cypher: Cypher;
};

export const YourCypher = ({ cypher }: YourCypherProps) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th colSpan={4}>{`Your team's cypher`}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
          <tr>
            <td>{cypher[0]}</td>
            <td>{cypher[1]}</td>
            <td>{cypher[2]}</td>
            <td>{cypher[3]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
