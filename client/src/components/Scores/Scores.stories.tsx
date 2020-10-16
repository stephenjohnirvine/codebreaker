import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Scores, ScoresProps } from '../Scores/Scores';

export default {
  title: 'Components/Scores',
  component: Scores,
} as Meta;

const Template: Story<ScoresProps> = (args) => <Scores {...args} />;

export const NoScores = Template.bind({});
NoScores.args = {
  red: {
    transmissionFailures: 0,
    interceptions: 0,
  },
  blue: {
    transmissionFailures: 0,
    interceptions: 0,
  },
};

export const RedTransmissionFailure = Template.bind({});
RedTransmissionFailure.args = {
  red: {
    transmissionFailures: 1,
    interceptions: 0,
  },
  blue: {
    transmissionFailures: 0,
    interceptions: 0,
  },
};

export const BlueInterception = Template.bind({});
BlueInterception.args = {
  red: {
    transmissionFailures: 0,
    interceptions: 0,
  },
  blue: {
    transmissionFailures: 0,
    interceptions: 1,
  },
};

export const RedWinning = Template.bind({});
RedWinning.args = {
  red: {
    transmissionFailures: 1,
    interceptions: 2,
  },
  blue: {
    transmissionFailures: 0,
    interceptions: 1,
  },
};
