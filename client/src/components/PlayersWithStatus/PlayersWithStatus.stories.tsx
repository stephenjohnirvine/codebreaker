import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Player } from '../../types/player';
import {
  PlayersWithStatus,
  PlayersWithStatusProps,
} from '../PlayersWithStatus/PlayersWithStatus';

export default {
  title: 'Components/PlayersWithStatus',
  component: PlayersWithStatus,
} as Meta;

const Template: Story<PlayersWithStatusProps> = (args) => (
  <PlayersWithStatus {...args} />
);

const base: Player[] = [
  {
    id: '1',
    name: 'Stephen',
    status: 'connected',
  },
  {
    id: '2',
    name: 'Pernille',
    status: 'connected',
  },
  {
    id: '3',
    name: 'Ruth',
    status: 'connected',
  },
  {
    id: '4',
    name: 'Phil',
    status: 'connected',
  },
  {
    id: '5',
    name: 'Jesus',
    status: 'connected',
  },
  {
    id: '6',
    name: 'Beatrice',
    status: 'connected',
  },
  {
    id: '7',
    name: 'Randy',
    status: 'connected',
  },
];

export const NoTransmitter = Template.bind({});
NoTransmitter.args = {
  players: base,
  blue: ['1', '3', '5', '7'],
  red: ['2', '4', '6'],
  transmitting: undefined,
};

export const PhilTransmits = Template.bind({});
PhilTransmits.args = {
  players: base,
  blue: ['1', '3', '5', '7'],
  red: ['2', '4', '6'],
  transmitting: '4',
};
