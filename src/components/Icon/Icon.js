import React from 'react';
import { Emoji } from 'emoji-mart';
import { isMac } from '../../util/utility';

function Icon(props) {
  const { data } = props;
  let icon = isMac ? data.native : <Emoji set="apple" emoji={data.id} size={16} />;
  return (<span>{icon}</span>);
}

export default Icon;
