import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Day from './Day/Day';
import DayModal from './DayModal/DayModal';

import './Calendar.css';

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDayModal: false,
      selectedDayTags: null,
    };

    this.toggleDayModal = this.toggleDayModal.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragOver(e) {
    if (e.preventDefault) e.preventDefault(); // allows drop to happen
  }

  onDragEnter(e) {
    if (e.target.classList.contains('day')) e.target.classList.add('chosen-day'); // adds bg color to calendar day
  }

  onDragLeave(e) {
    if (e.target.classList.contains('day')) e.target.classList.remove('chosen-day'); // removes bg color from calendar day
  }

  onDrop(e) {
    if (e.stopPropagation) { e.stopPropagation(); }

    // creates tag elements
    const { onCreateDayTag, month, year } = this.props;
    onCreateDayTag(e.dataTransfer.getData('text/plain'), { date: e.target.getAttribute('data-date'), month, year });
    if (e.target.classList.contains('day')) e.target.classList.remove('chosen-day'); // removes bg color from calendar day
  }

  toggleDayModal(selectedDay) {
    const { getTagInfo, dayTags } = this.props;

    this.setState((prevState) => ({
      showDayModal: !(prevState.showDayModal),
      selectedDayTags: getTagInfo(dayTags[selectedDay]),
    }));
  }

  render() {
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    const { showDayModal, selectedDayTags } = this.state;
    const { days, dayTags, getTagInfo, tagsReady } = this.props;
    
    return (
      <div className="calendar">
        { daysOfWeek.map((day) => (
          <div className="cal-header">{ day }</div>
        ))}
        { days.map((day) => (
          <Day 
            full={day.full} 
            date={day.date} 
            tags={dayTags ? dayTags[day.full] : null} 
            onClick={this.toggleDayModal} 
            onDragOver={this.onDragOver}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
            getTagInfo={getTagInfo}
            tagsReady={tagsReady}
          />
        ))}

        { showDayModal && <DayModal tags={selectedDayTags} /> }
      </div>
    );
  }
}

export default Calendar;
