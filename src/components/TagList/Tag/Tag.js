import React, { Component } from 'react';
import Icon from '../../Icon/Icon';
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
    const { onClick, id, color, icon, title } = this.props;
    
    return (
      <div
        className={`tag ${color}`}
        draggable="true"
        onClick={() => onClick({ id, title, color, icon })}
        onDragStart={this.onDragStart.bind(this)}
        onDragEnd={this.onDragEnd}
      ><Icon data={icon} /> {title}</div>
    );
  }
}

export default Tag;
