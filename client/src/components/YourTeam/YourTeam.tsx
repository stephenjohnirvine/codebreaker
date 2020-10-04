import React from 'react';
import {
  GameState,
  TeamID,
  PlayerID,
  CompletedTurn,
  Transmission,
  Code,
} from '../../types/gameState';
import { Cypher } from '../Cypher/Cypher';
import { TransmissionHistory } from '../TransmissionHistory/TransmissionHistory';
import { CreateTransmission } from '../CreateTransmission/CreateTransmission';
import { GuessCode } from '../GuessCode/GuessCode';
import { TransmissionSent } from '../TransmissionSent/TransmissionSent';
import { WaitingForTransmission } from '../WaitingForTransmission/WaitingForTransmission';
import { GuessSubmitted } from '../GuessSubmitted/GuessSubmitted';

export type YourTeamProps = {
  game: GameState;
  team: TeamID;
  me: PlayerID;
  onTransmit: (transmission: Transmission) => void;
  onGuess: (code: Code) => void;
};

export const YourTeam = ({
  game,
  team,
  me,
  onTransmit,
  onGuess,
}: YourTeamProps) => {
  const currentTurn = game.history[game.history.length - 1];

  type PlayerStatus =
    | 'TRANSMITTING'
    | 'WAITING'
    | 'GUESSING'
    | 'TRANSMITTED'
    | 'GUESSED';
  const currentStatus: PlayerStatus =
    currentTurn.encryptor === me
      ? currentTurn.transmission === undefined
        ? 'TRANSMITTING'
        : 'TRANSMITTED'
      : currentTurn.transmission === undefined
      ? 'WAITING'
      : currentTurn.guesses === undefined ||
        currentTurn.guesses[team] === undefined
      ? 'GUESSING'
      : 'GUESSED';

  let contextComponent;
  if (currentStatus === 'TRANSMITTING') {
    contextComponent = (
      <CreateTransmission code={currentTurn.code} onSend={onTransmit} />
    );
  } else if (currentStatus === 'TRANSMITTED') {
    contextComponent = (
      <TransmissionSent
        transmission={currentTurn.transmission as Transmission}
        code={currentTurn.code}
      />
    );
  } else if (currentStatus === 'WAITING') {
    contextComponent = <WaitingForTransmission />;
  } else if (currentStatus === 'GUESSING') {
    contextComponent = (
      <GuessCode
        transmission={currentTurn.transmission as Transmission}
        onGuess={onGuess}
      />
    );
  } else if (currentStatus === 'GUESSED') {
    contextComponent = (
      <GuessSubmitted
        transmission={currentTurn.transmission as Transmission}
        guess={currentTurn.guesses[team] as Code}
      />
    );
  }

  const teamTurnHistory = game.history.filter(
    (turn) => turn.type === 'COMPLETE' && turn.encryptorTeam === team
  ) as CompletedTurn[];

  return (
    <div>
      <div>You are on the {team} team!</div>
      <Cypher cypher={game[team].cypher} />
      {contextComponent}
      <TransmissionHistory transmissions={teamTurnHistory} />
    </div>
  );
};
