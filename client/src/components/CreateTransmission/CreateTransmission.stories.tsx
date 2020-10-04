import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {
  CreateTransmission,
  CreateTransmissionProps,
} from './CreateTransmission';

export default {
  title: 'Components/Transmission',
  component: CreateTransmission,
} as Meta;

const Template: Story<CreateTransmissionProps> = (args) => (
  <CreateTransmission {...args} />
);

export const CreateTransmission123 = Template.bind({});
CreateTransmission123.args = {
  code: [1, 2, 3],
};
