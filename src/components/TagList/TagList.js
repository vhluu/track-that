import React from 'react';

import Loading from '../Loading/Loading';
import Tag from './Tag/Tag';
import './TagList.scss';

const TagList = React.forwardRef((props, ref) => {
  const { tags, onClick, onUpdateOrder } = props;

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
            order={tag.order}
            onClick={() => { onClick(tag); }}
            onUpdateOrder={onUpdateOrder}
          />
        );
      }) }
    </div>
  );
});

export default TagList;
