import React from 'react';
import { Cypher as CypherClass } from '../../types/gameState';
import './Cypher.css';

export type CypherProps = {
  cypher: CypherClass;
};

export const Cypher = ({ cypher }: CypherProps) => {
  const arr = [0, 1, 2, 3];

  return (
    <div className="cypher">
      <div className="cypherTitle">Your Cypher</div>
      <div className="cypherRow">
        {arr.map((num) => (
          <div className="cypherIndex cypherRowItem" key={num}>{`${
            num + 1
          }`}</div>
        ))}
      </div>
      <div className="cypherRow">
        {arr.map((num) => (
          <div className="cypherWord cypherRowItem" key={num}>
            {cypher[num]}
          </div>
        ))}
      </div>
    </div>
  );
};
