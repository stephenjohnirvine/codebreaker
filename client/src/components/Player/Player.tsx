import React from 'react';

import { Player as PlayerClass } from '../../types/player';
import './Player.css';

export type PlayerProps = {
  player: PlayerClass;
};
export const Player = ({ player }: PlayerProps) => (
  <div>
    <div className="player">
      <div className="name">{player.name}</div>
      <span
        className={[
          'dot',
          player.status === 'connected' ? 'connected' : 'disconnected',
        ].join(' ')}
      />
    </div>
  </div>
);
