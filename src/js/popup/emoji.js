import { Emoji } from 'emoji-mart';
import React from 'react';
import { define } from 'remount';

const Icon = (props) => (React.createElement(Emoji, {
  set: 'apple',
  size: 16,
  ...props
}));

define({ 'emoji-icon': Icon }, { attributes: ['emoji'] });