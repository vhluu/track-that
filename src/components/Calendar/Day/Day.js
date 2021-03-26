import React from 'react';
import Icon from '../../Icon/Icon';
import './Day.scss';

function Day(props) {
  const { date, full, onClick, tags, tagsReady, onDragOver, onDragEnter, onDragLeave, onDrop, getTagInfo, currentMonth, current } = props;
  
  let fullTags = null;
  // if we have tags pulled from the database, then get the tag information (title, icon, color)
  if (tagsReady && tags) fullTags = getTagInfo(tags);

  let extraClasses = '';
  if (!currentMonth) extraClasses += ' not-current';
  if (current) extraClasses += ' current-day';

  return (
    <div className={`day${extraClasses}`} data-date={full} onClick={() => onClick(full)} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
      { current && <div className="bar" /> }
      <span className="day-number">{date}</span>
      <div className="day-tags">
        {fullTags && fullTags.map((tag) => (
          <div className={`day-tag ${tag.color}`} data-day-tag-id={tag.id}><Icon data={tag.icon} /></div>
        ))}
      </div>
    </div>
  );
}

export default Day;
