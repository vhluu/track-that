import React, { Component } from 'react';

class Tag extends Component {
  onDragStart(e) {
    e.target.classList.add('dragged');
    e.dataTransfer.effectAllowed = 'copyLink';
    e.dataTransfer.setData('text/plain', this.id);
  }

  onDragEnd() {

  }

  onDrop() {

  }

  render() {
    const { onClick, id, tagColor, tagIcon, tagTitle } = this.props;
    return (
      <div
        className={`tag ${tagColor}`}
        draggable="true"
        onClick={() => onClick({ id, tagTitle, tagColor, tagIcon })}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragDrop={this.onDrop}
      >{tagIcon} {tagTitle}</div>
    );
  }
}

export default Tag;
