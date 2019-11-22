import React from 'react';
import PropTypes from 'prop-types';

function TagList(props) {
  const { tags, onClick } = props;
  return (
    <div className="tags-list">
      <div className="tag green" draggable="true" id="aa" data-tag-color="green" data-tag-icon="🌱" data-tag-title="Watered Plants">🌱 Watered Plants</div>
      {Object.keys(tags).map((id) => {
        const tag = tags[id];
        return (
          <div
            className={`tag ${tag.color}`}
            draggable="true"
            id={`t${id}`}
            data-tag-color={tag.color}
            data-tag-icon={tag.icon} 
            data-tag-title={tag.title}
            onClick={() => { tag.id = id; onClick(tag)}}
          >{tag.icon} {tag.title}</div>
        );
      })}
    </div>
  );
}

TagList.propTypes = {
  onClick: PropTypes.func,
  tags: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default TagList;
