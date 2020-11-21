import React, { Component } from 'react';
import { Emoji, getEmojiDataFromNative } from 'emoji-mart';
import data from 'emoji-mart/data/all.json';
import { isMac } from '../../../util/utility';

import './Tag.scss';

class Tag extends Component {
  onDragStart(e) {
    const { id } = this.props;
    e.target.classList.add('dragged');
    e.dataTransfer.effectAllowed = 'copyLink';
    e.dataTransfer.setData('text/plain', id);
  }

  onDragEnd(e) {
    e.target.classList.remove('dragged');
  }

  render() {
    const { onClick, id, tagColor, tagIcon, tagTitle } = this.props;

    let emojiData;

    if (isMac && tagIcon) {
      emojiData = getEmojiDataFromNative(tagIcon, 'apple', data);
    }
    return (
      <div
        className={`tag ${tagColor}`}
        draggable="true"
        onClick={() => onClick({ id, tagTitle, tagColor, tagIcon })}
        onDragStart={this.onDragStart.bind(this)}
        onDragEnd={this.onDragEnd}
      >{ !isMac ? tagIcon : (
        <Emoji emoji={emojiData} set='apple' size={16} />
      )} {tagTitle}</div>
    );
  }
}

export default Tag;
