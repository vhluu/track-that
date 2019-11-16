import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { firebaseHOC } from '../../util/Firebase';
import Day from './Day/Day';
import DayModal from './DayModal/DayModal';

import './Calendar.css';

class Calendar extends Component {
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
      showDayModal: false,
      tags: {},
    };

    this.toggleDayModal = this.toggleDayModal.bind(this);
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
          full: `${Calendar.formatDigit(lastMonth.getMonth() + 1)}${Calendar.formatDigit(currDate)}`,
          date: currDate,
        });
      }
    }

    // gets days in current month
    const daysInCurrMonth = (new Date(year, month + 1, 0)).getDate(); 
    for (let i = 0; i < daysInCurrMonth; i++) {
      currDate = i + 1;
      days.push({
        full: `${Calendar.formatDigit(month + 1)}${Calendar.formatDigit(currDate)}`,
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
          full: `${Calendar.formatDigit(nextMonth.getMonth() + 1)}${Calendar.formatDigit(currDate)}`,
          date: currDate,
        });
      }
    }

    this.setState({ days });
  }

  // TODO: change so that tags and days are in the same array
  /* Gets user data from firebase */
  getDayTags(id, month, year) {
    const { firebase } = this.props;
    if (id) {
      firebase.dbGetDayTags(id, Calendar.formatDigit(month + 1), year).then((taggedDays) => {
        console.log(taggedDays);
        if (taggedDays) {
          const newTags = {};
          const tags = Object.keys(taggedDays); // lists of days that have tags
          tags.forEach((tag) => {
            const dayKeys = Object.keys(taggedDays[tag]);
            dayKeys.forEach((dayKey) => {
              if (newTags[dayKey]) {
                newTags[dayKey].push(tag);
              } else {
                newTags[dayKey] = [tag];
              }
            });
          });

          this.setState({
            tags: newTags,
          });
        }
      });
    }
  }

  toggleDayModal() {
    console.log('toggling');
    this.setState((prevState) => ({
      showDayModal: !(prevState.showDayModal),
    }));
  }

  render() {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    const { date, days, showDayModal, tags } = this.state;

    return (
      <div className="calendar-wrapper">
        <h1 className="curr-date">
          <span className="curr-month">{ date.full.toLocaleString('default', { month: 'long' }) }</span> 
          <span className="curr-year">{ ` ${date.year}` }</span>
        </h1>
        <div className="calendar">
          { daysOfWeek.map((day) => (
            <div className="cal-header">{ day }</div>
          ))}
          { days.map((day) => (
            <Day full={day.full} date={day.date} tags={tags[day.full]} onClick={this.toggleDayModal} />
          ))}

          { showDayModal && <DayModal /> }
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  firebase: PropTypes.objectOf(PropTypes.object).isRequired,
  uid: PropTypes.string.isRequired,
};

export default firebaseHOC(Calendar);
