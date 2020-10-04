import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Player as PlayerClass } from '../../types/player';
import { Players, PlayersProps } from '../Players/Players';

export default {
  title: 'Components/Players',
  component: Players,
} as Meta;

const Template: Story<PlayersProps> = (args) => <Players {...args} />;

export const NoPlayers = Template.bind({});
NoPlayers.args = {
  players: [],
};

const playersBase = [
  {
    id: 1,
    name: 'Stephen',
  },
  {
    id: 2,
    name: 'Pernille',
  },
  {
    id: 3,
    name: 'Ruth',
  },
  {
    id: 4,
    name: 'Phil',
  },
  {
    id: 5,
    name: 'Jesus',
  },
  {
    id: 6,
    name: 'Beatrice',
  },
  {
    id: 7,
    name: 'Randy',
  },
];

const idToString = (p: {
  id: number;
  name: string;
}): { id: string; name: string } => ({ ...p, id: `${p.id}` });

export const AllConnected = Template.bind({});
AllConnected.args = {
  players: playersBase
    .slice(0, 3)
    .map(idToString)
    .map(
      (playerBase): PlayerClass => ({
        ...playerBase,
        status: 'connected',
      })
    ),
};

export const AllDisconnected = Template.bind({});
AllDisconnected.args = {
  players: playersBase
    .slice(1, 5)
    .map(idToString)
    .map(
      (playerBase): PlayerClass => ({ ...playerBase, status: 'disconnected' })
    ),
};

export const Mixed = Template.bind({});
Mixed.args = {
  players: playersBase.map((playerBase) => ({
    ...playerBase,
    id: `${playerBase.id}`,
    status: playerBase.id % 3 === 0 ? 'disconnected' : 'connected',
  })),
};
