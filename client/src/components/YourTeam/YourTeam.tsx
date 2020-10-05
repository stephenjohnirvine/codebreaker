import React from 'react';
import {
  GameState,
  TeamID,
  PlayerID,
  CompletedTurn,
  Transmission,
  Code,
  Turn,
} from '../../types/gameState';
import { Cypher } from '../Cypher/Cypher';
import { TransmissionHistory } from '../TransmissionHistory/TransmissionHistory';
import { CreateTransmission } from '../CreateTransmission/CreateTransmission';
import { GuessCode } from '../GuessCode/GuessCode';
import { TransmissionSent } from '../TransmissionSent/TransmissionSent';
import { WaitingForTransmission } from '../WaitingForTransmission/WaitingForTransmission';
import { GuessSubmitted } from '../GuessSubmitted/GuessSubmitted';
import './YourTeam.css';
import { ViewResults } from '../ViewResults/ViewResults';

export type YourTeamProps = {
  game: GameState;
  team: TeamID;
  me: PlayerID;
  onTransmit: (transmission: Transmission) => void;
  onGuess: (code: Code) => void;
  onEndTurn: () => void;
};

type PlayerStatus =
  | 'TRANSMITTING'
  | 'WAITING'
  | 'GUESSING'
  | 'TRANSMITTED'
  | 'GUESSED'
  | 'VIEWING_RESULTS';

const getPlayerStatus = (
  currentTurn: Turn,
  me: PlayerID,
  team: TeamID
): PlayerStatus => {
  if (currentTurn.type === 'COMPLETE') {
    return 'VIEWING_RESULTS';
  }

  if (currentTurn.encryptor === me) {
    if (currentTurn.transmission === undefined) {
      return 'TRANSMITTING';
    }

    return 'TRANSMITTED';
  }

  if (currentTurn.transmission === undefined) {
    return 'WAITING';
  }

  if (
    currentTurn.guesses === undefined ||
    currentTurn.guesses[team] === undefined
  ) {
    return 'GUESSING';
  }

  return 'GUESSED';
};

export const YourTeam = ({
  game,
  team,
  me,
  onTransmit,
  onGuess,
  onEndTurn,
}: YourTeamProps) => {
  const currentTurn = game.history[game.history.length - 1];

  const currentStatus: PlayerStatus = getPlayerStatus(currentTurn, me, team);

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
    const guesses = currentTurn.guesses;
    if (guesses === undefined) {
      throw new Error('Status guessed but no guesses exist');
    }
    contextComponent = (
      <GuessSubmitted
        transmission={currentTurn.transmission as Transmission}
        guess={guesses[team] as Code}
      />
    );
  } else if (currentStatus === 'VIEWING_RESULTS') {
    const guesses = currentTurn.guesses;
    const code = currentTurn.code;
    contextComponent = (
      <ViewResults
        code={code}
        transmission={currentTurn.transmission as Transmission}
        guesses={guesses as { red: Code; blue: Code }}
        transmitterTeam={currentTurn.encryptorTeam}
        onEndTurn={onEndTurn}
      />
    );
  }

  const teamTurnHistory = game.history.filter(
    (turn) => turn.type === 'COMPLETE' && turn.encryptorTeam === team
  ) as CompletedTurn[];

  return (
    <div>
      <div className={`teamTitle ${team}Team`}>You are on the {team} team!</div>
      <Cypher cypher={game[team].cypher} />
      {contextComponent}
      <TransmissionHistory transmissions={teamTurnHistory} />
    </div>
  );
};
