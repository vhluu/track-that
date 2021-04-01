import React from 'react';
import { Emoji } from 'emoji-mart';
import { isMac } from '../../util/utility';

function Icon(props) {
  const { data } = props;
  let icon = isMac ? <span>{data.native}</span> : <Emoji set="apple" emoji={data.id} size={19} />;
  return (<>{icon}</>);
}

export default Icon;
