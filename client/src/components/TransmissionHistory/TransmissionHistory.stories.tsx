import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { TransmissionHistory, TeamHistoryProps } from './TransmissionHistory';

export default {
  title: 'Components/TeamHistory',
  component: TransmissionHistory,
} as Meta;

const Template: Story<TeamHistoryProps> = (args) => (
  <TransmissionHistory {...args} />
);

export const EmptyHistory = Template.bind({});
EmptyHistory.args = {
  transmissions: [],
};

export const OneItemInHistory = Template.bind({});
OneItemInHistory.args = {
  transmissions: [
    {
      code: [1, 2, 3],
      transmission: ['horse', 'battery', 'staple'],
    },
  ],
};

export const MultipleItemsInHistory = Template.bind({});
MultipleItemsInHistory.args = {
  transmissions: [
    {
      code: [1, 2, 3],
      transmission: ['horse', 'battery', 'staple'],
    },
    {
      code: [3, 4, 2],
      transmission: ['bear', 'booze', 'jesus'],
    },
    {
      code: [4, 3, 2],
      transmission: ['church', 'phone', 'xbox'],
    },
    {
      code: [1, 4, 2],
      transmission: ['bling', 'rap', 'eminem'],
    },
    {
      code: [2, 1, 4],
      transmission: ['computer', 'crab', 'ninja'],
    },
    {
      code: [4, 2, 1],
      transmission: ['sherlock', 'christ', 'presents'],
    },
  ],
};
