import React from 'react';
import Tag from './Tag/Tag';
import './TagList.scss';

const TagList = React.forwardRef((props, ref) => {
  const { tags, onClick } = props;
  return (
    <div className="tags-list" ref={ref}>
      {Object.keys(tags).map((id) => {
        const tag = tags[id];
        return (
          <Tag
            id={id}
            color={tag.color}
            icon={tag.icon} 
            title={tag.title}
            onClick={() => { tag.id = id; onClick(tag); }}
          />
        );
      })}
    </div>
  );
});

export default TagList;
