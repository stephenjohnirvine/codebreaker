import React from 'react';
import { Players } from '../Players/Players';
import { Player } from '../../types/player';
import { PlayerID } from '../../types/gameState';

export interface GameLobbyProps {
  players: Player[];
  myId: PlayerID;
  onNameChange: (name: string) => void;
  onGameStart: () => void;
}

export const GameLobby = (props: GameLobbyProps) => {
  const me = props.players.find((player) => player.id === props.myId);
  if (me === undefined) {
    throw new Error('Me no exist');
  }

  const gameCanStart: boolean =
    props.players.length > 3 &&
    props.players.every((player) => player.name !== '');

  return (
    <div>
      <h3>Waiting for players to join...</h3>
      <p>
        Game link:
        <input
          disabled
          value={window.location.href}
          style={{ width: '500px' }}
        />
      </p>
      <p>
        Please enter your name:{' '}
        <input
          value={me.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            props.onNameChange(event.target.value)
          }
        />
      </p>
      <Players players={props.players} />
      <button disabled={!gameCanStart} onClick={props.onGameStart}>
        Start the Game!
      </button>
      <p>(You need 4 players to start)</p>
    </div>
  );
};
