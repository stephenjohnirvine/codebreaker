import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Cypher, CypherProps } from './Cypher';

export default {
  title: 'Components/Cypher',
  component: Cypher,
} as Meta;

const Template: Story<CypherProps> = (args) => <Cypher {...args} />;

export const TeamCypher = Template.bind({});
TeamCypher.args = {
  cypher: ['red', 'yellow', 'green', 'blue'],
};
