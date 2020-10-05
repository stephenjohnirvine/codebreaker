import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { ViewResults, ViewResultsProps } from './ViewResults';

export default {
  title: 'Components/ViewResults',
  component: ViewResults,
} as Meta;

const Template: Story<ViewResultsProps> = (args) => <ViewResults {...args} />;

export const NoInterceptionsOrFails = Template.bind({});
NoInterceptionsOrFails.args = {
  code: [1, 2, 3],
  transmission: ['battery', 'horse', 'staple'],
  guesses: {
    red: [2, 3, 4],
    blue: [1, 2, 3],
  },
  transmitterTeam: 'blue',
};

export const Interception = Template.bind({});
Interception.args = {
  code: [1, 2, 3],
  transmission: ['battery', 'horse', 'staple'],
  guesses: {
    red: [1, 2, 3],
    blue: [1, 2, 3],
  },
  transmitterTeam: 'blue',
};

export const BlueFailedTransmission = Template.bind({});
BlueFailedTransmission.args = {
  code: [1, 2, 3],
  transmission: ['battery', 'horse', 'staple'],
  guesses: {
    red: [2, 4, 3],
    blue: [1, 4, 3],
  },
  transmitterTeam: 'blue',
};

export const RedFailedTransmission = Template.bind({});
RedFailedTransmission.args = {
  code: [1, 2, 3],
  transmission: ['battery', 'horse', 'staple'],
  guesses: {
    red: [2, 4, 3],
    blue: [1, 4, 3],
  },
  transmitterTeam: 'red',
};

export const RedInterceptionAndBlueFail = Template.bind({});
RedInterceptionAndBlueFail.args = {
  code: [1, 2, 3],
  transmission: ['battery', 'horse', 'staple'],
  guesses: {
    red: [1, 2, 3],
    blue: [1, 4, 3],
  },
  transmitterTeam: 'blue',
};
