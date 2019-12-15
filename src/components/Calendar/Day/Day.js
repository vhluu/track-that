import React from 'react';

function Day(props) {
  const { date, full, onClick, tags, tagsReady, onDragOver, onDragEnter, onDragLeave, onDrop, getTagInfo } = props;
  
  let fullTags = null;
  if (tagsReady && tags) fullTags = getTagInfo(tags);

  return (
    <div className="day" data-date={full} onClick={() => onClick(full)} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
      <span className="day-number">{date}</span>
      <div className="day-tags">
        <div className="day-tag green" data-day-tag-id="aa">🌱</div>
        {fullTags && fullTags.map((tag) => (
          <div className={`day-tag ${tag.color}`} data-day-tag-id={tag.id}>{ tag.icon }</div>
        ))}
      </div>
    </div>
  );
}

export default Day;
