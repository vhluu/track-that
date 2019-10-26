import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { firebaseHOC } from '../../util/Firebase';
import Day from '../day/Day';
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
    };
  }

  componentDidMount() {
    const { date, date: { month, year } } = this.state;
    this.setCalendar(date);

    const { uid } = this.props;
    
    // TODO: change to getDayTags
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

    // if current month doesn't start on Sunday, then get dates from last month
    if (dayOfWeek !== 0) {
      const endOfLastMonth = (new Date(year, month, 0)).getDate(); // last day of last month
      for (let i = 0; i < dayOfWeek; i++) {
        days.push(endOfLastMonth - dayOfWeek + i);
      }
    }

    const daysInCurrMonth = (new Date(year, month + 1, 0)).getDate(); // gets days in current month
    for (let i = 0; i < daysInCurrMonth; i++) {
      days.push(i + 1);
    }

    // add days from next month if needed to fill up calendar
    if (days.length < 35) {
      const daysLeft = 35 - days.length;
      // const nextMonth = new Date(year, month + 1, 1);
      for (let i = 0; i < daysLeft; i++) {
        days.push(i + 1);
      }
    }

    this.setState({ days });
  }

  /* Gets user data from firebase */
  getDayTags(id, month, year) {
    const { firebase } = this.props;
    if (id) {
      firebase.dbGetDayTags(id, Calendar.formatDigit(month + 1), year).then((taggedDays) => {
        console.log(taggedDays);
        if (taggedDays) {
          const tags = Object.keys(taggedDays); // lists of days that have tags
          tags.forEach((tag) => {
            const days = Object.keys(taggedDays[tag]);
            days.forEach((day) => {
              console.log(day);
              // appendDayTag(document.querySelector(`[data-tag-day="${day}"]`), tag);
            });
          });
        }
      });
    }
  }

  appendDayTag(target, tagId) {
    let toAdd = document.createElement('div');
    let tagFromList = tagsList.querySelector(`#${tagId}`);
  
    toAdd.className = `day-tag ${tagFromList.getAttribute('data-tag-color')}`;
    toAdd.textContent = tagFromList.getAttribute('data-tag-icon');
    toAdd.setAttribute('data-day-tag-id', tagId);
    target.querySelector('.day-tags').appendChild(toAdd);
  }

  render() {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    const { date, days } = this.state;

    return (
      <div className="calendar-wrapper">
        <h1 className="curr-date">
          <span className="curr-month">{ date.full.toLocaleString('default', { month: 'long' }) }</span> 
          <span className="curr-year">{ date.year }</span>
        </h1>
        <div className="calendar">
          {daysOfWeek.map((day) => (
            <div className="cal-header">{ day }</div>
          ))}
          {days.map((day) => (
            <Day date={day} />
          ))}
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
