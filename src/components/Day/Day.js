import React from 'react';

function Day(props) {
  const { date } = props;
  return (
    <div className="day">
      <span className="day-number">{date}</span>
      <div className="day-tags">
        <div className="day-tag green" data-day-tag-id="aa">🌱</div>
      </div>
    </div>
  );
}

export default Day;
