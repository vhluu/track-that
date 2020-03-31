import React, { Component } from 'react';
import { connect } from 'react-redux';

import Calendar from '../../components/Calendar/Calendar';
import Pagination from '../../components/Pagination/Pagination';
import Button from '../../components/Button/Button';
import './CalendarContainer.scss';

import * as actions from '../../store/actions/index';

class CalendarContainer extends Component {
  constructor(props) {
    super(props);

    const date = new Date();
    const monthIndex = date.getMonth();
    this.state = {
      date: {
        full: date,
        monthIndex, // index of month, starting at 0 for January
        month: this.formatDigit((monthIndex + 1) % 13),
        year: date.getYear() + 1900,
        start: null, // start date of current calendar view in format YYYY-MM-DD
        end: null, // end date ...
      },
      days: [],
    };

    this.getTagInfo = this.getTagInfo.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.currentMonth = this.currentMonth.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { date, date: { month, year } } = this.state;

    this.setCalendar(date); // set calendar to current month
    window.addEventListener('keydown', this.handleKeyDown, true); // listen to keydown for navigating through calendar months
  }

  componentDidUpdate(prevProps, prevState) {
    const { date } = this.state;
    const { uid, onGetDayTags, savedStart, savedEnd } = this.props;
    let { start, end } = this.state;

    // if the userId is set for the first time or the user goes to a different calendar month, 
    // then get the day tags from the database
    if (uid && (!prevProps.uid || prevState.start !== start || prevState.end !== end)) {
      console.log(`saved: ${savedStart}, ${savedEnd}`);
      console.log(`new: ${start}, ${end}`);

      // compare the current calendar view's start/end date to our saved start/end dates so that we
      // only grab data from the database for dates that we havent grabbed before
      if (savedStart && start < savedStart) {
        end = this.updateDateString(savedStart, -1);
      } else if (savedStart && start > savedStart) {
        start = this.updateDateString(savedEnd, 1);
      }

      if (start < end && start !== savedStart && end !== savedEnd) onGetDayTags(start, end);
    }

    // if date changes then update the calendar days displayed
    if (prevState.date && prevState.date !== date) {
      this.setCalendar(date);
    }
  }
  
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }


  /* Sets the calendar to the given month and year */
  setCalendar({ monthIndex, year }) {
    const days = [];
    const currMonth = new Date(year, monthIndex, 1); // sets date to 1st day of current month
    const dayOfWeek = currMonth.getDay();
    let currDate;

    // if current month doesn't start on Sunday, then get dates from last month
    if (dayOfWeek !== 0) {
      const lastMonth = new Date(year, monthIndex, 0);
      const endOfLastMonth = lastMonth.getDate(); // last day of last month
      for (let i = 0; i < dayOfWeek; i++) {
        currDate = endOfLastMonth - dayOfWeek + i + 1;
        days.push({
          full: `${lastMonth.getYear() + 1900}-${this.formatDigit(lastMonth.getMonth() + 1)}-${this.formatDigit(currDate)}`,
          date: currDate,
        });
      }
    }

    // gets days in current month
    const daysInCurrMonth = (new Date(year, monthIndex + 1, 0)).getDate();
    const current = new Date(); 
    const currentDate = current.getDate();
    const currentMonth = current.getMonth();
    let daysLeft = 35 - Object.keys(days).length;
    for (let i = 0; i < Math.min(daysInCurrMonth, daysLeft); i++) {
      currDate = i + 1;
      const dayObj = {
        full: `${year}-${this.formatDigit(monthIndex + 1)}-${this.formatDigit(currDate)}`,
        date: currDate,
        currentMonth: true,
      };

      if (currentMonth === monthIndex) {
        dayObj.current = (currDate === currentDate);
      } 
      days.push(dayObj);
    }

    // add days from next month if needed to fill up calendar
    daysLeft = 35 - Object.keys(days).length;
    if (daysLeft > 0) {
      const nextMonth = new Date(year, monthIndex + 1, 1);
      for (let i = 0; i < daysLeft; i++) {
        currDate = i + 1;
        days.push({
          full: `${nextMonth.getYear() + 1900}-${this.formatDigit(nextMonth.getMonth() + 1)}-${this.formatDigit(currDate)}`,
          date: currDate,
        });
      }
    }

    this.setState({
      days,
      start: days[0].full,
      end: days[days.length - 1].full,
    });
  }

  /* Takes an array of tag ids and returns an array of tags w/ all of their data (id, title, color, icon) */
  getTagInfo(tagIds) {
    const { tags } = this.props;
    if (tagIds) {
      return tagIds.map((tagId) => {
        const current = tags[tagId];
        current.id = tagId;
        return current;
      });
    }
    return null;
  }

  /* Formats the given number as two digits */
  formatDigit(num) {
    return num < 10 ? `0${num}` : num;
  }

  /* Increment the day in the date string by value, where date is in the format YYYY-MM-DD */
  updateDateString(date, value) {
    // convert string to a date
    const dateObj = new Date(date);
    const utcDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * -60000); // normalize date
    utcDate.setDate(utcDate.getDate() + value); // update date by value

    return utcDate.toISOString().split('T')[0]; // convert date to string w/ format YYYY-MM-DD
  }

  /* Sets stored date to previous, next or current month depending on monthType string parameter */
  changeMonth(monthType) {
    this.setState((prevState) => {
      const { full, monthIndex } = prevState.date;
      let date = new Date(full.valueOf());
      date.setDate(1); // set date to 1 to prevent issues with months not having same # of days

      if (monthType === 'curr') date = new Date(); // set date to current month
      else if (monthType === 'prev') date.setMonth(monthIndex - 1); // prev month
      else if (monthType === 'next') date.setMonth(monthIndex + 1); // next month

      const updatedIndex = date.getMonth();
      return ({
        date: {
          full: date,
          monthIndex: updatedIndex,
          month: this.formatDigit((updatedIndex + 1) % 13),
          year: date.getYear() + 1900,
        },
      });
    });
  }

  /* Sets stored date to previous month */
  prevMonth() {
    console.log('calling prev month');
    this.changeMonth('prev');
  }

  /* Sets stored date to next month */
  nextMonth() {
    this.changeMonth('next');
  }

  /* Sets calendar to current month */
  currentMonth() {
    this.changeMonth('curr');
  }

  /* Change the calendar months on left/right arrow keydown */
  handleKeyDown(e) {
    if (e.keyCode === 37) { // left arrow 
      this.prevMonth();
    } else if (e.keyCode === 39) { // right arrow
      this.nextMonth();
    }
  }

  render() {
    const { onCreateDayTag, onDeleteDayTag, dayTags, tags } = this.props;
    const { date: { full, monthIndex, month, year }, days } = this.state;
    
    const currentDay = new Date();
    const showTodayBtn = (currentDay.getMonth() !== month) || (currentDay.getYear() + 1900 !== year);

    return (
      <div className="calendar-wrapper">
        <div className="calendar-top">
          <Pagination prevClick={this.prevMonth} nextClick={this.nextMonth}>
            <h1 className="curr-date">
              <span className="curr-month">{ full.toLocaleString('default', { month: 'long' }) }</span> 
              <span className="curr-year">{ ` ${year}` }</span>
            </h1>
          </Pagination>
          {showTodayBtn && <Button btnType="btn-smaller" clicked={this.currentMonth}>Today</Button>}
        </div>

        <Calendar days={days} monthIndex={monthIndex} month={month} year={year} dayTags={dayTags} onCreateDayTag={onCreateDayTag} onDeleteDayTag={onDeleteDayTag} getTagInfo={this.getTagInfo} tagsReady={tags && Object.keys(tags).length > 0} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dayTags: state.dayTags,
  savedStart: state.savedStart,
  savedEnd: state.savedEnd,
});

const mapDispatchToProps = (dispatch) => ({
  onCreateDayTag: (tagId, date) => dispatch(actions.createDayTag(tagId, date)),
  onDeleteDayTag: (tags, date) => dispatch(actions.deleteDayTag(tags, date)),
  onGetDayTags: (month, year) => dispatch(actions.getDayTags(month, year)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainer);
