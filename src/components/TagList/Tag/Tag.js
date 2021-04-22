import React, { Component } from 'react';
import Icon from '../../Icon/Icon';
import './Tag.scss';
class Tag extends Component {
  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragStart(e) {
    const { id, order } = this.props;
    
    e.target.classList.add('dragged');
    e.dataTransfer.effectAllowed = 'linkMove';
    e.dataTransfer.setData('text/plain', `${id}/${order}`);
  }

  onDragEnd(e) {
    e.target.classList.remove('dragged');
  }

  onDragOver(e) {
    if (e.preventDefault) e.preventDefault(); // allows drop to happen
  }

  onDragEnter(e) {
    if (e.target.classList.contains('tag')) e.target.classList.add('chosen');
  }

  onDragLeave(e) {
    if (e.target.classList.contains('tag')) e.target.classList.remove('chosen');
  }

  onDrop(e) {
    const { onUpdateOrder } = this.props;
    if (e.stopPropagation) { e.stopPropagation(); }

    // get tag ids
    const [dropId, dropOrder] = e.dataTransfer.getData('text/plain').split('/'); // id & order of tag being dropped
    const targetId = e.target.getAttribute('data-id'); // id of tag the drop is targeting

    // swap order
    if (dropId && targetId && dropId !== targetId) {
      const tag1 = { id: dropId, order: parseInt(e.target.getAttribute('data-order')) };
      const tag2 = { id: targetId, order: parseInt(dropOrder) };
      onUpdateOrder(tag1, tag2);
    }
    
    if (e.target.classList.contains('tag')) e.target.classList.remove('chosen');
  }

  render() {
    const { onClick, id, color, icon, title, order } = this.props;
    
    return (
      <div
        className={`tag ${color}`}
        draggable="true"
        onClick={() => onClick({ id, title, color, icon, order })}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        data-id={id}
        data-order={order}
      ><Icon data={icon} /> <span>{title}</span></div>
    );
  }
}

export default Tag;
