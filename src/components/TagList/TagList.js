import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TagList extends Component {
  render() {
    const { tags, onCreateTag, onDeleteTag, onClick } = this.props;
    return (
      <div>
        <div className="tags-list">
          <div className="tag green" draggable="true" id="aa" data-tag-color="green" data-tag-icon="🌱" data-tag-title="Watered Plants">🌱 Watered Plants</div>
          {Object.keys(tags).map((id) => (
            <div className={`tag ${tags[id].color}`} draggable="true" id={`t${id}`} data-tag-color={tags[id].color} data-tag-icon={tags[id].icon} data-tag-title={tags[id].title} onClick={() => onClick(id)}>{tags[id].icon} {tags[id].title}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default TagList;
