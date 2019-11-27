import React, { Component } from 'react';

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

  onDrop() {

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
        onDrop={this.onDrop}
      >{tagIcon} {tagTitle}</div>
    );
  }
}

export default Tag;
