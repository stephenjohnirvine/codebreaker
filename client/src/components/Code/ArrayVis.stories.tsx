import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { ArrayVis, ArrayVisProps } from './ArrayVis';

export default {
  title: 'Components/Code',
  component: ArrayVis,
} as Meta;

const Template: Story<ArrayVisProps> = (args) => <ArrayVis {...args} />;

export const Code = Template.bind({});
Code.args = {
  data: [1, 2, 3],
};

export const Transmission = Template.bind({});
Transmission.args = {
  data: ['fox', 'eating', 'a chicken'],
};
