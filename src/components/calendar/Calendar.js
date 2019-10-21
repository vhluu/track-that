import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { firebaseHOC } from '../../util/Firebase';
import Day from '../Day/Day';
import './Calendar.css';

class Calendar extends Component {
  constructor(props) {
    super(props);

    const date = new Date();
    this.state = {
      days: [],
      date: {
        full: date,
        month: date.getMonth(),
        year: date.getYear() + 1900,
      },
    };
  }

  componentDidMount() {
    const { date } = this.state;
    this.setCalendar(date);

    const { firebase } = this.props;
    console.log(firebase);
    
    // get authenticated user and get firebase data
    chrome.extension.sendMessage({ greeting: 'hello from calendar' }, (response) => {
      if (response && response.userId) {
        console.log(response);
        firebase.dbGetTags(response.userId).then((tags) => console.log(tags));
      } else {
        console.log("Couldn't get user");
      }
    });
  }

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
};

export default firebaseHOC(Calendar);
