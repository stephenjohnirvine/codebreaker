import React from 'react';
import { Code, Transmission } from '../../types/gameState';
import './TransmissionSent.css';

type TransmissionSentProps = {
  code: Code;
  transmission: Transmission;
};

export const TransmissionSent = ({
  code,
  transmission,
}: TransmissionSentProps) => {
  return (
    <div className="transSentSub">
      <div className="transSentSubRow">
        Code was:
        <div className="transSentSubCode">[{code.join(',')}]</div>
      </div>
      <div className="transSentSubRow">
        You transmitted:
        <div className="transSentSubCode">[{transmission.join(',')}]</div>
      </div>
    </div>
  );
};
