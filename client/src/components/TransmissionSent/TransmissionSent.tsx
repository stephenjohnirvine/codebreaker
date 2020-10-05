import React from 'react';
import { Code, Transmission } from '../../types/gameState';
import './TransmissionSent.css';
import { ArrayVis } from '../Code/ArrayVis';

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
        <ArrayVis data={code} />
      </div>
      <div className="transSentSubRow">
        You transmitted:
        <ArrayVis data={transmission} />
      </div>
    </div>
  );
};
