import React from 'react';

import Loading from '../Loading/Loading';
import Tag from './Tag/Tag';
import './TagList.scss';

const TagList = React.forwardRef((props, ref) => {
  const { tags, onClick } = props;

  return (
    <div className="tags-list" ref={ref}>
      { tags.length === 0 && <Loading /> }
      { tags.map((tag) => {
        return (
          <Tag
            key={tag.id}
            id={tag.id}
            color={tag.color}
            icon={tag.icon} 
            title={tag.title}
            onClick={() => { onClick(tag); }}
          />
        );
      }) }
    </div>
  );
});

export default TagList;
