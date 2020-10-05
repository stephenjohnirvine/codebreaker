import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { GuessCode, GuessCodeProps } from './GuessCode';

export default {
  title: 'Components/GuessCode',
  component: GuessCode,
} as Meta;

const Template: Story<GuessCodeProps> = (args) => <GuessCode {...args} />;

export const GuessCode123 = Template.bind({});
GuessCode123.args = {
  transmission: ['fun', 'with', 'friends'],
};
