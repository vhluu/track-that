import React, { Component } from 'react';
import { connect } from 'react-redux';

import Calendar from '../components/Calendar/Calendar';

import * as actions from '../store/actions/index';

class CalendarContainer extends Component {
  /* Formats the given number as two digits */
  static formatDigit(num) {
    return num < 10 ? `0${num}` : num;
  }

  constructor(props) {
    super(props);

    const date = new Date();
    this.state = {
      date: {
        full: date,
        month: date.getMonth(),
        year: date.getYear() + 1900,
      },
      days: [],
      tags: {},
    };
  }

  componentDidMount() {
    const { date, date: { month, year } } = this.state;
    this.setCalendar(date);

    const { uid } = this.props;    
    if (uid) {
      this.getDayTags(uid, month, year);
    }
  }

  componentDidUpdate(prevProps) {
    const { date: { month, year } } = this.state;
    const { uid } = this.props;
    if (prevProps.uid !== uid) {
      this.getDayTags(uid, month, year);
    }
  }

  // TODO: store generated dates so that we dont have to recalculate each time??
  /* Sets the calendar to the given month and year */
  setCalendar({ month, year }) {
    const days = [];
    const currMonth = new Date(year, month, 1); // sets date to 1st day of current month
    const dayOfWeek = currMonth.getDay();
    let currDate;

    // if current month doesn't start on Sunday, then get dates from last month
    if (dayOfWeek !== 0) {
      const lastMonth = new Date(year, month, 0);
      const endOfLastMonth = lastMonth.getDate(); // last day of last month
      
      for (let i = 0; i < dayOfWeek; i++) {
        currDate = endOfLastMonth - dayOfWeek + i;
        days.push({
          full: `${CalendarContainer.formatDigit(lastMonth.getMonth() + 1)}${CalendarContainer.formatDigit(currDate)}`,
          date: currDate,
        });
      }
    }

    // gets days in current month
    const daysInCurrMonth = (new Date(year, month + 1, 0)).getDate(); 
    for (let i = 0; i < daysInCurrMonth; i++) {
      currDate = i + 1;
      days.push({
        full: `${CalendarContainer.formatDigit(month + 1)}${CalendarContainer.formatDigit(currDate)}`,
        date: currDate,
      });
    }

    // add days from next month if needed to fill up calendar
    const daysLeft = 35 - Object.keys(days).length;
    if (daysLeft > 0) {
      const nextMonth = new Date(year, month + 1, 1);
      for (let i = 0; i < daysLeft; i++) {
        currDate = i + 1;
        days.push({
          full: `${CalendarContainer.formatDigit(nextMonth.getMonth() + 1)}${CalendarContainer.formatDigit(currDate)}`,
          date: currDate,
        });
      }
    }

    this.setState({ days });
  }

  render() {
    const { onCreateDayTag, onDeleteDayTag } = this.props;
    const { date, days, dayTags } = this.state;

    return (
      <div className="calendar-wrapper">
        <h1 className="curr-date">
          <span className="curr-month">{ date.full.toLocaleString('default', { month: 'long' }) }</span> 
          <span className="curr-year">{ ` ${date.year}` }</span>
        </h1>
        <Calendar days={days} month={date.month + 1} year={date.year} tags={dayTags} onCreateDayTag={onCreateDayTag} onDeleteDayTag={onDeleteDayTag} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dayTags: state.dayTags,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateDayTag: (tagId, date) => dispatch(actions.createDayTag(tagId, date)),
  onDeleteDayTag: (tagId, day) => dispatch(actions.deleteDayTag(tagId, day)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainer);
