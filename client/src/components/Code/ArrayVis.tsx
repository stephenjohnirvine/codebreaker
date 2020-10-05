import React from 'react';

import { Code, Transmission } from '../../types/gameState';
import './ArrayVis.css';

export type ArrayVisProps = {
  data: Code | Transmission;
};

export const ArrayVis = ({ data }: ArrayVisProps) => (
  <div className="code">[{data.join(', ')}]</div>
);
