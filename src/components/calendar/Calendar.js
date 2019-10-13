import React, { Component } from 'react';
import './Calendar.css';

class Calendar extends Component {
  render() {
    return (
      <div class="calendar-wrapper">
        <h1 class="curr-date"><span class="curr-month"></span><span class="curr-year"></span></h1>
        <div class="calendar">
          <div class="cal-header">Sun</div>
          <div class="cal-header">Mon</div>
          <div class="cal-header">Tue</div>
          <div class="cal-header">Wed</div>
          <div class="cal-header">Thur</div>
          <div class="cal-header">Fri</div>
          <div class="cal-header">Sat</div>
          <div class="day"><span class="day-number"></span><div class="day-tags"><div class="day-tag green" data-day-tag-id="aa">🌱</div></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
          <div class="day"><span class="day-number"></span><div class="day-tags"></div></div>
        </div>
      </div>
    )
  }
}

export default Calendar;