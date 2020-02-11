import React from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag/Tag';
import './TagList.scss';

function TagList(props) {
  const { tags, onClick } = props;
  return (
    <div className="tags-list">
      {Object.keys(tags).map((id) => {
        const tag = tags[id];
        return (
          <Tag
            id={id}
            tagColor={tag.color}
            tagIcon={tag.icon} 
            tagTitle={tag.title}
            onClick={() => { tag.id = id; onClick(tag); }}
          />
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
