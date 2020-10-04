import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Player, PlayerProps } from './Player';

export default {
  title: 'Components/Player',
  component: Player,
} as Meta;

const Template: Story<PlayerProps> = (args) => <Player {...args} />;

export const Connected = Template.bind({});
Connected.args = {
  player: {
    id: 'dummy',
    name: 'Stephen',
    status: 'connected',
  },
};

export const Disconnected = Template.bind({});
Disconnected.args = {
  player: {
    id: 'dummy',
    name: 'Stephen',
    status: 'disconnected',
  },
};
