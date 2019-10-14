import React, { Component } from 'react';
import Day from '../Day/Day';
import './Calendar.css';


class Calendar extends Component {
  constructor(props) {
    super(props);

    const date = new Date();
    this.state = {
      days: [ '10012019', '10022019', '100302019'],
      date: {
        month: date.getMonth(),
        year: date.getFullYear()
      }
    }
  }

  getDays(month, year) {
                   
  }

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
          {this.state.days.map((day) =>
            <Day date={day} />
          )}
        </div>
      </div>
    )
  }
}

export default Calendar;