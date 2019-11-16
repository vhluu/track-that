import React from 'react';

function Day(props) {
  const { date, onClick, tags } = props;
  return (
    <div className="day" onClick={onClick}>
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
