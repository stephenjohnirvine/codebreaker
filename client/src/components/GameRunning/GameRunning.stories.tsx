import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { GameRunning, GameRunningProps } from './GameRunning';
import { GameState } from '../../types/gameState';

export default {
  title: 'Components/GameRunning',
  component: GameRunning,
} as Meta;

const Template: Story<GameRunningProps> = (args) => <GameRunning {...args} />;

const gameBase: GameState = {
  current_transmitter: 'p1',
  blue: {
    cypher: ['apple', 'bear', 'cheese', 'donkey'],
    interceptions: 0,
    transmission_fails: 0,
    last_transmitter: undefined,
    players: ['p1', 'p2', 'p5'],
  },
  red: {
    cypher: ['elephant', 'fridge', 'goat', 'house'],
    interceptions: 0,
    transmission_fails: 0,
    last_transmitter: undefined,
    players: ['p3', 'p4', 'p6'],
  },
  players: [
    {
      id: 'p1',
      name: 'Steve',
      status: 'connected',
    },
    {
      id: 'p2',
      name: 'Pernille',
      status: 'connected',
    },
    {
      id: 'p3',
      name: 'Billy',
      status: 'connected',
    },
    {
      id: 'p4',
      name: 'Lucy',
      status: 'connected',
    },
    {
      id: 'p5',
      name: 'Alex',
      status: 'connected',
    },
    {
      id: 'p6',
      name: 'Sarah',
      status: 'connected',
    },
  ],
  state: 'RUNNING',
  winner: undefined,
  history: [
    {
      code: [2, 3, 1],
      encryptor: 'p1',
      encryptorTeam: 'blue',
      transmission: ['battery', 'horse', 'staple'],
      guesses: {
        blue: [2, 3, 1],
        red: [2, 3, 1],
      },
      type: 'COMPLETE',
    },
    {
      code: [1, 2, 3],
      encryptor: 'p3',
      encryptorTeam: 'red',
      transmission: ['silly', 'old', 'sam'],
      guesses: {
        blue: [2, 3, 1],
        red: [2, 3, 1],
      },
      type: 'COMPLETE',
    },
  ],
};

export const WaitingForTransmission = Template.bind({});
WaitingForTransmission.args = {
  game: {
    ...gameBase,
    history: [
      ...gameBase.history,
      {
        code: [2, 3, 1],
        encryptor: 'p1',
        encryptorTeam: 'blue',
        type: 'INCOMPLETE',
      },
    ],
  },
  myId: 'p2',
};

export const Transmitting = Template.bind({});
Transmitting.args = {
  game: {
    ...gameBase,
    history: [
      ...gameBase.history,
      {
        code: [2, 3, 1],
        encryptor: 'p1',
        encryptorTeam: 'blue',
        type: 'INCOMPLETE',
      },
    ],
  },
  myId: 'p1',
};

export const Transmitted = Template.bind({});
Transmitted.args = {
  game: {
    ...gameBase,
    history: [
      ...gameBase.history,
      {
        code: [2, 3, 1],
        encryptor: 'p1',
        encryptorTeam: 'blue',
        transmission: ['battery', 'horse', 'staple'],
        type: 'INCOMPLETE',
      },
    ],
  },
  myId: 'p1',
};

export const Decoding = Template.bind({});
Decoding.args = {
  game: {
    ...gameBase,
    history: [
      ...gameBase.history,
      {
        code: [2, 3, 1],
        encryptor: 'p1',
        encryptorTeam: 'blue',
        transmission: ['battery', 'horse', 'staple'],
        type: 'INCOMPLETE',
      },
    ],
  },
  myId: 'p2',
};

export const GuessSubmitted = Template.bind({});
GuessSubmitted.args = {
  game: {
    ...gameBase,
    history: [
      ...gameBase.history,
      {
        code: [2, 3, 1],
        encryptor: 'p1',
        encryptorTeam: 'blue',
        transmission: ['battery', 'horse', 'staple'],
        guesses: {
          blue: [2, 3, 1],
        },
        type: 'INCOMPLETE',
      },
    ],
  },
  myId: 'p2',
};

export const EndOfTurn = Template.bind({});
EndOfTurn.args = {
  game: {
    ...gameBase,
    history: [
      ...gameBase.history,
      {
        code: [2, 3, 1],
        encryptor: 'p1',
        encryptorTeam: 'blue',
        transmission: ['battery', 'horse', 'staple'],
        guesses: {
          blue: [2, 3, 1],
          red: [2, 3, 1],
        },
        type: 'COMPLETE',
      },
    ],
  },
  myId: 'p2',
};
