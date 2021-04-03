import React from 'react';

import Loading from '../Loading/Loading';
import Tag from './Tag/Tag';
import './TagList.scss';

const TagList = React.forwardRef((props, ref) => {
  const { tags, onClick } = props;
  const keys = Object.keys(tags);

  return (
    <div className="tags-list" ref={ref}>
      { keys.length === 0 && <Loading /> }
      { keys.map((id) => {
        const tag = tags[id];
        return (
          <Tag
            key={id}
            id={id}
            color={tag.color}
            icon={tag.icon} 
            title={tag.title}
            onClick={() => { tag.id = id; onClick(tag); }}
          />
        );
      }) }
    </div>
  );
});

export default TagList;
