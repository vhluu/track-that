import React, { Component } from 'react';
import { connect } from 'react-redux';

import Calendar from '../components/Calendar/Calendar';
import Pagination from '../components/Pagination/Pagination';

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
    };

    this.getTagInfo = this.getTagInfo.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
  }

  componentDidMount() {
    const { date, date: { month, year } } = this.state;
    this.setCalendar(date);

    const { uid, onGetDayTags } = this.props;    
    if (uid) {
      onGetDayTags(month, year);
    }
  }

  componentDidUpdate(prevProps) {
    const { date: { month, year } } = this.state;
    const { uid, onGetDayTags, tags } = this.props;

    // if uid is being set for the first time, then get the calendar day tags
    if (!prevProps.uid && uid) {
      onGetDayTags(month, year);
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

  /* Takes an array of tag ids and returns an array of tags w/ all of their data (id, title, color, icon) */
  getTagInfo(tagIds) {
    const { tags } = this.props;
    if (tagIds) {
      return tagIds.map((tagId) => {
        const shortId = tagId.substring(1);
        return { 
          id: tagId, 
          title: tags[shortId].title,
          icon: tags[shortId].icon, 
          color: tags[shortId].color, 
        };
      });
    }
    return null;
  }

  // Sets stored date to previous month
  prevMonth() {
    console.log('going to previous month');
    this.setState((prevState) => {
      const { full, month } = prevState.date;
      const date = new Date(full.valueOf());
      date.setMonth(month - 1);
      return ({
        date: {
          full: date,
          month: date.getMonth(),
          year: date.getYear() + 1900,
        },
      });
    });
  }

  render() {
    const { onCreateDayTag, onDeleteDayTag, dayTags, tags } = this.props;
    const { date, days } = this.state;

    return (
      <div className="calendar-wrapper">
        <Pagination prevClick={this.prevMonth}>
          <h1 className="curr-date">
            <span className="curr-month">{ date.full.toLocaleString('default', { month: 'long' }) }</span> 
            <span className="curr-year">{ ` ${date.year}` }</span>
          </h1>
        </Pagination>
        <Calendar days={days} month={date.month} year={date.year} dayTags={dayTags} onCreateDayTag={onCreateDayTag} onDeleteDayTag={onDeleteDayTag} getTagInfo={this.getTagInfo} tagsReady={tags && Object.keys(tags).length > 0} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dayTags: state.dayTags,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateDayTag: (tagId, date) => dispatch(actions.createDayTag(tagId, date)),
  onDeleteDayTag: (tags, date) => dispatch(actions.deleteDayTag(tags, date)),
  onGetDayTags: (month, year) => dispatch(actions.getDayTags(month, year)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainer);
