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
  history: [],
};

export const Transmitting = Template.bind({});
Transmitting.args = {
  game: {
    ...gameBase,
    history: [
      {
        code: [2, 3, 1],
        encryptor: 'p1',
        encryptorTeam: 'red',
        type: 'INCOMPLETE',
      },
    ],
  },
};
