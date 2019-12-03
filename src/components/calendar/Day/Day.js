import React from 'react';

function Day(props) {
  const { date, full, onClick, tags, onDragOver, onDragEnter, onDragLeave, onDrop } = props;
  return (
    <div className="day" data-date={full} onClick={onClick} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
      <span className="day-number">{date}</span>
      <div className="day-tags">
        <div className="day-tag green" data-day-tag-id="aa">🌱</div>
        {tags && tags.map((tag) => (
          <div className="day-tag" data-day-tag-id={tag}>{ tag }</div>
        ))}
      </div>
    </div>
  );
}

export default Day;
