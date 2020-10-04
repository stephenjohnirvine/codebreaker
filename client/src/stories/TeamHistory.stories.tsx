import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { TeamHistory, TeamHistoryProps } from '../components/TeamHistory';

export default {
  title: 'Example/TeamHistory',
  component: TeamHistory,
} as Meta;

const Template: Story<TeamHistoryProps> = (args) => <TeamHistory {...args} />;

export const EmptyHistory = Template.bind({});
EmptyHistory.args = {
  turns: [],
};

export const OneItemInHistory = Template.bind({});
EmptyHistory.args = {
  turns: [
    {
      code: [1, 2, 3],
      encryptor: 1,
      encryptorTeam: 'blue',
      guesses: {
        red: [1, 2, 3],
        blue: [1, 2, 3],
      },
      transmission: ['horse', 'battery', 'staple'],
      type: 'COMPLETE',
    },
  ],
};
