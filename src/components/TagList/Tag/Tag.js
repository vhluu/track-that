import React, { Component } from 'react';
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
    return (
      <div
        className={`tag ${tagColor}`}
        draggable="true"
        onClick={() => onClick({ id, tagTitle, tagColor, tagIcon })}
        onDragStart={this.onDragStart.bind(this)}
        onDragEnd={this.onDragEnd}
      >{tagIcon} {tagTitle}</div>
    );
  }
}

export default Tag;
